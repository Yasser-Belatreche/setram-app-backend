import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

import { Role } from '../lib/role';
import { Roles } from '../lib/decorators/roles.decorator';

import { EmployeesService } from './employees.service';
import { GetEmployeesParamsDto } from './dtos/get-employees-params.dto';

@ApiTags('employees')
@Controller('/admin/employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post('/')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    createEmployee(@Body() body: CreateEmployeeDto) {
        return this.employeesService.createEmployee(body);
    }

    @Patch('/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateEmployee(@Body() body: UpdateEmployeeDto, @Param('id') id: string) {
        return this.employeesService.updateEmployee(body, id);
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    deleteEmployee(@Param('id') id: string) {
        return this.employeesService.deleteEmployee(id);
    }

    @Get('/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getEmployee(@Param('id') id: string) {
        return this.employeesService.getEmployee(id);
    }

    @Get('/')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getEmployees(@Query() query: GetEmployeesParamsDto) {
        return this.employeesService.getEmployees(query);
    }
}
