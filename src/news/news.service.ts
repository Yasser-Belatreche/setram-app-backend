import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateAnnouncementDto } from './dto/annoucements/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/annoucements/update-announcement.dto';
import { GetAnnouncementsParamsDto } from './dto/annoucements/get-announcements-params.dto';

import { CreateEventDto } from './dto/events/create-event.dto';
import { UpdateEventDto } from './dto/events/update-event.dto';
import { GetEventsParamsDto } from './dto/events/get-events-params.dto';

import { CreateJobPostDto } from './dto/jobs/create-job-post.dto';
import { UpdateJobPostDto } from './dto/jobs/update-job-post.dto';
import { GetJobPostsParamsDto } from './dto/jobs/get-job-posts-params.dto';

import { CreateWorkshopDto } from './dto/workshops/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/workshops/update-workshop.dto';
import { GetWorkshopsParamsDto } from './dto/workshops/get-workshops-params.dto';

import { prisma } from '../prisma/prisma.client';

@Injectable()
export class NewsService {
    createAnnouncement(body: CreateAnnouncementDto) {
        return prisma.announcement.create({
            data: {
                id: crypto.randomUUID(),
                title: body.title,
                description: body.description,
                departments: body.departments,
                startDate: body.startDate,
                endDate: body.endDate,
            },
        });
    }

    async updateAnnouncement(body: UpdateAnnouncementDto, id: string) {
        const announcement = await prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) throw new NotFoundException('Announcement not found');

