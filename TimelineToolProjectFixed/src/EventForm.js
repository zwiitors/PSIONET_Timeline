import React, { useState } from "react";

function EventForm({ onAddEvent }) {
  const [time, setTime] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagArray = tags.split(",").map((tag) => tag.trim()); // タグを配列に変換
    onAddEvent({ time, content, tags: tagArray });
    setTime("");
    setContent("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>イベント追加</h2>
      <div>
        <label>時間: </label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>内容: </label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>タグ (カンマ区切り): </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <button type="submit">イベントを追加</button>
    </form>
  );
}

export default EventForm;
