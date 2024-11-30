import React, { useState } from "react";

function TagInput({ eventId, existingTags, onAddTag }) {
  const [tag, setTag] = useState("");

  const handleAdd = () => {
    if (tag) {
      onAddTag(eventId, tag);
      setTag("");
    }
  };

  return (
    <div>
      <input
        list="tag-options"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Add a tag"
      />
      <datalist id="tag-options">
        {existingTags.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default TagInput;
