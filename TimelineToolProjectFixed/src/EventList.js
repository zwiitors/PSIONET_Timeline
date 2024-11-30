import React from "react";
import TagInput from "./TagInput";

function EventList({ events, tags, onAddTag, onDeleteEvent }) {
  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>
          <div>
            <strong>{event.time}</strong>: {event.content}
          </div>
          <div>
            Tags: {event.tags.join(", ")}
            <TagInput
              eventId={event.id}
              existingTags={tags}
              onAddTag={onAddTag}
            />
          </div>
          <button onClick={() => onDeleteEvent(event.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default EventList;
