import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { Role } from '../lib/role';
import { Roles } from '../lib/decorators/roles.decorator';

import { RegisterDeviceDto } from './dtos/register-device.dto';

import { PushNotificationDto } from './dtos/push-notification.dto';
import { GetEmployeesToNotifyQueryParamsDto } from './dtos/get-employees-to-notify-query-params.dto';

import { NotificationsService } from './notifications.service';
import { GetMyNotificationsQueryParamsDto } from './dtos/get-my-notifications-query-params.dto';

@ApiTags('notifications')
@Controller('')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get('/api/notifications/my')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getMyNotifications(@Req() req: any, @Query() query: GetMyNotificationsQueryParamsDto) {
        return this.notificationsService.getEmployeeNotifications(req.user.id, query);
    }

    @Get('/api/notifications/unread/count')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getUnreadCount(@Req() req: any) {
        return this.notificationsService.getEmployeeNotificationsUnreadCount(req.user.id);
    }

    @Put('/api/notifications/my/read')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    makeMyNotificationsAsRead(@Req() req: any) {
        return this.notificationsService.markEmployeeNotificationsAsRead(req.user.id);
    }

    @Put('/api/employees/devices')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    registerDevice(@Req() req: any, @Body() body: RegisterDeviceDto) {
        return this.notificationsService.registerDevice(req.user.id, body);
    }

    @Delete(`/api/employees/devices/:imeiNo`)
    @ApiBearerAuth()
    @Roles(Role.Employee)
    unregisterDevice(@Req() req: any, @Param('imeiNo') imeiNo: string) {
        return this.notificationsService.unregisterDevice(req.user.id, imeiNo);
    }

    @Get('/admin/notifications/employees')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getEmployeesToNotify(@Query() query: GetEmployeesToNotifyQueryParamsDto) {
        return this.notificationsService.getEmployeesToNotify(query);
    }

    @Post('/admin/notifications')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    pushNotification(@Body() body: PushNotificationDto) {
        return this.notificationsService.pushNotification(body);
    }
}
