import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

import { Role } from '../lib/role';
import { Roles } from '../lib/decorators/roles.decorator';

import { EmployeesService } from './employees.service';
import { GetEmployeesParamsDto } from './dtos/get-employees-params.dto';
import { EmployeePlanningDto } from './dtos/employee-planning.dto';

@ApiTags('employees')
@Controller('/')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post('/admin/employees')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    createEmployee(@Body() body: CreateEmployeeDto) {
        return this.employeesService.createEmployee(body);
    }

    @Patch('/admin/employees/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateEmployee(@Body() body: UpdateEmployeeDto, @Param('id') id: string) {
        return this.employeesService.updateEmployee(body, id);
    }

    @Patch('/admin/employees/:id/planning')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateEmployeePlanning(@Body() body: EmployeePlanningDto, @Param('id') id: string) {
        return this.employeesService.updateEmployeePlanning(id, body);
    }

    @Delete('/admin/employees/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    deleteEmployee(@Param('id') id: string) {
        return this.employeesService.deleteEmployee(id);
    }

    @Get('/admin/employees/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getEmployee(@Param('id') id: string) {
        return this.employeesService.getEmployee(id);
    }

    @Get('/admin/employees')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getEmployees(@Query() query: GetEmployeesParamsDto) {
        return this.employeesService.getEmployees(query);
    }

    @Get('/admin/employees/:id/planning')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getEmployeePlanning(@Param('id') id: string) {
        return this.employeesService.getEmployeePlanning(id);
    }

    @Get('/api/employees/me')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getAuthEmployee(@Req() request: any) {
        return this.employeesService.getEmployee(request.user.id);
    }

    @Get('/api/employees/me/planning')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getAuthEmployeePlanning(@Req() request: any) {
        return this.employeesService.getEmployeePlanning(request.user.id);
    }
}
