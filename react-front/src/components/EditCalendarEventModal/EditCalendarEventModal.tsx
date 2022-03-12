import * as React from "react";
import {FunctionComponent, useEffect, useState} from "react";
import {
    Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField
} from "@mui/material";
import {DatePicker, DesktopTimePicker, TimePicker} from "@mui/lab";
import {CalendarEvent} from "../../common/entities/CalendarEvent/calendar-event.entity";
import {CalendarEventsServices} from "../../common/services/CalendarEvents/calendar-events.services";
import {useFormik} from "formik";
import {Moment} from "moment";

interface EditCalendarEventModalProps {
    isOpen: boolean;
    handleClose: () => void;
    calendarEvent?: CalendarEvent;
    onSubmit: (event: CalendarEvent) => void
}

interface EditCalendarEventModalState {
    calendarEvent?: CalendarEvent;
}

export const EditCalendarEventModal: FunctionComponent<EditCalendarEventModalProps> = ({...props}) => {

    const [state, setState] = useState<EditCalendarEventModalState>({
        calendarEvent: CalendarEventsServices.getEmptyEvent()
    })

    const handleClose = (): void => {
        props.handleClose();
    }

    const setHours = (date: Date, hours: Date): Date => {
        date.setHours(hours.getHours())
        date.setMinutes( hours.getMinutes())
        date.setSeconds(0);
        return date;
    }

    const formik = useFormik({
        initialValues: {
            title: state.calendarEvent?.title ?? '',
            description: state.calendarEvent?.description ?? '',
            start: state.calendarEvent?.start ?? '',
            hourStart: state.calendarEvent?.start ?? '',
            end: state.calendarEvent?.end ?? '',
            hourEnd: state.calendarEvent?.end ?? '',
            allDay: state.calendarEvent?.allDay ?? false,
        },
        enableReinitialize: true,
        onSubmit: values => {
            const {hourStart, hourEnd, ...eventValues} = values;
            const newEvent: CalendarEvent = {...eventValues, id: state.calendarEvent?.id}
            newEvent.start = setHours(new Date(values.start), new Date(values.hourStart)).toISOString();
            newEvent.end = setHours(new Date(values.end), new Date(values.hourEnd)).toISOString();

            if (state.calendarEvent?.id != null) {
                CalendarEventsServices.updateCalendarEvent(newEvent).then((event) => {
                    props.onSubmit(event);
                })
            } else {
                CalendarEventsServices.addCalendarEvent(newEvent).then((event) => {
                    props.onSubmit(event);
                })
            }
        }
    });

    useEffect(() => {
        const event = props.calendarEvent ?? CalendarEventsServices.getEmptyEvent();
        setState(prevState => ({...prevState, calendarEvent: event}));
    }, [props.calendarEvent])


    return <Dialog onClose={handleClose} open={props.isOpen}>
        <DialogTitle>Ajouter / Modifier un évènement</DialogTitle>
        <DialogContent>
            <DialogContentText>Renseignez toutes les informations sur l'événement</DialogContentText>

            <Grid marginTop={1} container spacing={2}>
                <Grid item xs={12}>
                    <TextField {...formik.getFieldProps('title')} inputProps={{maxLength: 32}} fullWidth label="Title" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        renderInput={(props) => <TextField fullWidth {...props} />}
                        label="Date de début"
                        value={formik.values.start}
                        onChange={(newValue) => {
                            formik.setFieldValue('start', newValue);
                        }}
                    />
                </Grid>
                {!formik.values.allDay && <Grid item xs={12} sm={6}>
                    <DesktopTimePicker
                        renderInput={(props) => {
                            return <TextField fullWidth {...props} />
                        }}
                        label="Heure de début"
                        value={formik.values.hourStart}
                        onChange={(newValue: Moment | null) => {
                            formik.setFieldValue('hourStart', newValue);
                        }}
                    />

                </Grid>}
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        renderInput={(props) => <TextField fullWidth {...props} />}
                        label="Date de fin"
                        value={formik.values.end}
                        onChange={(newValue) => {
                            formik.setFieldValue('end', newValue);
                        }}
                    />
                </Grid>
                {!formik.values.allDay && <Grid item xs={12} sm={6}>
                    <TimePicker
                        renderInput={(props) => <TextField fullWidth {...props} />}
                        label="Heure de fin"
                        value={formik.values.hourEnd}
                        onChange={(newValue) => {
                            formik.setFieldValue('hourEnd', newValue);
                        }}
                    />
                </Grid>}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        {...formik.getFieldProps('description')}
                        multiline
                        minRows={3}
                        maxRows={6}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox defaultChecked={state.calendarEvent?.allDay} {...formik.getFieldProps('allDay')}  />} label="Journée(s) entière(s)" />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={formik.submitForm}>Submit</Button>
        </DialogActions>
    </Dialog>
}
