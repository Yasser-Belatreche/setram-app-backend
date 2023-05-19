import { Injectable, NotFoundException } from '@nestjs/common';

import { RegisterDeviceDto } from './dtos/register-device.dto';
import { PushNotificationDto } from './dtos/push-notification.dto';
import { GetEmployeesToNotifyQueryParamsDto } from './dtos/get-employees-to-notify-query-params.dto';

import { FcmNotifications } from '../lib/notifications/fcm-notifications';

import { prisma } from '../prisma/prisma.client';
import { GetMyNotificationsQueryParamsDto } from './dtos/get-my-notifications-query-params.dto';

@Injectable()
export class NotificationsService {
    async registerDevice(employeeId: string, info: RegisterDeviceDto) {
        const employee = await prisma.employee.findUnique({ where: { id: employeeId } });

        if (!employee) throw new NotFoundException(`employee ${employeeId} not found`);

        const deviceRegistered = await prisma.deviceToken.findUnique({
            where: { imeiNo: info.imeiNo },
        });

        if (!deviceRegistered)
            return prisma.deviceToken.create({
                data: {
                    employeeId,
                    imeiNo: info.imeiNo,
                    deviceName: info.deviceName,
                    token: info.token,
                },
            });
        else
            return prisma.deviceToken.update({
                where: { imeiNo: info.imeiNo },
                data: {
                    token: info.token,
                    deviceName: info.deviceName,
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

    async getEmployeesToNotify(filters: GetEmployeesToNotifyQueryParamsDto) {
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

        for (const employee of employees) {
            await prisma.notification.create({
                data: {
                    id: crypto.randomUUID(),
                    title: dto.title,
                    body: dto.body,
                    employeeId: employee.id,
                    read: false,
                },
            });
        }
    }

    async getEmployeeNotifications(id: string, filters: GetMyNotificationsQueryParamsDto) {
        const page = filters.page ?? 1;
        const perPage = filters.perPage ?? 20;

        const total = await prisma.notification.count({
            where: { employeeId: id },
        });

        const employees = await prisma.notification.findMany({
            where: { employeeId: id },
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: employees,
        };
    }

    async getEmployeeNotificationsUnreadCount(employeeId: string) {
        return {
            count: await prisma.notification.count({
                where: { employeeId, read: false },
            }),
        };
    }

    async markEmployeeNotificationsAsRead(employeeId: string) {
        await prisma.notification.updateMany({
            where: { employeeId, read: false },
            data: { read: true, updatedAt: new Date() },
        });
    }
}
