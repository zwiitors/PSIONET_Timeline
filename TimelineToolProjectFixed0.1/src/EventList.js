function EventList({ events, onAddTag }) {
    const [tagInput, setTagInput] = useState("");

    const handleAddTag = (eventId) => {
        if (tagInput) {
            onAddTag(eventId, tagInput);
            setTagInput("");
        }
    };

    return (
        <div>
            {events.map((event) => (
                <div key={event.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                    <h3>{event.time}</h3>
                    <p>{event.content}</p>
                    <p>
                        タグ: {event.tags.join(", ")}
                    </p>
                    <input
                        type="text"
                        placeholder="新しいタグを追加"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button onClick={() => handleAddTag(event.id)}>タグ追加</button>
                </div>
            ))}
        </div>
    );
}

export default EventList;
