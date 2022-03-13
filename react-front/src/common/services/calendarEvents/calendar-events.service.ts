import {CalendarEvent} from "../../entities/CalendarEvent/calendar-event.entity";
import http from "../http/http.service";
import {ApiRoutesEnum} from "../../constants/ApiRoutesEnum";
import {AxiosError} from "axios";

export class CalendarEventsService {

    public static getEmptyEvent(): CalendarEvent {
        return {
            title: '',
            description: '',
            start: new Date().toISOString(),
        }
    }

    public static async getAllEvents(): Promise<CalendarEvent[]> {
        return new Promise((resolve, reject) => {
            http.get(ApiRoutesEnum.EVENTS).then((response) => {
                resolve(response.data);
            }).catch((error:AxiosError) => {
                reject(error);
            })
        })
    }

    public static async addCalendarEvent(event: CalendarEvent): Promise<CalendarEvent> {
        return new Promise((resolve, reject) => {
            http.post(ApiRoutesEnum.EVENTS, event).then((response) => {
                resolve(response.data);
            }).catch((error:AxiosError) => {
                reject(error);
            })
        })
    }

    public static async updateCalendarEvent(event: CalendarEvent): Promise<CalendarEvent> {
        return new Promise((resolve, reject) => {
            if (event.id == null) {
                reject('event id is null');
                return;
            }
            const url = ApiRoutesEnum.UPDATE_EVENT.replace(':id:', event.id + '');
            http.put(url, event).then((response) => {
                resolve(response.data);
            }).catch((error:AxiosError) => {
                reject(error);
            })
        })
    }
}