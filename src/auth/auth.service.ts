import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

import { Role } from '../lib/role';
import { prisma } from '../prisma/prisma.client';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {
        if (!process.env.ADMIN_SECRET_KEY)
            throw new Error('should have the ADMIN_SECRET_KEY in the env');
    }

    async registerAdmin(secretKey: string, body: RegisterAdminDto) {
        if (secretKey !== process.env.ADMIN_SECRET_KEY)
            throw new UnauthorizedException(`invalid secret key`);

        const password = await this.encrypt(body.password);
        const email = body.email.toLowerCase().trim();

        const isEmailExist = await prisma.admin.findUnique({ where: { email } });

        if (isEmailExist) throw new BadRequestException(`${body.email} taken`);

        const id = crypto.randomUUID();

        const admin = { id, email, password };

        return prisma.admin.create({ data: admin });
    }

    async login(body: LoginDto) {
        const password = body.password.trim();
        const email = body.email.toLowerCase().trim();

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (admin) {
            if (!(await this.isPasswordMatch(admin.password, password)))
                throw new BadRequestException(`invalid credentials`);

            return {
                accessToken: await this.jwtService.signAsync({
                    id: admin.id,
                    email: admin.email,
                    role: Role.Admin,
                }),
            };
        }

        const employee = await prisma.employee.findUnique({ where: { email } });

        if (!employee) throw new BadRequestException(`invalid credentials`);

        if (!(await this.isPasswordMatch(employee.password, password)))
            throw new BadRequestException(`invalid credentials`);

        return {
            accessToken: await this.jwtService.signAsync({
                id: employee.id,
                email: employee.email,
                role: Role.Employee,
            }),
        };
    }

    private async encrypt(password: string) {
        const salt = await bcrypt.genSalt(10);

        return await bcrypt.hash(password, salt);
    }

    private async isPasswordMatch(encrypted: string, plain: string) {
        return await bcrypt.compare(plain, encrypted);
    }
}
