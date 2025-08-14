import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'The phone number to send OTP to',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'The phone number to verify OTP for',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'The OTP code to verify',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  otp: string;
}
