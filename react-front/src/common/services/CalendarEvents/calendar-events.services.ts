import {CalendarEvent} from "../../entities/CalendarEvent/calendar-event.entity";

export class CalendarEventsServices {

    public static getEmptyEvent(): CalendarEvent {
        return {
            title: '',
            description: '',
            start: new Date().toISOString(),
        }
    }
}