const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// ミドルウェアの設定
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// 仮のイベントデータ
let events = [
    { id: 1, time: "2089-01-01", content: "サンプルイベント1", tags: ["未来"], references: [] },
    { id: 2, time: "2090-01-01", content: "サンプルイベント2", tags: ["過去"], references: [] },
];

// イベント一覧を取得するAPI
app.get("/api/events", (req, res) => {
    res.json(events);
});

// 新しいイベントを追加するAPI
app.post("/api/events", (req, res) => {
    const { time, content, tags } = req.body;
    const newEvent = {
        id: events.length + 1,
        time,
        content,
        tags: tags || [],
        references: [],
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
});

// イベントにタグを追加するAPI
app.post("/api/events/:id/tags", (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const { tag } = req.body;
    const event = events.find((e) => e.id === eventId);

    if (event) {
        if (!event.tags.includes(tag)) { // 重複チェック
            event.tags.push(tag);
        }
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "イベントが見つかりません" });
    }
});

// イベントから特定のタグを削除するAPI
app.delete("/api/events/:id/tags/:tag", (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const { tag } = req.params;
    const event = events.find((e) => e.id === eventId);

    if (event) {
        event.tags = event.tags.filter((t) => t !== tag);
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "イベントが見つかりません" });
    }
});

// イベントを削除するAPI
app.delete("/api/events/:id", (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const eventIndex = events.findIndex((e) => e.id === eventId);

    if (eventIndex !== -1) {
        events.splice(eventIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: "イベントが見つかりません" });
    }
});

// イベントに参照を追加するAPI
app.post("/api/events/:id/references", (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const { referenceId } = req.body;
    const event = events.find((e) => e.id === eventId);

    if (event) {
        if (!event.references) {
            event.references = [];
        }
        if (!event.references.includes(referenceId)) {
            event.references.push(referenceId);
        }
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "イベントが見つかりません" });
    }
});
// 参照を削除するAPI
app.delete("/api/events/:id/references/:referenceId", (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const referenceId = parseInt(req.params.referenceId, 10);
    const event = events.find((e) => e.id === eventId);

    if (event) {
        event.references = event.references.filter((ref) => ref !== referenceId);
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "イベントが見つかりません" });
    }
});

module.exports = app; // エクスポート
