import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UploadDocumentDto } from './dto/upload-document.dto';
import { GetDocumentsParamsDto } from './dto/get-documents-params.dto';

import { prisma } from '../prisma/prisma.client';

@Injectable()
export class DocumentsService {
    async uploadDocument(body: UploadDocumentDto, file: Express.Multer.File, host: string) {
        const document = {
            id: crypto.randomUUID(),
            title: body.title.trim(),
            description: body.description.trim(),
            departments: body.departments,
            documentPath: file.path,
            documentOriginName: file.originalname,
            link: '',
        };

        document.documentPath = `public/${document.id}/${document.documentOriginName}`;
        document.link = `${host}/${document.id}/${document.documentOriginName}`;

        await fs.promises.mkdir(`public/${document.id}`, { recursive: true });
        await fs.promises.copyFile(file.path, document.documentPath);
        await fs.promises.unlink(file.path);

        return prisma.document.create({ data: document });
    }

    async deleteDocument(id: string) {
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document) throw new NotFoundException('Document not found');

        await fs.promises.unlink(document.documentPath);
        await fs.promises.rmdir(path.dirname(document.documentPath));

        return prisma.document.delete({ where: { id } });
    }

    async updateDocument(
        id: string,
        body: UploadDocumentDto,
        newFile: Express.Multer.File | undefined,
        host: string,
    ) {
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document) throw new NotFoundException('Document not found');

        const updatedDocument = {
            title: body.title.trim(),
            description: body.description.trim(),
            departments: body.departments,
            documentPath: newFile ? newFile.path : document.documentPath,
            documentOriginName: newFile ? newFile.originalname : document.documentOriginName,
            link: document.link,
            updatedAt: new Date(),
        };

        if (newFile) {
            updatedDocument.documentPath = `public/${document.id}/${newFile.originalname}`;
            updatedDocument.link = `${host}/${document.id}/${newFile.originalname}`;

            await fs.promises.mkdir(`public/${document.id}`, { recursive: true });
            await fs.promises.copyFile(newFile.path, updatedDocument.documentPath);
            await fs.promises.unlink(newFile.path);

            await fs.promises.unlink(document.documentPath);
        }

        return prisma.document.update({
            where: { id },
            data: updatedDocument,
        });
    }

    async getDocuments(filters: GetDocumentsParamsDto) {
        const page = filters.page ?? 1;
        const perPage = filters.perPage ?? 20;

        const total = await prisma.employee.count();

        const employees = await prisma.document.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: employees,
        };
    }

    async getDocument(id: string) {
        const document = await prisma.document.findUnique({
            where: { id },
        });

        if (!document) throw new NotFoundException('Document not found');

        return document;
    }

    async getEmployeeDocuments(id: string) {
        const employee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!employee) throw new NotFoundException('Document not found');

        const documents = await prisma.document.findMany({
            where: { departments: { has: employee.department } },
        });

        return documents;
    }

    async getEmployeeDocumentById(id: string, documentId: string) {
        const documents = await this.getEmployeeDocuments(id);

        const document = documents.find(document => document.id === documentId);

        if (!document) throw new NotFoundException('Document not found');

        return document;
    }
}
