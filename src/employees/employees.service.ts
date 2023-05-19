import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { GetEmployeesParamsDto } from './dtos/get-employees-params.dto';

import { prisma } from '../prisma/prisma.client';
import { DayTiming, EmployeePlanningDto } from './dtos/employee-planning.dto';

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
            data: {
                ...body,
                password,
                email,
                id: crypto.randomUUID(),
                employeePlanning: { create: { workTimes: { createMany: { data: [] } } } },
            },
        });
    }

    async updateEmployee(body: UpdateEmployeeDto, id: string) {
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) throw new NotFoundException(`employee not found`);

        const { newPassword, ...rest } = body;

        const email = body.email.trim().toLowerCase();
        const password = body.newPassword ? await this.encrypt(body.newPassword.trim()) : undefined;

        return prisma.employee.update({
            where: { id },
            data: { ...rest, email, password, updatedAt: new Date() },
        });
    }

    async updateEmployeePlanning(id: string, body: EmployeePlanningDto) {
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) throw new NotFoundException(`employee not found`);

        await prisma.employeePlanning.delete({ where: { employeeId: id } });

        return prisma.employee.update({
            where: { id },
            data: {
                updatedAt: new Date(),
                employeePlanning: {
                    create: {
                        workTimes: { createMany: { data: getDBTimesFromBody() } },
                        updatedAt: new Date(),
                    },
                },
            },
        });

        function getDBTimesFromBody(): WorkTimeCreateManyPlanningInput[] {
            return Object.entries(body).reduce((result, entry) => {
                const day = entry[0].toUpperCase();
                const dayTimes = entry[1] as DayTiming[];

                const temp: WorkTimeCreateManyPlanningInput[] = dayTimes.map(dayTime => {
                    return {
                        day,
                        label: dayTime.label,
                        startHour: dayTime.start.hour,
                        endHour: dayTime.end.hour,
                        startMinute: dayTime.start.minute,
                        endMinute: dayTime.end.minute,
                    };
                });

                result.push(...temp);
                return result;
            }, [] as WorkTimeCreateManyPlanningInput[]);
        }
    }

    async getEmployee(id: string) {
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) throw new NotFoundException(`employee not found`);

        return employee;
    }

    async getEmployeePlanning(id: string): Promise<EmployeePlanningDto> {
        const employee = await prisma.employee.findUnique({ where: { id } });

        if (!employee) throw new NotFoundException(`employee not found`);

        const planning = await prisma.employeePlanning.findUnique({
            where: { employeeId: id },
            include: { workTimes: true },
        });

        return getEmployeePlanningDtoFromDB();

        function getEmployeePlanningDtoFromDB(): EmployeePlanningDto {
            const result: EmployeePlanningDto = {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
            };

            if (!planning) return result;

            planning.workTimes.forEach(workTime => {
                const day = workTime.day.toLowerCase() as keyof EmployeePlanningDto;

                result[day].push({
                    label: workTime.label,
                    start: { hour: workTime.startHour, minute: workTime.startMinute },
                    end: { hour: workTime.endHour, minute: workTime.endMinute },
                });
            });

            return result;
        }
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

type WorkTimeCreateManyPlanningInput = {
    label: string;
    day: string;
    startHour: number;
    endHour: number;
    startMinute: number;
    endMinute: number;
};
