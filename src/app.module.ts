import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { prisma } from './prisma/prisma.client';

import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { APP_GUARD } from '@nestjs/core';

import { AuthGuard } from './lib/guards/auth.guard';
import { RolesGuard } from './lib/guards/roles.guard';

@Module({
    imports: [ConfigModule.forRoot(), EmployeesModule, AuthModule],
    providers: [
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await prisma.$connect();
    }

    async onModuleDestroy() {
        await prisma.$disconnect();
    }
}
