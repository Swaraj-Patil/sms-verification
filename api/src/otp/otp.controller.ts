import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to a phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOTP(@Body() sendOtpDto: SendOtpDto) {
    return await this.otpService.sendOTP(sendOtpDto.phone);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP for a phone number' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.otpService.verifyOTP(
      verifyOtpDto.phone,
      verifyOtpDto.otp,
    );
  }
}
