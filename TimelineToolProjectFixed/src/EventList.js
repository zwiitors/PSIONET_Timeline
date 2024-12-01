import React from "react";
import TagInput from "./TagInput";

function EventList({ events, tags, onAddTag, onDeleteEvent, onAddReference, onDeleteTag }) {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {events.map((event) => (
        <li key={event.id} id={event.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "16px", paddingBottom: "16px" }}>
          <div>
            <strong>{event.time}</strong>: {event.content}
          </div>
          {/* Google Document URL の表示 */}
          {event.documentUrl && (
            <div style={{ marginTop: "8px" }}>
              <strong>Document:</strong>{" "}
              <a href={event.documentUrl} target="_blank" rel="noopener noreferrer">
                Open Document
              </a>
            </div>
          )}
          {/* タグの表示と削除 */}
          <div style={{ marginTop: "8px" }}>
            <strong>Tags:</strong>{" "}
            {event.tags.map((tag) => (
              <span key={tag} style={{ display: "inline-block", marginRight: "8px", background: "#f0f0f0", padding: "4px 8px", borderRadius: "4px" }}>
                {tag}
                <button
                  onClick={() => onDeleteTag(event.id, tag)}
                  style={{
                    marginLeft: "4px",
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  ×
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
          <div style={{ marginTop: "8px" }}>
            <strong>References:</strong>{" "}
            {event.references && event.references.length > 0 ? (
              event.references.map((refId) => (
                <span key={refId} style={{ marginRight: "8px" }}>
                  <a href={`#${refId}`} style={{ textDecoration: "none", color: "#007bff" }}>
                    Event {refId}
                  </a>
                </span>
              ))
            ) : (
              <span>None</span>
            )}
          </div>
          <button
            onClick={() => onAddReference(event.id)}
            style={{
              marginTop: "8px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Reference
          </button>
          {/* イベント削除 */}
          <button
            onClick={() => onDeleteEvent(event.id)}
            style={{
              marginTop: "8px",
              marginLeft: "8px",
              background: "red",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default EventList;
