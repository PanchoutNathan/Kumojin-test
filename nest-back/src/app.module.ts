import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CalendarEventModule, TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
