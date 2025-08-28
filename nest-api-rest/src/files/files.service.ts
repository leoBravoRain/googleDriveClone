import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { File, FileDocument } from './entities/file.entity';
import { MinioService } from './minio.service';
import { UploadFileResponseDto } from './dto/upload-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private minioService: MinioService,
  ) {}

  async findAll(): Promise<File[]> {
    try {
      // TODO: move to separate service and define axios object to manage API Rest calls
      // communicate with backend service
      const response = await fetch(process.env.API_FILES_URL || '');

      if (!response.ok) {
        throw new Error('API failed with status: ' + response.status);
      }

      console.log('RESPONSE', response);

      const data = (await response.json()) as { files: File[] };

      return data.files;
    } catch (e) {
      console.log('Error in findAll', e);
      throw e;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadFileResponseDto> {
    try {
      // Validate file object
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.originalname) {
        throw new Error('File originalname is missing');
      }

      if (!file.buffer) {
        throw new Error('File buffer is missing');
      }

      // Generate unique file ID
      const fileId = uuidv4();

      // Create file path in MinIO
      const filePath = `${fileId}/${file.originalname}`;

      // Upload file to MinIO
      await this.minioService.uploadFile(filePath, file.buffer, file.mimetype);

      // Save metadata to MongoDB
      const fileMetadata = new this.fileModel({
        file_id: fileId,
        filename: file.originalname,
        original_name: file.originalname,
        size: file.size,
        file_type: file.mimetype,
        upload_date: new Date(),
        storage_path: filePath,
        user_id: null, // Will be used when we add authentication
      });

      await fileMetadata.save();

      return {
        message: 'File uploaded successfully',
        file_id: fileId,
        filename: file.originalname,
        size: file.size,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Upload failed: ${errorMessage}`);
    }
  }
}
