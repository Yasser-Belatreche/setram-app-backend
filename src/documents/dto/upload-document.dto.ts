import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmptyObject, IsString } from 'class-validator';

export class UploadDocumentDto {
    @ApiProperty({ type: String })
    @IsString()
    title: string;

    @ApiProperty({ type: String })
    @IsString()
    description: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    departments: string[];

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmptyObject()
    document: any;
}
