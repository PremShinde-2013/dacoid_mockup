"use client";

import React, { useState, useEffect } from "react";
import {
    formatDate,
    DateSelectArg,
    EventClickArg,
    EventApi,
} from "@fullcalendar/core";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";


const Calendar: React.FC = () => {
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [newEventDescription, setNewEventDescription] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

    useEffect(() => {


        if (typeof window !== "undefined") {
            const savedEvents = localStorage.getItem("events");
            if (savedEvents) {
                setCurrentEvents(JSON.parse(savedEvents));
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("events", JSON.stringify(currentEvents));

        }
    }, [currentEvents]);

    const handleDateClick = (selected: DateSelectArg) => {
        setSelectedDate(selected);
        setIsDialogOpen(true);
    };

    const handleEventClick = (selected: EventClickArg) => {
        toast({
            title: "Delete Event",
            description: `Are you sure you want to delete the event "${selected.event.title}"?`,
            action: (
                <ToastAction
                    altText="Delete Event"
                    onClick={() => {
                        selected.event.remove();
                        setCurrentEvents(
                            currentEvents.filter(
                                (event) => event.id !== selected.event.id
                            )
                        );
                        toast({
                            title: "Event Deleted",
                            description: `The event "${selected.event.title}" was successfully deleted.`,
                        });
                    }}
                >
                    Confirm
                </ToastAction>
            ),
        });
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewEventTitle("");
        setNewEventDescription("");
        setStartTime("");
        setEndTime("");
    };

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEventTitle && selectedDate) {
            const calendarApi = selectedDate.view.calendar;
            calendarApi.unselect();

            const startDateTime = startTime
                ? new Date(`${selectedDate.start.toISOString().split("T")[0]}T${startTime}`)
                : selectedDate.start;

            const endDateTime = endTime
                ? new Date(`${selectedDate.start.toISOString().split("T")[0]}T${endTime}`)
                : selectedDate.end;

            // Add the event directly to the calendar API
            const newEvent = calendarApi.addEvent({
                id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
                title: newEventTitle,
                start: startDateTime,
                end: endDateTime,
                allDay: !startTime && !endTime,
                extendedProps: {
                    description: newEventDescription,
                },
            });

            // Only add the event if it is not null
            if (newEvent) {
                setCurrentEvents([...currentEvents, newEvent]);
            }

            handleCloseDialog();
        }
    };





    return (
        <div>
            <div className="flex lg:flex-row flex-col w-full px-10 justify-start items-start gap-8">
                <div className="w-3/12">
                    <div className="py-10 text-2xl font-extrabold px-7">
                        Calendar Events
                    </div>
                    <ul className="space-y-4">
                        {currentEvents.length <= 0 && (
                            <div className="italic text-center text-gray-400">
                                No Events Present
                            </div>
                        )}


                        {currentEvents.length > 0 &&
                            currentEvents.map((event: EventApi) => (


                                <li
                                    className="border flex  flex-col min-w-[300px] flex-wrap  border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                                    key={event.id}
                                >
                                    <strong>{event.title}</strong>
                                    <br />
                                    <label className="text-slate-950">
                                        {formatDate(event.start!, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}{" "}
                                        {event.extendedProps.description && (
                                            <p className="italic text-sm text-gray-500">
                                                {event.extendedProps.description}
                                            </p>
                                        )}

                                    </label>
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="w-9/12 mt-8">
                    <FullCalendar
                        height={"85vh"}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                        }}
                        initialView="dayGridMonth"

                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        eventsSet={(events) => setCurrentEvents(events)}
                        initialEvents={
                            typeof window !== "undefined"
                                ? JSON.parse(localStorage.getItem("events") || "[]")
                                : []
                        }
                    />
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Event Details</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mb-4" onSubmit={handleAddEvent}>
                        <Input
                            type="text"
                            placeholder="Event Title"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            required
                            className="border border-gray-200 p-3 rounded-md text-lg"
                        />
                        <Input
                            type="text"
                            placeholder="Event Description (Optional)"
                            value={newEventDescription}
                            onChange={(e) => setNewEventDescription(e.target.value)}
                            className="border border-gray-200 p-3 rounded-md text-lg"
                        />
                        <div className="flex gap-4">
                            <Input
                                type="time"
                                placeholder="Start Time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="border border-gray-200 p-3 rounded-md"
                            />
                            <Input
                                type="time"
                                placeholder="End Time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="border border-gray-200 p-3 rounded-md"
                            />
                        </div>
                        <Button className="p-3 mt-5 rounded-md" type="submit">
                            Add
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Calendar;
