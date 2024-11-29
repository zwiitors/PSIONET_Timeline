import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import EventList from "./EventList";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // イベントの初期取得
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const addEvent = (newEvent) => {
    fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => setEvents((prev) => [...prev, data]));
  };

  const addTag = (eventId, tag) => {
    fetch(`/api/events/${eventId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }),
    })
      .then((res) => res.json())
      .then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
      });
  };

  return (
    <div>
      <h1>ΨI/ONET 年表ツール</h1>
      <EventForm onAddEvent={addEvent} />
      <EventList events={events} onAddTag={addTag} />
    </div>
  );
}

export default App;
