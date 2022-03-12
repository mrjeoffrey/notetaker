// Express ABCs - install dependencies
const express = require("express");
const path = require("path");
const util = require("util");
const fs = require("fs");

// async process
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 5000;

// Express ABCs - Setup Server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express ABCs - Static Middleware
app.use(express.static("./public"));

// Express ABCs - GET Request - API ROUTING

app.get("api/notes", function (req, res) {
	const note = req.body;
	readFileAsync("./db/db.json", "utf8").then(function (data) {
		notes = [].concat(JSON.parse(data));
		res.json(notes);
	});
});

// 	addNote(note) {
// 		const { title, text } = note;

// 		if (!title || !text) {
// 			throw new Error("title and text cannot be blank");
// 		}

// 		const newNote = { title, text, id: uuid() };

// 		return this.getNotes()
// 			.then((notes) => [...notes, newNote])
// 			.then((updatedNotes) => this.write(updatedNotes))
// 			.then(() => this.newNote);
// 	}

// 	getNotes() {
// 		return this.read().then((notes) => {
// 			return JSON.parse(notes) || [];
// 		});
// 	}
// 	removeNote(id) {
// 		return this.getNotes()
// 			.then((notes) => notes.filter((note) => note.id !== id))
// 			.then((savedNotes) => this.write(savedNotes));
// 	}
// }

// request the existing notes
router.get("notes", (req, res) => {
	store
		.getNotes()
		.then((notes) => {
			res.json(notes);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// posting note function route

// router.post("./public/notes", (req, res) => {
// 	console.log(req.body);
// 	store
// 		.addNote(req.body)
// 		.then((note) => {
// 			res.json(note);
// 		})
// 		.catch((err) => {
// 			res.status(500).json(err);
// 		});
// });

// delete note function route

// router.delete("./public/notes/:id", (req, res) => {
// 	store
// 		.removeNote(req.params.id)
// 		.then(() => res.json({ ok: true }))
// 		.catch((err) => res.status(500).json(err));
// });

// const path = require("path");

// const router = require("express").Router();

//Sends notes to the notes.html file
router.get("./public/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Sends to the homepage if a pathing issue exists
router.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Express ABCs - start server
app.listen(PORT, () => {
	console.log(`Now listening on PORT: ${PORT}`);
});
