import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

class GetEmployeesToNotifyQueryParamsDto {
    @ApiProperty({ type: [String], required: false })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    departments?: string[];

    @ApiProperty({ type: Number, required: false })
    @Min(1)
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    page?: number;

    @ApiProperty({ type: Number, required: false })
    @Min(1)
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    perPage?: number;
}

export { GetEmployeesToNotifyQueryParamsDto };
