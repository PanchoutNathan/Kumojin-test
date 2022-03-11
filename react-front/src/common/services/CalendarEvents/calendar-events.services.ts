import {CalendarEvent} from "../../entities/CalendarEvent/calendar-event.entity";
import http from "../http/http.service";
import {ApiRoutesEnum} from "../../constants/ApiRoutesEnum";
import {AxiosError} from "axios";

export class CalendarEventsServices {

    public static getEmptyEvent(): CalendarEvent {
        return {
            title: '',
            description: '',
            start: new Date().toISOString(),
        }
    }

    public static async getAllEvents(): Promise<CalendarEvent[]> {
        return new Promise((resolve, reject) => {
            http.get(ApiRoutesEnum.GET_ALL_EVENTS).then((response) => {
                resolve(response.data);
            }).catch((error:AxiosError) => {
                reject(error);
            })
        })
    }

    public static async addCalendarEvent(event: CalendarEvent): Promise<CalendarEvent> {
        return new Promise((resolve, reject) => {
            http.post(ApiRoutesEnum.GET_ALL_EVENTS, event).then((response) => {
                resolve(response.data);
            }).catch((error:AxiosError) => {
                reject(error);
            })
        })
    }
}