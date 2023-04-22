import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmptyObject,
    IsNumber,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

class Time {
    @ApiProperty({ type: Number })
    @Max(23)
    @Min(0)
    @IsNumber()
    hour: number;

    @ApiProperty({ type: Number })
    @Max(59)
    @Min(0)
    @IsNumber()
    minute: number;
}

export class DayTiming {
    @ApiProperty({ type: String })
    @IsString()
    label: string;

    @ApiProperty({ type: Time })
    @ValidateNested()
    @Type(() => Time)
    @IsNotEmptyObject()
    start: Time;

    @ApiProperty({ type: Time })
    @ValidateNested()
    @Type(() => Time)
    @IsNotEmptyObject()
    end: Time;
}

export class EmployeePlanningDto {
    @ApiProperty({ type: [DayTiming] })
    @Type(() => DayTiming)
    @ValidateNested({ each: true })
    @IsArray()
    sunday: DayTiming[];

    @ApiProperty({ type: [DayTiming] })
    @Type(() => DayTiming)
    @ValidateNested({ each: true })
    @IsArray()
    monday: DayTiming[];

    @ApiProperty({ type: [DayTiming] })
    @Type(() => DayTiming)
    @ValidateNested({ each: true })
    @IsArray()
    tuesday: DayTiming[];

    @ApiProperty({ type: [DayTiming] })
    @Type(() => DayTiming)
    @ValidateNested({ each: true })
    @IsArray()
    wednesday: DayTiming[];

    @ApiProperty({ type: [DayTiming] })
    @Type(() => DayTiming)
    @ValidateNested({ each: true })
    @IsArray()
    thursday: DayTiming[];

    @ApiProperty({ type: [DayTiming] })
    @Type(() => DayTiming)
    @ValidateNested({ each: true })
    @IsArray()
    friday: DayTiming[];

    @ApiProperty({ type: [DayTiming] })
    @Type(() => DayTiming)
    @ValidateNested({ each: true })
    @IsArray()
    saturday: DayTiming[];
}
