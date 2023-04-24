import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAnnouncementDto {
    @ApiProperty({ type: String })
    @IsString()
    title: string;

    @ApiProperty({ type: String })
    @IsString()
    description: string;

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    departments: string[];

    @ApiProperty({ type: Date })
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({ type: Date })
    @IsDate()
    @Type(() => Date)
    endDate: Date;
}
