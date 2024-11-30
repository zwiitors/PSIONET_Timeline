import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import EventList from "./EventList";

const API_URL = "https://psionet-timeline.vercel.app/api/events"; // APIエンドポイントを直接指定

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        return res.json();
      })
      .then((eventData) => setEvents(eventData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addEvent = (newEvent) => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add event");
        }
        return res.json();
      })
      .then((data) => setEvents((prev) => [...prev, data]))
      .catch((error) => console.error("Error adding event:", error));
  };

  const addTag = (eventId, tag) => {
    fetch(`${API_URL}/${eventId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add tag");
        }
        return res.json();
      })
      .then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
      })
      .catch((error) => console.error("Error adding tag:", error));
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
