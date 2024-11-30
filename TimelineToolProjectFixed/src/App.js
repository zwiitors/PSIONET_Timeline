import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import EventList from "./EventList";
import SearchBar from "./SearchBar";

const fetch_url = "https://psionet-timeline.vercel.app/api/events";

function App() {
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState([]); // 既存タグを保存
  const [filter, setFilter] = useState({ text: "", year: "" });

  useEffect(() => {
    fetch(fetch_url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        const allTags = data.flatMap((event) => event.tags);
        setTags([...new Set(allTags)]); // 重複を削除
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addEvent = (newEvent) => {
    fetch(`${fetch_url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) => [...prev, data]);
        setTags((prev) => [...new Set([...prev, ...(data.tags || [])])]);
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  const deleteEvent = (id) => {
    fetch(`${fetch_url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete event");
        }
        setEvents((prev) => prev.filter((event) => event.id !== id));
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  const addTag = (eventId, tag) => {
    fetch(`${fetch_url}/${eventId}/tags`, {
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
        setTags((prev) => [...new Set([...prev, tag])]); // タグ候補を更新
      })
      .catch((error) => console.error("Error adding tag:", error));
  };

  // フィルタリング
  const filteredEvents = events.filter((event) => {
    const matchesText = filter.text
      ? event.tags.includes(filter.text) || event.content.includes(filter.text)
      : true;
    const matchesYear = filter.year ? event.time.startsWith(filter.year) : true;
    return matchesText && matchesYear;
  });

  return (
    <div>
      <h1>ΨI/ONET 年表ツール</h1>
      <SearchBar onSearch={(criteria) => setFilter(criteria)} />
      <EventForm onAddEvent={addEvent} />
      <EventList
        events={filteredEvents}
        tags={tags}
        onAddTag={addTag}
        onDeleteEvent={deleteEvent}
      />
    </div>
  );
}

export default App;
