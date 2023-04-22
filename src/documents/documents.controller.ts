import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    ParseFilePipeBuilder,
    Patch,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { DocumentsService } from './documents.service';

import { Role } from '../lib/role';
import { Roles } from '../lib/decorators/roles.decorator';

import { UploadDocumentDto } from './dto/upload-document.dto';
import { GetDocumentsParamsDto } from './dto/get-documents-params.dto';

@ApiTags('documents')
@Controller('/')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post('/admin/documents/upload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('document'))
    @ApiBearerAuth()
    @Roles(Role.Admin)
    uploadDocument(
        @Body() body: UploadDocumentDto,
        @Headers('host') host: string,
        @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: /pdf/ }).build())
        file: Express.Multer.File,
    ) {
        return this.documentsService.uploadDocument(body, file, host);
    }

    @Get('/admin/documents')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getDocuments(@Query() filters: GetDocumentsParamsDto) {
        return this.documentsService.getDocuments(filters);
    }

    @Get('/admin/documents/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getDocument(@Param('id') id: string) {
        return this.documentsService.getDocument(id);
    }

    @Delete('/admin/documents/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    deleteDocument(@Param('id') id: string) {
        return this.documentsService.deleteDocument(id);
    }

    @Patch('/admin/documents/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('document'))
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateDocument(
        @Param('id') id: string,
        @Body() body: UploadDocumentDto,
        @Headers('host') host: string,
        @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: /pdf/ }).build())
        file: Express.Multer.File | undefined,
    ) {
        return this.documentsService.updateDocument(id, body, file, host);
    }

    @Get('/api/documents/my')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getEmployeeDocuments(@Req() req: any) {
        return this.documentsService.getEmployeeDocuments(req.user.id);
    }

    @Get('/api/documents/my/:id')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getEmployeeDocument(@Req() req: any, @Param('id') id: string) {
        return this.documentsService.getEmployeeDocumentById(req.user.id, id);
    }
}
