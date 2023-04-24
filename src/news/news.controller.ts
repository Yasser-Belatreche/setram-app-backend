import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';

import { CreateAnnouncementDto } from './dto/annoucements/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/annoucements/update-announcement.dto';
import { GetAnnouncementsParamsDto } from './dto/annoucements/get-announcements-params.dto';

import { UpdateEventDto } from './dto/events/update-event.dto';
import { CreateEventDto } from './dto/events/create-event.dto';
import { GetEventsParamsDto } from './dto/events/get-events-params.dto';

import { CreateJobPostDto } from './dto/jobs/create-job-post.dto';
import { UpdateJobPostDto } from './dto/jobs/update-job-post.dto';
import { GetJobPostsParamsDto } from './dto/jobs/get-job-posts-params.dto';

import { CreateWorkshopDto } from './dto/workshops/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/workshops/update-workshop.dto';
import { GetWorkshopsParamsDto } from './dto/workshops/get-workshops-params.dto';

import { NewsService } from './news.service';

import { Role } from '../lib/role';
import { Roles } from '../lib/decorators/roles.decorator';

@ApiTags('news')
@Controller('/')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post('/admin/news/announcements')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    createAnnouncement(@Body() body: CreateAnnouncementDto) {
        return this.newsService.createAnnouncement(body);
    }

    @Patch('/admin/news/announcements/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateAnnouncement(@Body() body: UpdateAnnouncementDto, @Param('id') id: string) {
        return this.newsService.updateAnnouncement(body, id);
    }

    @Delete('/admin/news/announcements/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    deleteAnnouncement(@Param('id') id: string) {
        return this.newsService.deleteAnnouncement(id);
    }

    @Get('/admin/news/announcements')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminAnnouncements(@Query() query: GetAnnouncementsParamsDto) {
        return this.newsService.getAdminAnnouncements(query);
    }

    @Get('/admin/news/announcements/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminAnnouncementById(@Param('id') id: string) {
        return this.newsService.getAdminAnnouncementById(id);
    }

    @Get('/api/news/announcements')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getAnnouncements(@Query() query: GetAnnouncementsParamsDto, @Req() req: any) {
        return this.newsService.getAnnouncements(query, req.user.id);
    }

    @Get('/api/news/announcements/:id')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getAnnouncementById(@Param('id') id: string, @Req() req: any) {
        return this.newsService.getAnnouncementById(id, req.user.id);
    }

    @Post('/admin/news/events')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    createEvent(@Body() body: CreateEventDto) {
        return this.newsService.createEvent(body);
    }

    @Patch('/admin/news/events/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateEvent(@Body() body: UpdateEventDto, @Param('id') id: string) {
        return this.newsService.updateEvent(body, id);
    }

    @Delete('/admin/news/events/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    deleteEvent(@Param('id') id: string) {
        return this.newsService.deleteEvent(id);
    }

    @Get('/admin/news/events')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminEvents(@Query() query: GetEventsParamsDto) {
        return this.newsService.getAdminEvents(query);
    }

    @Get('/admin/news/events/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminEventById(@Param('id') id: string) {
        return this.newsService.getAdminEventById(id);
    }

    @Get('/api/news/events')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getEvents(@Query() query: GetEventsParamsDto, @Req() req: any) {
        return this.newsService.getEvents(query, req.user.id);
    }

    @Get('/api/news/events/:id')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getEventById(@Param('id') id: string, @Req() req: any) {
        return this.newsService.getEventById(id, req.user.id);
    }

    @Post('/admin/news/jobs')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    createJob(@Body() body: CreateJobPostDto) {
        return this.newsService.createJob(body);
    }

    @Patch('/admin/news/jobs/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateJob(@Body() body: UpdateJobPostDto, @Param('id') id: string) {
        return this.newsService.updateJob(body, id);
    }

    @Delete('/admin/news/jobs/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    deleteJob(@Param('id') id: string) {
        return this.newsService.deleteJob(id);
    }

    @Get('/admin/news/jobs')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminJobs(@Query() query: GetJobPostsParamsDto) {
        return this.newsService.getAdminJobs(query);
    }

    @Get('/admin/news/jobs/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminJobById(@Param('id') id: string) {
        return this.newsService.getAdminJobById(id);
    }

    @Get('/api/news/jobs')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getJobs(@Query() query: GetJobPostsParamsDto, @Req() req: any) {
        return this.newsService.getJobs(query, req.user.id);
    }

    @Get('/api/news/jobs/:id')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getJobById(@Param('id') id: string, @Req() req: any) {
        return this.newsService.getJobById(id, req.user.id);
    }

    @Post('/admin/news/workshops')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    createWorkshop(@Body() body: CreateWorkshopDto) {
        return this.newsService.createWorkshop(body);
    }

    @Patch('/admin/news/workshops/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    updateWorkshop(@Body() body: UpdateWorkshopDto, @Param('id') id: string) {
        return this.newsService.updateWorkshop(body, id);
    }

    @Delete('/admin/news/workshops/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    deleteWorkshop(@Param('id') id: string) {
        return this.newsService.deleteWorkshop(id);
    }

    @Get('/admin/news/workshops')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminWorkshops(@Query() query: GetWorkshopsParamsDto) {
        return this.newsService.getAdminWorkshops(query);
    }

    @Get('/admin/news/workshops/:id')
    @ApiBearerAuth()
    @Roles(Role.Admin)
    getAdminWorkshopById(@Param('id') id: string) {
        return this.newsService.getAdminWorkshopById(id);
    }

    @Get('/api/news/workshops')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getWorkshops(@Query() query: GetWorkshopsParamsDto, @Req() req: any) {
        return this.newsService.getWorkshops(query, req.user.id);
    }

    @Get('/api/news/workshops/:id')
    @ApiBearerAuth()
    @Roles(Role.Employee)
    getWorkshopById(@Param('id') id: string, @Req() req: any) {
        return this.newsService.getWorkshopById(id, req.user.id);
    }
}
