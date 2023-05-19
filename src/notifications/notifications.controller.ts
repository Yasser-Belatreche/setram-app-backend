import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { Role } from '../lib/role';
import { Roles } from '../lib/decorators/roles.decorator';

import { RegisterDeviceDto } from './dtos/register-device.dto';

import { PushNotificationDto } from './dtos/push-notification.dto';
import { GetEmployeesToNotifyQueryParamsDto } from './dtos/get-employees-to-notify-query-params.dto';

import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

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
