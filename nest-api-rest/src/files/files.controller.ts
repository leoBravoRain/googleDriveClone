import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: 200, description: 'Get all files' })
  @ApiResponse({ status: 404, description: 'No files found' })
  findAll() {
    return this.filesService.findAll();
  }
}
