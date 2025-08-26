import { Query, Resolver } from '@nestjs/graphql';
import { FileType } from '../types/file.type';

@Resolver()
export class FileResolver {
  @Query(() => [FileType])
  get_all_files(): FileType[] {
    return [
      {
        file_id: '1',
        filename: 'test.pdf',
      },
    ];
  }
}
