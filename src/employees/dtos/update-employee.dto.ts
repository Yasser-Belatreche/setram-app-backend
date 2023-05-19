import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEmployeeDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    department: string;

    @ApiProperty({ enum: ['Male', 'Female'] })
    @IsIn(['Male', 'Female'])
    @IsString()
    gender: 'Male' | 'Female';

    @ApiProperty({ type: String })
    @Type(() => Date)
    @IsDate()
    birthDate: Date;

    @ApiProperty({ type: String })
    @MaxDate(new Date())
    @Type(() => Date)
    @IsDate()
    startingDate: Date;

    @ApiProperty({ type: String })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    newPassword?: string;
}
