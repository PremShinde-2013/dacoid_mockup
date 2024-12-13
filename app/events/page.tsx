/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { formatDate } from "@fullcalendar/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Event = {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    extendedProps: {
        description: string;
    };
};

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [editEventId, setEditEventId] = useState<string | null>(null);
    const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});

    // Load events from local storage on component mount
    useEffect(() => {
        const savedEvents = localStorage.getItem("events");
        if (savedEvents) {
            try {
                setEvents(JSON.parse(savedEvents));
            } catch (error) {
                console.error("Error parsing events from localStorage:", error);
                setEvents([]);
            }
        }
    }, []);

    // Save events to local storage whenever they change
    useEffect(() => {
        if (events.length > 0) {
            localStorage.setItem("events", JSON.stringify(events));
        }
    }, [events]);

    const deleteEvent = (id: string) => {
        // Trigger the deletion of the event
        setEvents(events.filter((event) => event.id !== id));
        toast({
            title: "Event Deleted",
            description: `The event has been deleted successfully.`,
        });
    };
    const handleDeleteClick = (id: string) => {
        // Show confirmation toast
        toast({
            title: "Are you sure?",
            description: "Do you really want to delete this event?",
            action: (
                <Button
                    variant="destructive"
                    onClick={() => {
                        deleteEvent(id); // Proceed with deletion
                    }}
                >
                    Yes, Delete
                </Button>
            ),
        });
    };


    const handleEditChange = (field: string, value: string) => {
        if (field.startsWith("extendedProps.")) {
            const key = field.replace("extendedProps.", "") as keyof Event["extendedProps"];
            setEditedEvent({
                ...editedEvent,
                extendedProps: { ...editedEvent.extendedProps, [key]: value },
            });
        } else {
            setEditedEvent({ ...editedEvent, [field]: value });
        }
    };

    const saveEditedEvent = () => {
        setEvents(
            events.map((event) =>
                event.id === editEventId
                    ? {
                        ...event,
                        ...editedEvent,
                        extendedProps: {
                            ...event.extendedProps,
                            description:
                                editedEvent.extendedProps?.description || event.extendedProps.description,
                        },
                    }
                    : event
            )
        );
        setEditEventId(null);
        setEditedEvent({});
    };


    return (
        <div className="p-6 space-y-4 ">
            <h1 className="text-2xl font-bold">Event List</h1>
            {events.length === 0 ? (
                <p className="italic text-gray-500">No events available.</p>
            ) : (
                <div className="space-y-4 flex flex-wrap lg:flex-wrap lg:flex-row flex-col gap-5">
                    {events.map((event) => (
                        <Card
                            key={event.id}
                            className="p-4 border rounded-md flex flex-col min-w-full sm:min-w-[400px] lg:min-w-[700px] lg:max-w-[800px] space-y-2"
                        >
                            {editEventId === event.id ? (
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        value={editedEvent.title || event.title}
                                        onChange={(e) => handleEditChange("title", e.target.value)}
                                        placeholder="Title"
                                    />
                                    <Input
                                        type="text"
                                        value={
                                            editedEvent.extendedProps?.description ||
                                            event.extendedProps.description
                                        }
                                        onChange={(e) =>
                                            handleEditChange("extendedProps.description", e.target.value)
                                        }
                                        placeholder="Description"
                                    />
                                    <Input
                                        type="datetime-local"
                                        value={editedEvent.start || event.start}
                                        onChange={(e) => handleEditChange("start", e.target.value)}
                                    />
                                    <Input
                                        type="datetime-local"
                                        value={editedEvent.end || event.end || ""}
                                        onChange={(e) => handleEditChange("end", e.target.value)}
                                    />
                                    <div className="flex gap-4">
                                        <Button onClick={saveEditedEvent}>Save</Button>
                                        <Button variant="secondary" onClick={() => setEditEventId(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                                    <div className="text-sm text-gray-700 mt-2">
                                        <p>
                                            <strong>Start: </strong>{" "}
                                            <span className="text-gray-900">
                                                {formatDate(new Date(event.start), {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </p>
                                        {event.end && (
                                            <p>
                                                <strong>End: </strong>{" "}
                                                <span className="text-gray-900">
                                                    {formatDate(new Date(event.end), {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {event.extendedProps.description && (
                                        <div className="mt-3 p-3 bg-gray-100 rounded-md">
                                            <p className="text-sm italic text-gray-600">{event.extendedProps.description}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4 mt-4">
                                        <Button onClick={() => setEditEventId(event.id)} variant="ghost" className=" px-4 py-2 rounded-md ">
                                            Edit
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => handleDeleteClick(event.id)} // Call toast confirmation
                                            className=" px-4 py-2 rounded-md "
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                            )}
                        </Card>
                    ))}
                </div>

            )}
        </div>
    );
};

export default EventsPage;
