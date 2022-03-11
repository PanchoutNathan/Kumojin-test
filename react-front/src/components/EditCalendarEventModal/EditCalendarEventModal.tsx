import * as React from "react";
import {FunctionComponent, useEffect, useState} from "react";
import {
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField
} from "@mui/material";
import {DatePicker, DateTimePicker, TimePicker} from "@mui/lab";
import {CalendarEvent} from "../../common/entities/CalendarEvent/calendar-event.entity";
import {CalendarEventsServices} from "../../common/services/CalendarEvents/calendar-events.services";
import {useFormik} from "formik";
import moment from "moment";

interface EditCalendarEventModalProps {
    isOpen: boolean;
    handleClose: () => void;
    calendarEvent?: CalendarEvent;
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


    const handleUpdateEvent = (key: string, value: Date | string | undefined): void => {
        if (state?.calendarEvent == null) {
            return;
        }
        const newEvent: CalendarEvent = {...state?.calendarEvent, [key]: value};
        setState(prevState => ({...prevState, calendarEvent: newEvent}))
    }
    const formik = useFormik({
        initialValues: {
            title: state.calendarEvent?.title ?? '',
            description: state.calendarEvent?.description ?? '',
            start: state.calendarEvent?.start ?? '',
            end: state.calendarEvent?.end ?? '',
            allDay: state.calendarEvent?.allDay ?? false,
        },
        enableReinitialize: true,
        onSubmit: values => {
            const newEvent: CalendarEvent = {...values}
            console.log('values', {...values});
            newEvent.start = new Date(values.start).toISOString();
            newEvent.end = values.end != null ? new Date(values.end).toISOString() : undefined;
           console.log(newEvent);
           CalendarEventsServices.addCalendarEvent(newEvent).then((event) => {
               console.log(event);
           })
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
                    <TimePicker
                        renderInput={(props) => <TextField fullWidth {...props} />}
                        label="Heure de début"
                        value={formik.values.start}
                        onChange={(newValue) => {
                            formik.setFieldValue('start', newValue);
                        }}
                    />

                </Grid>}
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        clearable
                        clearText={'Delete'}
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
                        clearable
                        clearText={'Delete'}
                        renderInput={(props) => <TextField fullWidth {...props} />}
                        label="Heure de fin"
                        value={formik.values.end}
                        onChange={(newValue) => {
                            formik.setFieldValue('end', newValue);
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
                    <FormControlLabel control={<Checkbox {...formik.getFieldProps('allDay')}  />} label="Journée(s) entière(s)" />
                </Grid>
            </Grid>

        </DialogContent>
        <DialogActions>
            <Button onClick={formik.submitForm}>Submit</Button>
        </DialogActions>
    </Dialog>
}
