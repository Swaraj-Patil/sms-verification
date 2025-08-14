import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OTPDocument = OTP & Document;

@Schema({ timestamps: true })
export class OTP {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  verifiedAt?: Date;

  @Prop({ default: 0 })
  attempts: number;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
