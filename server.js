// When opening the Note Taker, the user is presented with a landing page with links to a note page.

// When the user clicks the link to the notes page, they are presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note's text in the right-hand column.

// When the user enters a new note title and text, then a Save icon appears in the navigation bar at the top of the page.

// When the user clicks on the Save icon, then the new note is saved and appears in the left-hand column with the other existing notes.

// When an existing note in the list in the left-hand column is clicked, then that note appears in the right-hand column.

// When the user clicks the Write icon in the navigation bar at the top of the page, then they are presented with empty field to enter a new note title and text in the right-hand column.

// Express ABCs - install dependencies
const express = require("express");

// Express ABCs - setup express app (default)
const app = express();
const PORT = process.env.PORT || 5000;

// Express ABCs - set express app for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const util = require("util");
const fs = require("fs");
const uuid = require("uuid");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
	read() {
		return readFileAsync("./db/db.json", "utf8");
	}
	write(note) {
		return writeFileAsync("./db/db.json", JSON.stringify(note));
	}

	addNote(note) {
		const { title, text } = note;

		if (!title || !text) {
			throw new Error("title and text cannot be blank");
		}

		const newNote = { title, text, id: uuid() };

		return this.getNotes()
			.then((notes) => [...notes, newNote])
			.then((updatedNotes) => this.write(updatedNotes))
			.then(() => this.newNote);
	}

	getNotes() {
		return this.read().then((notes) => {
			return JSON.parse(notes) || [];
		});
	}
	removeNote(id) {
		return this.getNotes()
			.then((notes) => notes.filter((note) => note.id !== id))
			.then((savedNotes) => this.write(savedNotes));
	}
}

// request the existing notes
router.get("/public/notes.html", (req, res) => {
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

router.post("./public/notes", (req, res) => {
	console.log(req.body);
	store
		.addNote(req.body)
		.then((note) => {
			res.json(note);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// delete note function route

router.delete("./public/notes/:id", (req, res) => {
	store
		.removeNote(req.params.id)
		.then(() => res.json({ ok: true }))
		.catch((err) => res.status(500).json(err));
});

const path = require("path");

const router = require("express").Router();

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
