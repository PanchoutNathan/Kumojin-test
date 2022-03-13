import React, {useEffect, useRef, useState} from 'react';
import './App.scss';
import DateAdapter from '@mui/lab/AdapterMoment';
import {AppBar, Container, ToggleButton, ToggleButtonGroup, Toolbar, Typography, useMediaQuery} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import timeGridPlugin from '@fullcalendar/timegrid'
import {LocalizationProvider} from '@mui/lab';
import 'moment/locale/en-ca';
import 'moment/locale/fr';
import {EditCalendarEventModal} from "./components/EditCalendarEventModal/EditCalendarEventModal";
import {CalendarEvent} from "./common/entities/CalendarEvent/calendar-event.entity";
import {DateSelectArg} from "@fullcalendar/core";
import {CalendarEventsServices} from "./common/services/CalendarEvents/calendar-events.services";
import moment from "moment-timezone/moment-timezone-utils";
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/es-us';
import {useSnackbar} from "notistack";
import {AxiosError} from "axios";

interface State {
  events: any[];
  timeZone: string;
  editModalIsOpen: boolean;
  calendarEvent?: CalendarEvent;
}

function App() {
  const calendar: any = useRef(null);
  const isMobile = useMediaQuery('(max-width:721px)');
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState<State>({
    events: [],
    timeZone: moment.tz.guess(),
    editModalIsOpen: false,
  })
  moment.locale(navigator.language);
  moment.tz.setDefault(state.timeZone);

  useEffect(() => {
    CalendarEventsServices.getAllEvents().then((events) => {
      setState(prevState => ({...prevState, events}));
    }).catch((error: AxiosError) => {
      enqueueSnackbar('Une erreur est survenue lors du chargement des events', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      })
    });
  }, []);


  useEffect(() => {
    if (isMobile) {
      calendar?.current?.getApi().changeView('timeGridDay');
    } else {
      calendar?.current?.getApi().changeView('timeGridWeek');
    }
  }, [isMobile]);

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
    <LocalizationProvider  dateAdapter={DateAdapter} locale={navigator.language}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kumojin test
        </Typography>
      </Toolbar>
    </AppBar>

    <Container  sx={{padding: 2}} maxWidth={'md'}>
      { !isMobile && <ToggleButtonGroup
          sx={{marginBottom: 2}}
          color="primary"
          value={state.timeZone}
          exclusive
          onChange={handleChangeTimezone}
      >
        <ToggleButton value={moment.tz.guess()}>Local</ToggleButton>
        <ToggleButton value="America/Montreal">Montréal</ToggleButton>
        <ToggleButton value="Europe/Paris">Paris</ToggleButton>
        <ToggleButton value="Asia/Tokyo">Tokyo</ToggleButton>
        <ToggleButton value="America/New_York">New York</ToggleButton>
        <ToggleButton value="America/Mexico_City">Mexico</ToggleButton>
      </ToggleButtonGroup>}

      <FullCalendar
          ref={calendar}
          locales={[frLocale, enLocale]}
          locale={navigator.language}
          headerToolbar={isMobile ? {
            left: 'prev,next today',
            center: '',
            right: ''
          } : {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}

          events={state.events}
          plugins={[momentTimezonePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
          timeZone={state.timeZone}
          initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
          eventClick={(e) => {
            handleClickOnEvent(+e.event.id);
          }}
          navLinks={true} // can click day/week names to navigate views
          editable={false}
          selectable={true}
          eventDurationEditable={false}
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
