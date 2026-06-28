import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type:VersioningType.URI,
    defaultVersion:'1',
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist:true, forbidNonWhitelisted:true})
  );

  if (process.env.SWAGGER_HABILITADO === 'true') {
    const config = new DocumentBuilder()
    .setTitle('Sistema de Gestion de Proyectos')
    .setDescription( 'Descripción de la API del sistema de gestión de proyectos')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document); // Configura la ruta de Swagger
  }
  //await app.listen(process.env.PORT ?? 3000)
  
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  });
}

bootstrap();
