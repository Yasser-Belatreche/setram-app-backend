import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { GetEmployeesParamsDto } from './dtos/get-employees-params.dto';

import { prisma } from '../prisma/prisma.client';

@Injectable()
export class EmployeesService {
    async createEmployee(@Body() body: CreateEmployeeDto) {
        const email = body.email.trim().toLowerCase();

        const emailExistsInAdmin = await prisma.admin.findUnique({ where: { email } });
        if (emailExistsInAdmin) throw new BadRequestException(`${body.email} is taken`);

        const emailExistsInEmployees = await prisma.employee.findUnique({ where: { email } });
        if (emailExistsInEmployees) throw new BadRequestException(`${body.email} is taken`);

        const password = await this.encrypt(body.password.trim());

        return prisma.employee.create({
            data: { ...body, password, email, id: crypto.randomUUID() },
        });
    }

    async updateEmployee(body: UpdateEmployeeDto, id: string) {
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) throw new NotFoundException(`employee not found`);

        const email = body.email.trim().toLowerCase();

        return prisma.employee.update({
            where: { id },
            data: { ...body, email, updatedAt: new Date() },
        });
    }

    async getEmployee(id: string) {
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) throw new NotFoundException(`employee not found`);

        return employee;
    }

    async deleteEmployee(id: string) {
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) throw new NotFoundException(`employee not found`);

        await prisma.employee.delete({ where: { id } });
    }

    async getEmployees(filters: GetEmployeesParamsDto) {
        const page = filters.page ?? 1;
        const perPage = filters.perPage ?? 20;

        const total = await prisma.employee.count();

        const employees = await prisma.employee.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: employees,
        };
    }

    private async encrypt(password: string) {
        const salt = await bcrypt.genSalt(10);

        return await bcrypt.hash(password, salt);
    }
}
