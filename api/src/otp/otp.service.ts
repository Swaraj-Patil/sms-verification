import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { GatewayService } from '../gateway/gateway.service';
import { OTP, OTPDocument } from './schemas/otp.schema';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTP.name) private otpModel: Model<OTPDocument>,
    private readonly configService: ConfigService,
    private readonly gatewayService: GatewayService,
  ) {}

  private generateOTP(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    // Generate new OTP
    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

    // Save OTP to database
    await this.otpModel.create({
      phone,
      otp,
      expiresAt,
      verified: false,
      attempts: 0,
    });

    // Get device ID from config
    const deviceId = this.configService.get('TEXTBEE_DEVICE_ID');
    if (!deviceId) {
      throw new HttpException(
        'SMS gateway not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Send OTP via SMS
    try {
      const message = `Your verification code is: ${otp}. Valid for 10 minutes.`;
      await this.gatewayService.sendSMS(deviceId, {
        recipients: [phone],
        message: message,
        smsBody: message,
        receivers: [phone],
      });

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Failed to send OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyOTP(
    phone: string,
    otpToVerify: string,
  ): Promise<{ success: boolean; message: string }> {
    // Find the latest unverified OTP for this phone
    const otpRecord = await this.otpModel
      .findOne({
        phone,
        verified: false,
        expiresAt: { $gt: new Date() },
      })
      .sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      throw new HttpException('Too many attempts', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Update attempts
    otpRecord.attempts += 1;

    // Verify OTP
    if (otpRecord.otp !== otpToVerify) {
      await otpRecord.save();
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    // Mark as verified
    otpRecord.verified = true;
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }
}
