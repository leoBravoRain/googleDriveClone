import { Resolver, Query } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { File } from './entities/file.entity';

@Resolver(() => File)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => [File], { name: 'files' })
  findAll() {
    return this.filesService.findAll();
  }
}
