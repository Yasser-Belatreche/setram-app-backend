import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAnnouncementsParamsDto {
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
