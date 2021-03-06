import { Injectable } from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  }

  async update(id: number, updateCalendarEventDto: UpdateCalendarEventDto) {
    await this.calendarEventRepository.update(id, updateCalendarEventDto);
    return updateCalendarEventDto;
  }
}