        return prisma.announcement.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                departments: body.departments,
                startDate: body.startDate,
                endDate: body.endDate,
                updatedAt: new Date(),
            },
        });
    }

    async deleteAnnouncement(id: string) {
        const announcement = await prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) throw new NotFoundException('Announcement not found');

        return prisma.announcement.delete({
            where: { id },
        });
    }

    async getAdminAnnouncements(query: GetAnnouncementsParamsDto) {
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.announcement.count();

        const list = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: list.map(l => ({
                ...l,
                isActive: l.startDate.getTime() <= Date.now() && l.endDate.getTime() >= Date.now(),
            })),
        };
    }

    async getAdminAnnouncementById(id: string) {
        const announcement = await prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) throw new NotFoundException('Announcement not found');

        return announcement;
    }

    async getAnnouncements(query: GetAnnouncementsParamsDto, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.announcement.count({
            where: {
                startDate: { gte: new Date() },
                endDate: { lte: new Date() },
                departments: { has: employee.department },
            },
        });

        const list = await prisma.announcement.findMany({
            where: {
                startDate: { gte: new Date() },
                endDate: { lte: new Date() },
                departments: { has: employee.department },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            list,
            pagination: { total, totalPages: Math.ceil(total / perPage) },
        };
    }

    async getAnnouncementById(id: string, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const announcement = await prisma.announcement.findFirst({
            where: { id, departments: { has: employee.department } },
        });

        if (!announcement) throw new NotFoundException('Announcement not found');

        return announcement;
    }

    createEvent(body: CreateEventDto) {
        return prisma.event.create({
            data: {
                id: crypto.randomUUID(),
                title: body.title,
                description: body.description,
                departments: body.departments,
                eventDate: body.eventDate,
                startDate: body.startDate,
                endDate: body.endDate,
            },
        });
    }

    updateEvent(body: UpdateEventDto, id: string) {
        const event = prisma.event.findUnique({
            where: { id },
        });

        if (!event) throw new NotFoundException('Event not found');

        return prisma.event.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                departments: body.departments,
                eventDate: body.eventDate,
                startDate: body.startDate,
                endDate: body.endDate,
                updatedAt: new Date(),
            },
        });
    }

    async deleteEvent(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) throw new NotFoundException('Event not found');

        return prisma.event.delete({
            where: { id },
        });
    }

    async getAdminEvents(query: GetEventsParamsDto) {
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.event.count();

        const list = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: list.map(l => ({
                ...l,
                isActive: l.startDate.getTime() <= Date.now() && l.endDate.getTime() >= Date.now(),
            })),
        };
    }

    async getAdminEventById(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) throw new NotFoundException('Event not found');

        return event;
    }

    async getEvents(query: GetEventsParamsDto, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.event.count({
            where: {
                startDate: { gte: new Date() },
                endDate: { lte: new Date() },
                departments: { has: employee.department },
            },
        });

        const list = await prisma.event.findMany({
            where: {
                startDate: { gte: new Date() },
                endDate: { lte: new Date() },
                departments: { has: employee.department },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            list,
            pagination: { total, totalPages: Math.ceil(total / perPage) },
        };
    }

    async getEventById(id: string, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const event = await prisma.event.findFirst({
            where: { id, departments: { has: employee.department } },
        });

        if (!event) throw new NotFoundException('Event not found');

        return event;
    }

    createJob(body: CreateJobPostDto) {
        return prisma.jobPost.create({
            data: {
                id: crypto.randomUUID(),
                title: body.title,
                description: body.description,
                departments: body.departments,
                location: body.location,
                salary: body.salary,
                experience: body.experience,
                education: body.education,
                skills: body.skills,
                benefits: body.benefits,
                contact: body.contact,
                applicationDeadline: body.applicationDeadline,
            },
        });
    }

    async updateJob(body: UpdateJobPostDto, id: string) {
        const job = await prisma.jobPost.findUnique({
            where: { id },
        });

        if (!job) throw new NotFoundException('Job not found');

        return prisma.jobPost.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                departments: body.departments,
                location: body.location,
                salary: body.salary,
                experience: body.experience,
                education: body.education,
                skills: body.skills,
                benefits: body.benefits,
                contact: body.contact,
                applicationDeadline: body.applicationDeadline,
                updatedAt: new Date(),
            },
        });
    }

    async deleteJob(id: string) {
        const job = await prisma.jobPost.findUnique({
            where: { id },
        });

        if (!job) throw new NotFoundException('Job not found');

        return prisma.jobPost.delete({
            where: { id },
        });
    }

    async getAdminJobs(query: GetJobPostsParamsDto) {
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.jobPost.count();

        const list = await prisma.jobPost.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: list.map(l => ({
                ...l,
                isActive: l.applicationDeadline.getTime() >= Date.now(),
            })),
        };
    }

    async getAdminJobById(id: string) {
        const job = await prisma.jobPost.findUnique({
            where: { id },
        });

        if (!job) throw new NotFoundException('Job not found');

        return job;
    }

    async getJobs(query: GetJobPostsParamsDto, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.jobPost.count({
            where: {
                applicationDeadline: { gte: new Date() },
                departments: { has: employee.department },
            },
        });

        const list = await prisma.jobPost.findMany({
            where: {
                applicationDeadline: { gte: new Date() },
                departments: { has: employee.department },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            list,
            pagination: { total, totalPages: Math.ceil(total / perPage) },
        };
    }

    async getJobById(id: string, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const job = await prisma.jobPost.findFirst({
            where: { id, departments: { has: employee.department } },
        });

        if (!job) throw new NotFoundException('Job not found');

        return job;
    }

    createWorkshop(body: CreateWorkshopDto) {
        return prisma.workshop.create({
            data: {
                id: crypto.randomUUID(),
                title: body.title,
                description: body.description,
                departments: body.departments,
                workshopDate: body.workshopDate,
                startDate: body.startDate,
                endDate: body.endDate,
            },
        });
    }

    async updateWorkshop(body: UpdateWorkshopDto, id: string) {
        const workshop = await prisma.workshop.findUnique({
            where: { id },
        });

        if (!workshop) throw new NotFoundException('Workshop not found');

        return prisma.workshop.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                departments: body.departments,
                workshopDate: body.workshopDate,
                startDate: body.startDate,
                endDate: body.endDate,
                updatedAt: new Date(),
            },
        });
    }

    async deleteWorkshop(id: string) {
        const workshop = await prisma.workshop.findUnique({
            where: { id },
        });

        if (!workshop) throw new NotFoundException('Workshop not found');

        return prisma.workshop.delete({
            where: { id },
        });
    }

    async getAdminWorkshops(query: GetWorkshopsParamsDto) {
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.workshop.count();

        const list = await prisma.workshop.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            pagination: { total, totalPages: Math.ceil(total / perPage) },
            list: list.map(l => ({
                ...l,
                isActive: l.startDate.getTime() <= Date.now() && l.endDate.getTime() >= Date.now(),
            })),
        };
    }

    async getAdminWorkshopById(id: string) {
        const workshop = await prisma.workshop.findUnique({
            where: { id },
        });

        if (!workshop) throw new NotFoundException('Workshop not found');

        return workshop;
    }

    async getWorkshops(query: GetWorkshopsParamsDto, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const page = query.page ?? 1;
        const perPage = query.perPage ?? 30;

        const total = await prisma.workshop.count({
            where: {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
                departments: { has: employee.department },
            },
        });

        const list = await prisma.workshop.findMany({
            where: {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
                departments: { has: employee.department },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            list,
            pagination: { total, totalPages: Math.ceil(total / perPage) },
        };
    }

    async getWorkshopById(id: string, employeeId: string) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) throw new NotFoundException('Employee not found');

        const workshop = await prisma.workshop.findFirst({
            where: { id, departments: { has: employee.department } },
        });

        if (!workshop) throw new NotFoundException('Workshop not found');

        return workshop;
    }
}
