import React, {useEffect, useState} from 'react';
import './App.scss';
import DateAdapter from '@mui/lab/AdapterMoment';

import {AppBar, Container, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from '@fullcalendar/moment-timezone'

import timeGridPlugin from '@fullcalendar/timegrid'
import {DatePicker, DateTimePicker, DesktopTimePicker, LocalizationProvider} from '@mui/lab';
import 'moment/locale/en-ca';
import 'moment/locale/fr';
import {EditCalendarEventModal} from "./components/EditCalendarEventModal/EditCalendarEventModal";
import {CalendarEvent} from "./common/entities/CalendarEvent/calendar-event.entity";
import {DateSelectArg} from "@fullcalendar/core";
import {CalendarEventsServices} from "./common/services/CalendarEvents/calendar-events.services";
import moment from "moment-timezone/moment-timezone-utils";

import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/es-us';

interface State {
  events: any[];
  timeZone: string;
  editModalIsOpen: boolean;
  calendarEvent?: CalendarEvent;
}

function App() {
  const allTimesZone = ["Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Algiers","Africa/Asmara","Africa/Bamako","Africa/Bangui","Africa/Banjul","Africa/Bissau","Africa/Blantyre","Africa/Brazzaville","Africa/Bujumbura","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/Conakry","Africa/Dakar","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Douala","Africa/El_Aaiun","Africa/Freetown","Africa/Gaborone","Africa/Harare","Africa/Johannesburg","Africa/Juba","Africa/Kampala","Africa/Khartoum","Africa/Kigali","Africa/Kinshasa","Africa/Lagos","Africa/Libreville","Africa/Lome","Africa/Luanda","Africa/Lubumbashi","Africa/Lusaka","Africa/Malabo","Africa/Maputo","Africa/Maseru","Africa/Mbabane","Africa/Mogadishu","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Niamey","Africa/Nouakchott","Africa/Ouagadougou","Africa/Porto-Novo","Africa/Sao_Tome","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Anguilla","America/Antigua","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Aruba","America/Asuncion","America/Atikokan","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Cayenne","America/Cayman","America/Chicago","America/Chihuahua","America/Costa_Rica","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Dominica","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fort_Nelson","America/Fortaleza","America/Glace_Bay","America/Goose_Bay","America/Grand_Turk","America/Grenada","America/Guadeloupe","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Indianapolis","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Inuvik","America/Iqaluit","America/Jamaica","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/Kralendijk","America/La_Paz","America/Lima","America/Los_Angeles","America/Lower_Princes","America/Maceio","America/Managua","America/Manaus","America/Marigot","America/Martinique","America/Matamoros","America/Mazatlan","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Montserrat","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Nuuk","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Barthelemy","America/St_Johns","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Tortola","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/McMurdo","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Arctic/Longyearbyen","Asia/Aden","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Baghdad","Asia/Bahrain","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Chita","Asia/Choibalsan","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kathmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Kuwait","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Muscat","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Phnom_Penh","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qostanay","Asia/Qyzylorda","Asia/Riyadh","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vientiane","Asia/Vladivostok","Asia/Yakutsk","Asia/Yangon","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/St_Helena","Atlantic/Stanley","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/Perth","Australia/Sydney","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Bratislava","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Busingen","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Guernsey","Europe/Helsinki","Europe/Isle_of_Man","Europe/Istanbul","Europe/Jersey","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Lisbon","Europe/Ljubljana","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Mariehamn","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Oslo","Europe/Paris","Europe/Podgorica","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/San_Marino","Europe/Sarajevo","Europe/Saratov","Europe/Simferopol","Europe/Skopje","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vaduz","Europe/Vatican","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zagreb","Europe/Zaporozhye","Europe/Zurich","Indian/Antananarivo","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Comoro","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Mayotte","Indian/Reunion","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Chuuk","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Midway","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Saipan","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Wake","Pacific/Wallis","UTC"];
  const [state, setState] = useState<State>({
    // events: [
    //   {
    //     "title": "All Day Event",
    //     "start": "2022-03-01"
    //   },
    //   {
    //     "title": "Long Event",
    //     "start": "2022-03-07",
    //     "end": "2022-03-10"
    //   },
    //   {
    //     "groupId": "999",
    //     "title": "Repeating Event",
    //     "start": "2022-03-09T16:00:00+00:00"
    //   },
    //   {
    //     "groupId": "999",
    //     "title": "Repeating Event",
    //     "start": "2022-03-16T16:00:00+00:00"
    //   },
    //   {
    //     "title": "Conference",
    //     "start": "2022-03-09",
    //     "end": "2022-03-11"
    //   },
    //   {
    //     "title": "Meeting",
    //     "start": "2022-03-10T10:30:00+00:00",
    //     "end": "2022-03-10T12:30:00+00:00"
    //   },
    //   {
    //     "title": "Lunch",
    //     "start": "2022-03-10T12:00:00+00:00"
    //   },
    //   {
    //     "title": "Birthday Party",
    //     "start": "2022-03-11T07:00:00+00:00"
    //   },
    //   {
    //     "url": "http://google.com/",
    //     "title": "Click for Google",
    //     "start": "2022-03-28"
    //   }
    // ],
    events: [],
    timeZone: moment.tz.guess(),
    editModalIsOpen: false
  })
  const local = navigator.language;
  moment.locale(local);
  moment.tz.setDefault(state.timeZone);



  useEffect(() => {
    CalendarEventsServices.getAllEvents().then((events) => {
      setState(prevState => ({...prevState, events}));
    });
  }, []);


  const handleCalendarSelect = (event: DateSelectArg): void => {
    const calendarEvent: CalendarEvent = CalendarEventsServices.getEmptyEvent();
    calendarEvent.start = event.start.toISOString();
    calendarEvent.end = event.end.toISOString();
    setState(prevState => ({...prevState, calendarEvent, editModalIsOpen: true}));
  }

  const handleChangeTimezone = ( event: React.MouseEvent<HTMLElement>, timeZone: string): void => {
      if (timeZone == null || timeZone === state.timeZone ) {
        return;
      }
    setState(prevState => ({...prevState, events: [...prevState.events], timeZone}));
  }

  const onSubmitEditEvent = (newEvent: CalendarEvent): void => {
    const newEvents: CalendarEvent[] = [...state.events];
    const index = newEvents.findIndex((event) => {
      return event.id === newEvent.id;
    })

    console.log(index);

    if (index > -1) {
      newEvents[index] = newEvent;
    } else {
      newEvents.push(newEvent);
    }

    setState(prevState => ({...prevState, editModalIsOpen: false,events: newEvents}))
  }

  const handleClickOnEvent = (eventId: number): void => {
    const events: CalendarEvent[] = [...state.events];
    let searchEvent = events.find((event) => {
      return event.id === eventId;
    })
    if (searchEvent == null) {
      return
    }
    setState(prevState => ({...prevState, calendarEvent: searchEvent, editModalIsOpen: true}));
  }

  return <>
    <LocalizationProvider  dateAdapter={DateAdapter} locale={local}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kumojin test
        </Typography>
      </Toolbar>
    </AppBar>

    <Container  sx={{padding: 2}} maxWidth={'md'}>

      <ToggleButtonGroup
          color="primary"
          value={state.timeZone}
          exclusive
          onChange={handleChangeTimezone}
      >
        <ToggleButton value={moment.tz.guess()}>Local</ToggleButton>
        <ToggleButton value="America/Montreal">Montréal</ToggleButton>
        <ToggleButton value="Europe/Paris">Paris</ToggleButton>
      </ToggleButtonGroup>

      <FullCalendar
          locales={[frLocale, enLocale]}
          locale={navigator.language}
          headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}

          events={state.events}
          plugins={[momentTimezonePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
          timeZone={state.timeZone}
          initialView="timeGridWeek"
          eventClick={(e) => {
            handleClickOnEvent(+e.event.id);
          }}
          navLinks={true} // can click day/week names to navigate views
          editable={true}
          selectable={true}
          dayMaxEvents={true}
          select={(e) => {
            handleCalendarSelect(e);
          }}
      />
    </Container>
      <EditCalendarEventModal
          isOpen={state.editModalIsOpen}
          onSubmit={onSubmitEditEvent}
          handleClose={() => {setState(prevState => ({...prevState, editModalIsOpen: false}))}}
          calendarEvent={state.calendarEvent}/>
    </LocalizationProvider>
  </>
}

export default App;
