import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CalendarEventModule } from '../src/calendar-event/calendar-event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from '../src/calendar-event/entities/calendar-event.entity';
import { CreateCalendarEventDto } from '../src/calendar-event/dto/create-calendar-event.dto';
import { CalendarEventService } from '../src/calendar-event/calendar-event.service';

describe('CalendarEventController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<CalendarEvent>;
  let calendarService: CalendarEventService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CalendarEventModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'admin',
          password: 'admin',
          database: 'e2e_test',
          entities: ['./**/*.entity.ts'],
          synchronize: true,
          migrations: ['dist/migrations/*{.ts,.js}'],
          migrationsTableName: 'migrations_typeorm',
          migrationsRun: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    repository = module.get('CalendarEventRepository');
    calendarService = module.get<CalendarEventService>(CalendarEventService);
    await app.init();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM calendar_events;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/calendar-events (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/calendar-events')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toEqual([]);
  });

  it('/calendar-events (POST)', async () => {
    const user: CreateCalendarEventDto = {
      title: 'Test',
      description: 'Test',
      end: '2022-03-08T01:00:00.000Z',
      start: '2022-03-08T03:30:00.000Z',
      allDay: false,
    };
    const addResponse = await request(app.getHttpServer())
      .post('/calendar-events')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
    expect(addResponse.body).toEqual({ id: expect.any(Number), ...user });

    const getResponse = await request(app.getHttpServer())
      .get('/calendar-events')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(getResponse.body).toEqual([addResponse.body]);
  });

  it('/calendar-events/:id (ID)', async () => {
    const newEvent = await calendarService.create({
      title: 'Test',
      description: 'Test',
      end: '2022-03-08T01:00:00.000Z',
      start: '2022-03-08T03:30:00.000Z',
      allDay: false,
    });

    const response = await request(app.getHttpServer())
      .put(`/calendar-events/${newEvent.id}`)
      .send({
        title: 'Test',
        description: 'Test',
        end: '2022-03-08T01:00:00.000Z',
        start: '2022-03-08T03:30:00.000Z',
        allDay: true,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      title: 'Test',
      description: 'Test',
      end: '2022-03-08T01:00:00.000Z',
      start: '2022-03-08T03:30:00.000Z',
      allDay: true,
    });
  });
});
