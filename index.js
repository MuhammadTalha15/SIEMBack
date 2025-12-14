import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

const PORT = 5500;

let logs = [];

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello from the backend!");
});

app.post("/siem/log", (req, res) => {
    const log = req.body;

    logs.push({
        ...log
    });

    io.emit("new_log", log);

    console.log(logs);
    console.log("Log Received\n", log);

    res.status(200).json({ messgae: "Log Received" });
})

app.get("/siem/getLogs", (req, res) => {
    res.status(200).json(logs);
})

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
})

httpServer.listen(PORT, () => {
    console.log(`App listening on http://localhost:5500`);
})