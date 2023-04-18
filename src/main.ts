import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

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
