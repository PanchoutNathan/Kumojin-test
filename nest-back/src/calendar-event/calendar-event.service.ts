import { Injectable } from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from "typeorm";


@Injectable()
export class CalendarEventService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventRepository: Repository<CalendarEvent>,
  ) {}

  async create(createCalendarEventDto: CreateCalendarEventDto) {
    const newTeam = await this.calendarEventRepository.create(
      createCalendarEventDto,
    );

    return await this.calendarEventRepository.save(newTeam);
  }

  findAll() {
    return this.calendarEventRepository.find();
    return `This action returns all calendarEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calendarEvent`;
  }

  update(id: number, updateCalendarEventDto: UpdateCalendarEventDto) {
    return `This action updates a #${id} calendarEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} calendarEvent`;
  }
}
