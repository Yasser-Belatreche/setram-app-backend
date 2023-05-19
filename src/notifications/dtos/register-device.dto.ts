import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class RegisterDeviceDto {
    @ApiProperty({ type: String })
    @IsString()
    imeiNo!: string;

    @ApiProperty({ type: String })
    @IsString()
    token!: string;

    @ApiProperty({ type: String })
    @IsString()
    deviceName!: string;
}

export { RegisterDeviceDto };
