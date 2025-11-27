import WebSocket, { WebSocketServer } from "ws";

const OPENAI_KEY = process.env.OPENAI_KEY;

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", async (client) => {
    console.log("Client connected to proxy.");

    const openaiSocket = new WebSocket(
        "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
        {
            headers: {
                "Authorization": "Bearer " + OPENAI_KEY,
                "OpenAI-Beta": "realtime=v1"
            }
        }
    );

    openaiSocket.on("message", (data) => {
        client.send(data);
    });

    client.on("message", (data) => {
        openaiSocket.send(data);
    });

    client.on("close", () => openaiSocket.close());
});
