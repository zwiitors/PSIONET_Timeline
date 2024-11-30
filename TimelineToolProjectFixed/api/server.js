const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000; // サーバーのポート番号

// ミドルウェアの設定
app.use(bodyParser.json());
app.use(cors());

// 仮のイベントデータ
let events = [
    { id: 1, time: "2089", content: "サンプルイベント1", tags: ["未来"] },
    { id: 2, time: "2090", content: "サンプルイベント2", tags: ["過去"] },
];

// イベント一覧を取得するAPI
app.get("/api/events", (req, res) => {
    res.json(events);
});

app.get("/api/get-base-url", (req, res) => {
    const fullUrl = `${req.protocol}://${req.get("host")}`;
    res.json({ baseUrl: fullUrl });
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

// 静的ファイルの設定を最後に移動
const path = require("path");

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, "../build")));

// API ルート以外のリクエストを index.html にフォールバック
app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
        res.status(404).json({ error: "API エンドポイントが見つかりません" });
    } else {
        res.sendFile(path.join(__dirname, "../build", "index.html"));
    }
});

