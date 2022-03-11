export interface CalendarEvent {
    id?: number;
    title?: string;
    description?: string;
    start: string | Date;
    end?: string | Date;
}