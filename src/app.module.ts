import { join } from 'path';
import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { prisma } from './prisma/prisma.client';

import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { DocumentsModule } from './documents/documents.module';
import { EmployeesModule } from './employees/employees.module';

import { AuthGuard } from './lib/guards/auth.guard';
import { RolesGuard } from './lib/guards/roles.guard';
import { FcmNotifications } from './lib/notifications/fcm-notifications';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        ConfigModule.forRoot(),
        EmployeesModule,
        AuthModule,
        DocumentsModule,
        NewsModule,
        NotificationsModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await prisma.$connect();
        FcmNotifications.Init();
    }

    async onModuleDestroy() {
        await prisma.$disconnect();
    }
}
