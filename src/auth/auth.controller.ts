import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../lib/decorators/public.decorator';
import { Role } from '../lib/role';
import { Roles } from '../lib/decorators/roles.decorator';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('/admin/register')
    registerAdmin(@Body() body: RegisterAdminDto, @Headers('X-Secret-Key') secretKey: string) {
        return this.authService.registerAdmin(secretKey, body);
    }

    @Public()
    @Post('/login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Get('/me')
    @ApiBearerAuth()
    getMe(@Req() request: any) {
        return request.user;
    }

    @Get('/employee')
    @ApiBearerAuth()
    @Roles(Role.Employee, Role.Admin)
    employee(@Req() request: any) {
        return request.user;
    }
}
