import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsString, MaxDate } from 'class-validator';
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

    @ApiProperty({ enum: ['male', 'female'] })
    @IsIn(['male', 'female'])
    @IsString()
    gender: 'male' | 'female';

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
}
