import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.useStaticAssets(join(__dirname, '..', 'public'));

    const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle('SETRAM App Backend')
            .setDescription('SETRAM App Backend API documentation')
            .addBearerAuth({ name: 'token', type: 'http' })
            .setVersion('1.0.0')
            .build(),
    );

    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
