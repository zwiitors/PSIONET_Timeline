import React from "react";
import TagInput from "./TagInput";

function EventList({ events, tags, onAddTag, onDeleteEvent, onAddReference, onDeleteTag }) {
  return (
    <ul>
      {events.map((event) => (
        <li key={event.id} id={event.id}>
          <div>
            <strong>{event.time}</strong>: {event.content}
          </div>
          {/* Google Document URL の表示 */}
          {event.documentUrl && (
            <div>
              Document: 
              <a href={event.documentUrl} target="_blank" rel="noopener noreferrer">
                Open Document
              </a>
            </div>
          )}
          {/* タグの表示と削除 */}
          <div>
            Tags:{" "}
            {event.tags.map((tag) => (
              <span key={tag} style={{ marginRight: "8px" }}>
                {tag}
                <button onClick={() => onDeleteTag(event.id, tag)} style={{ marginLeft: "4px" }}>
                  x
                </button>
              </span>
            ))}
            <TagInput
              eventId={event.id}
              existingTags={tags}
              onAddTag={onAddTag}
            />
          </div>
          {/* 参照イベントの表示と追加 */}
          <div>
            References: 
            {event.references && event.references.length > 0 ? (
              event.references.map((refId) => (
                <span key={refId} style={{ marginRight: "8px" }}>
                  <a href={`#${refId}`}>Event {refId}</a>
                </span>
              ))
            ) : (
              "None"
            )}
          </div>
          <button onClick={() => onAddReference(event.id)}>Add Reference</button>
          {/* イベント削除 */}
          <button onClick={() => onDeleteEvent(event.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default EventList;
