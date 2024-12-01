import React, { useState } from "react";

function EventForm({ onAddEvent }) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [references, setReferences] = useState([]);
  
  const handleAddReference = (eventId) => {
    setReferences((prev) => [...new Set([...prev, eventId])]);
  };
  
  const handleSubmit = () => {
    const time = `${year}-${month || "01"}-${day || "01"}`;
    const newEvent = {
      time,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
    };
    onAddEvent(newEvent);
    setYear("");
    setMonth("");
    setDay("");
    setContent("");
    setTags("");
  };

  return (
    <div>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year (e.g., 2024)"
      />
      <input
        type="number"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        placeholder="Month (optional)"
      />
      <input
        type="number"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        placeholder="Day (optional)"
      />
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Event description"
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
      />
      <button onClick={handleSubmit}>Add Event</button>
    </div>
  );
}

export default EventForm;
