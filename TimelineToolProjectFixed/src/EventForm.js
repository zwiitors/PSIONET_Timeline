import { useState } from "react";

function EventForm({ onAddEvent }) {
    const [time, setTime] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (time && content) {
            onAddEvent({ time, content, tags: tags.split(",") });
            setTime("");
            setContent("");
            setTags("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="時間 (例: 2089)"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="内容"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="タグ (カンマ区切り)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <button type="submit">イベント追加</button>
        </form>
    );
}

export default EventForm;
