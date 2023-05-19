import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

class PushNotificationDto {
    @ApiProperty({ type: String })
    @IsString({ each: true })
    @ArrayNotEmpty()
    @IsArray()
    employees: string[];

    @ApiProperty({ type: String })
    @IsString()
    title: string;

    @ApiProperty({ type: String })
    @IsString()
    body: string;
}

export { PushNotificationDto };
