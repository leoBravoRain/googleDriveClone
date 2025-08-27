import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Nest-API-REST')
    .setDescription('API documentation for this demo api-rest')
    .setVersion('1.0')
    .build();

  // Create Swagger doc
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Write Swagger spec to file
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
