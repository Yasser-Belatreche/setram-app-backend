import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadDocumentDto {
    @ApiProperty({ type: String })
    @IsString()
    title: string;

    @ApiProperty({ type: String })
    @IsString()
    description: string;

    @ApiProperty({ type: [String] })
    // @IsArray()
    @IsString({ each: true })
    departments: string[];

    @ApiProperty({ type: 'string', format: 'binary' })
    document: any;
}
