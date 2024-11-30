const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// ミドルウェアの設定
app.use(bodyParser.json());
app.use(cors());

// 仮のイベントデータ
let events = [
    { id: 1, time: "2089", content: "サンプルイベント1", tags: ["未来"] },
    { id: 2, time: "2090", content: "サンプルイベント2", tags: ["過去"] },
];

// ベースURLを取得するAPI
app.get("/api/get-base-url", (req, res) => {
    const fullUrl = `${req.protocol}://${req.get("host")}`;
    res.json({ baseUrl: fullUrl });
});

// イベント一覧を取得するAPI
app.get("/api/events", (req, res) => {
    res.json(events);
});

// 新しいイベントを追加するAPI
app.post("/api/events", (req, res) => {
    const { time, content, tags } = req.body;
    if (!time || !content) {
        return res.status(400).json({ error: "時間と内容は必須です" });
    }
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

// 静的ファイルの配信 (ビルドフォルダ)
app.use(express.static(path.join(__dirname, "../build")));

// その他のリクエストをすべて index.html にフォールバック
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// ハンドラとしてエクスポート
module.exports = app;
