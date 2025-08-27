import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
