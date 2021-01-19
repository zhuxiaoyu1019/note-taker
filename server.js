const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid")

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;

        res.json(JSON.parse(data));
    });
});

app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;

        let newNote = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text
        };

        let historyNotes = JSON.parse(data);
        historyNotes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(historyNotes), err => {
            if (err) throw err;
            res.json(req.body);
        })
    });
});

app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;

        let historyNotes = JSON.parse(data);
        for (let i = 0; i < historyNotes.length; i++) {
            if (req.params.id === historyNotes[i].id) {
                historyNotes.splice(i, 1);
            }
        }

        fs.writeFile("./db/db.json", JSON.stringify(historyNotes), err => {
            if (err) throw err;
            res.json(req.body);
        })
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`listening on port${PORT}`)
});