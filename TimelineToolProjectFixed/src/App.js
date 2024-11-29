
import React, { useState } from 'react';
import './App.css';

const events = [
  { year: 2089, title: 'ΨI/ONET教団が東京タワー襲撃', tags: ['ΨI/ONET', '人間主義者', 'シンクロノード'] },
  { year: 2090, title: '新たな技術発表', tags: ['ΨI/ONET', 'テクノロジー'] },
];

function App() {
  const [searchTag, setSearchTag] = useState('');

  const filteredEvents = events.filter(event => 
    searchTag === '' || event.tags.includes(searchTag)
  );

  return (
    <div className="App">
      <header className="header">
        <input
          type="text"
          placeholder="タグで検索"
          onChange={(e) => setSearchTag(e.target.value)}
        />
      </header>
      <main className="timeline">
        {filteredEvents.map((event, index) => (
          <div key={index} className="event-card">
            <h3>{event.year}</h3>
            <p>{event.title}</p>
            <div className="tags">
              {event.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
