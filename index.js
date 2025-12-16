import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5500;

let logs = [];

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Server Running!");
});

// Receive logs
app.post("/siem/log", (req, res) => {
    const log = req.body;

    logs.push({
        ...log,
        timestamp: new Date().toISOString()
    });

    console.log("Log Received\n", log);
    console.log("All Logs\n", logs);

    res.status(200).json({ message: "Log Received" });
});

// Get all logs
app.get("/siem/getLogs", (req, res) => {
    res.status(200).json(logs);
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});
