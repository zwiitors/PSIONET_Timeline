const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");

const app = express();

const corsOptions = {
    origin: "*", // 必要に応じて特定のオリジンを指定
    methods: ["GET", "POST", "OPTIONS", "DELETE"], // DELETEメソッドを明示的に許可
    allowedHeaders: ["Content-Type"]
}

// ミドルウェアの設定
app.use(bodyParser.json());

// CORSヘッダーを手動で設定
app.use(cors({
    origin: "*", // 必要に応じて特定のオリジンを指定
    methods: ["GET", "POST", "DELETE"], // DELETEメソッドを明示的に許可
    allowedHeaders: ["Content-Type"]
}));


// 仮のイベントデータ
let events = [
    { id: 1, time: "2089", content: "サンプルイベント1", tags: ["未来"] },
    { id: 2, time: "2090", content: "サンプルイベント2", tags: ["過去"] },
];

// イベント一覧を取得するAPI
app.get("/api/events", cors(corsOptions), (req, res, next) => {
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
        event.tags.push(tag);
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "イベントが見つかりません" });
    }
});

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

module.exports = app; // 重要：appをエクスポート
