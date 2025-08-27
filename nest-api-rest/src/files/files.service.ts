import { Injectable } from '@nestjs/common';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
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
}
