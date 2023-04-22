import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

import { AuthService } from './auth.service';

import { Public } from '../lib/decorators/public.decorator';

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
}
