import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { prisma } from './prisma/prisma.client';

import { EmployeesModule } from './employees/employees.module';

@Module({
    imports: [ConfigModule.forRoot(), EmployeesModule],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await prisma.$connect();
    }

    async onModuleDestroy() {
        await prisma.$disconnect();
    }
}
