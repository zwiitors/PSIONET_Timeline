import React, { useState } from "react";

function EventList({ events, onAddTag }) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (eventId) => {
    if (tagInput.trim() === "") return;
    onAddTag(eventId, tagInput);
    setTagInput(""); // 入力フィールドをリセット
  };

  return (
    <div>
      <h2>イベント一覧</h2>
      {events.length === 0 ? (
        <p>イベントがまだありません。</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: "10px" }}>
              <strong>{event.time}</strong>: {event.content}
              <div>
                <em>タグ: {event.tags.join(", ") || "なし"}</em>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="新しいタグを追加"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <button onClick={() => handleAddTag(event.id)}>タグ追加</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
