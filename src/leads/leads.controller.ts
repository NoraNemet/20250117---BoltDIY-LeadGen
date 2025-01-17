import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
    import { LeadsService } from './leads.service';

    @Controller('api/leads')
    export class LeadsController {
      constructor(private readonly leadsService: LeadsService) {}

      @Get()
      findAll() {
        return this.leadsService.findAll();
      }

      @Post()
      create(@Body() lead: any) {
        return this.leadsService.create(lead);
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.leadsService.findOne(id);
      }

      @Put(':id')
      update(@Param('id') id: string, @Body() lead: any) {
        return this.leadsService.update(id, lead);
      }

      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.leadsService.remove(id);
      }
    }
