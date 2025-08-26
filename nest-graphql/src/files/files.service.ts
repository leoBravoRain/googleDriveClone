import { Injectable } from '@nestjs/common';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  findAll(): File[] {
    return [
      {
        file_id: '1',
        filename: 'test.pdf',
      },
    ];
  }
}
