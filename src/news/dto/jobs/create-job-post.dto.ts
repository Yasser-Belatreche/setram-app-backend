import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobPostDto {
    @ApiProperty({ type: String })
    @IsString()
    title: string;

    @ApiProperty({ type: String })
    @IsString()
    description: string;

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    departments: string[];

    @ApiProperty({ type: String })
    @IsString()
    location: string;

    @ApiProperty({ type: String })
    @IsString()
    salary: string;

    @ApiProperty({ type: String })
    @IsString()
    experience: string;

    @ApiProperty({ type: String })
    @IsString()
    education: string;

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    @IsArray()
    skills: string[];

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    @IsArray()
    benefits: string[];

    @ApiProperty({ type: String })
    @IsString()
    contact: string;

    @ApiProperty({ type: Date })
    @IsDate()
    @Type(() => Date)
    applicationDeadline: Date;
}
