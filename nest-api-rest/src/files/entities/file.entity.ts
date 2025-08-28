import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true, unique: true })
  file_id: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  original_name: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  file_type: string;

  @Prop({ required: true })
  upload_date: Date;

  @Prop({ required: true })
  storage_path: string;

  @Prop({ default: null })
  user_id: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
