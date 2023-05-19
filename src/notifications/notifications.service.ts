import { Injectable, NotFoundException } from '@nestjs/common';

import { RegisterDeviceDto } from './dtos/register-device.dto';
import { PushNotificationDto } from './dtos/push-notification.dto';
import { GetEmployeesToQueryParamsDto } from './dtos/get-employees-to-query-params.dto';

import { FcmNotifications } from '../lib/notifications/fcm-notifications';

import { prisma } from '../prisma/prisma.client';

@Injectable()
export class NotificationsService {
    async registerDevice(employeeId: string, info: RegisterDeviceDto) {
        const employee = await prisma.employee.findUnique({ where: { id: employeeId } });

        if (!employee) throw new NotFoundException(`employee ${employeeId} not found`);

        return prisma.deviceToken.create({
            data: {
                employeeId,
                imeiNo: info.imeiNo,
                deviceName: info.deviceName,
                token: info.token,
            },
        });
    }

    async unregisterDevice(employeeId: string, imeiNo: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include: { devices: true },
        });

        if (!employee) throw new NotFoundException(`employee ${employeeId} not found`);

        const deviceFound = employee.devices.find(device => device.imeiNo === imeiNo);

        if (!deviceFound)
            throw new NotFoundException(
                `employee ${employeeId} does not register any device with imei ${imeiNo}`,
            );

        return prisma.deviceToken.delete({ where: { imeiNo } });
    }

    async getEmployeesToNotify(filters: GetEmployeesToQueryParamsDto) {
        const page = filters.page ?? 1;
        const perPage = filters.perPage ?? 20;
        const departments: string[] | undefined =
            filters.departments && filters.departments.length > 0 ? filters.departments : undefined;

        const total = await prisma.employee.count({
            where: {
                devices: { some: {} },
                department: departments ? { in: departments } : undefined,
            },
        });

        const employees = await prisma.employee.findMany({
            where: {
                devices: { some: {} },
                department: departments ? { in: departments } : undefined,
            },
            include: { devices: true },
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: employees,
        };
    }

    async pushNotification(dto: PushNotificationDto) {
        const employees = await prisma.employee.findMany({
            where: { id: { in: dto.employees } },
            include: { devices: true },
        });

        const deviceTokens: string[] = [];

        employees.forEach(employee => {
            employee.devices.forEach(device => {
                deviceTokens.push(device.token);
            });
        });

        await FcmNotifications.PushToMultiple(deviceTokens, { title: dto.title, body: dto.body });
    }
}
