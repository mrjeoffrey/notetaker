// Express ABCs - install dependencies
const express = require("express");
const path = require("path");
const util = require("util");
const fs = require("fs");

// async process
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 5001;

// Express ABCs - Setup Server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express ABCs - Static Middleware
app.use(express.static("./public"));

// Express ABCs - GET Request - API ROUTING

app.get("/api/notes", function (req, res) {
	readFileAsync("./db/db.json", "utf8").then(function (data) {
		notes = [].concat(JSON.parse(data));
		res.json(notes);
	});
});

// Express ABCs - POST Request - API ROUTING

app.post("/api/notes", function (req, res) {
	const note = req.body;
	readFileAsync("./db/db.json", "utf8")
		.then(function (data) {
			const notes = [].concat(JSON.parse(data));
			note.id = notes.length + 1;
			notes.push(note);
			return notes;
		})
		.then(function (notes) {
			writeFileAsync("./db/db.json", JSON.stringify(notes));
			res.json(note);
		});
});

// Express ABCs - DELETE Request - API Routing
app.delete("/api/notes/:id", function (req, res) {
	const idToDelete = parseInt(req.params.id);
	readFileAsync("./db/db.json", "utf8")
		.then(function (data) {
			const notes = [].concat(JSON.parse(data));
			const newNotesData = [];
			for (let i = 0; i < notes.length; i++) {
				if (idToDelete !== notes[i].id) {
					newNotesData.push(notes[i]);
				}
			}
			return newNotesData;
		})
		.then(function (notes) {
			writeFileAsync("./db/db.json", JSON.stringify(notes));
			res.send("Note Saved");
		});
});

// Express ABCs - Routing to HTML
//Sends notes to the notes.html file
app.get("/notes", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Express ABCs - start server
app.listen(PORT, function () {
	console.log("App listening on PORT " + PORT);
});
