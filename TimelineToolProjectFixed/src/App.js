import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import EventList from "./EventList";

function App() {
  const [events, setEvents] = useState([]);
  const [baseUrl, setBaseUrl] = useState(""); // ベースURLを保持

  useEffect(() => {
    // ベースURLを取得
    
    fetch("https://psionet-timeline.vercel.app")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch base URL");
        }
        return res.json();
      })
      .then((data) => {
        setBaseUrl(data.baseUrl);
        return fetch(`${data.baseUrl}/api/events`);
      })
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
    fetch(`${baseUrl}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => setEvents((prev) => [...prev, data]))
      .catch((error) => console.error("Error adding event:", error));
  };

  const addTag = (eventId, tag) => {
    fetch(`${baseUrl}/api/events/${eventId}/tags`, {
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
