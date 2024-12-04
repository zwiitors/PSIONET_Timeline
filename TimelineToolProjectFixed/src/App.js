import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import EventList from "./EventList";
import SearchBar from "./SearchBar";

const fetch_url = "https://psionet-timeline.vercel.app/api/events";

function App() {
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState([]); // 既存タグを保存
  const [filter, setFilter] = useState({ text: "", year: "" });
  const [history, setHistory] = useState([]); // 履歴を管理
  const [currentStep, setCurrentStep] = useState(-1); // 履歴の現在位置
  const [latestId, setLatestId] = useState(2); // 最新IDを追跡する状態

  // 年月日の順に比較する関数
  const compareEvents = (a, b) => {
    const [yearA, monthA, dayA] = a.time.split("-").map(Number);
    const [yearB, monthB, dayB] = b.time.split("-").map(Number);

    if (yearA !== yearB) return yearA - yearB;
    if (monthA !== monthB) return (monthA || 1) - (monthB || 1);
    return (dayA || 1) - (dayB || 1);
  };

  // 初期データの取得と最新IDの計算
  useEffect(() => {
    fetch(fetch_url)
      .then((res) => res.json())
      .then((data) => {
        const sortedEvents = data.sort(compareEvents);
        setEvents(sortedEvents);

        // 現在のイベントリストから最大IDを取得
        const maxId = data.reduce((max, event) => Math.max(max, event.id), 0);
        setLatestId(maxId); // 最新IDを更新
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // 初期データの取得
  useEffect(() => {
    fetch(fetch_url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        return res.json();
      })
      .then((data) => {
        const sortedEvents = data.sort(compareEvents);
        setEvents(sortedEvents);
        const uniqueTags = data.flatMap((event) => event.tags);
        setTags([...new Set(uniqueTags)]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // イベントの追加（最新IDを使用）
  const addEvent = (newEvent) => {
    const newId = latestId + 1; // 最新IDに+1
    const eventWithId = { ...newEvent, id: newId };

    fetch(`${fetch_url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventWithId),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) => [...prev, data].sort(compareEvents));
        setTags((prev) => [...new Set([...prev, ...(data.tags || [])])]);
        setLatestId(newId); // 最新IDを更新
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  // イベントの削除
  const deleteEvent = (id) => {
    fetch(`${fetch_url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete event");
        }
        setEvents((prev) => prev.filter((event) => event.id !== id));
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  // タグの追加
  const addTag = (eventId, tag) => {
    fetch(`${fetch_url}/${eventId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }),
    })
      .then((res) => res.json())
      .then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
        setTags((prev) => [...new Set([...prev, tag])]); // タグ候補を更新
      })
      .catch((error) => console.error("Error adding tag:", error));
  };

  // 履歴管理：イベントリストが変更されたときに履歴を更新
  useEffect(() => {
    if (currentStep === -1 || currentStep === history.length - 1) {
      const newHistory = [...history.slice(0, currentStep + 1), events];
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
    }
  }, [events]);

  // Undo機能
  useEffect(() => {
    const handleUndo = (event) => {
      if (event.ctrlKey && event.key === "z" && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
        setEvents(history[currentStep - 1] || []);
      }
    };
    window.addEventListener("keydown", handleUndo);
    return () => window.removeEventListener("keydown", handleUndo);
  }, [currentStep, history]);
  
  const deleteTag = (eventId, tag) => {
    fetch(`${fetch_url}/${eventId}/tags/${tag}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
        // タグ候補を更新
        const remainingTags = updatedEvent.tags;
        setTags([...new Set(events.flatMap((event) => event.tags))]);
      })
      .catch((error) => console.error("Error deleting tag:", error));
  };
  
  const addReference = (eventId) => {
    // 参照を追加するロジック（例: モーダルで選択したイベントを参照として追加）
    const referenceId = prompt("Enter the ID of the event to reference:");
    if (!referenceId) return;
  
    fetch(`${fetch_url}/${eventId}/references`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ referenceId }),
    })
      .then((res) => res.json())
      .then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
      })
      .catch((error) => console.error("Error adding reference:", error));
  };

  const deleteReference = (eventId, referenceId) => {
    fetch(`${fetch_url}/${eventId}/references/${referenceId}`, {
        method: "DELETE",
    })
        .then((res) => res.json())
        .then((updatedEvent) => {
            setEvents((prev) =>
                prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
            );
        })
        .catch((error) => console.error("Error deleting reference:", error));
};

  
  // フィルタリング
  const filteredEvents = events.filter((event) => {
    const matchesText = filter.text
      ? event.tags.includes(filter.text) || event.content.includes(filter.text)
      : true;
    const matchesYear = filter.year ? event.time.startsWith(filter.year) : true;
    return matchesText && matchesYear;
  });

  return (
    <div>
      <h1>ΨI/ONET 年表ツール</h1>
      <SearchBar onSearch={(criteria) => setFilter(criteria)} />
      <EventForm onAddEvent={addEvent} />
      <EventList
          events={filteredEvents}
          onDeleteReference={deleteReference}
          tags={tags}
          onAddTag={addTag}
          onDeleteEvent={deleteEvent}
          onAddReference={addReference}
          onDeleteTag={deleteTag}
      />
    </div>
  );
}

export default App;
