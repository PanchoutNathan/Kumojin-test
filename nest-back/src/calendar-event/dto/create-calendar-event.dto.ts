export class CreateCalendarEventDto {
  title: string;
  description: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
}
