import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

class GetMyNotificationsQueryParamsDto {
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

export { GetMyNotificationsQueryParamsDto };
