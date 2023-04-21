import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

class RegisterAdminDto {
    @ApiProperty({ type: String })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ type: String })
    @MinLength(6)
    @IsString()
    password: string;
}

export { RegisterAdminDto };
