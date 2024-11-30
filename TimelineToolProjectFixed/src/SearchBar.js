import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [text, setText] = useState("");
  const [year, setYear] = useState("");

  const handleSearch = () => {
    onSearch({ text, year });
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search text or tags"
      />
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
