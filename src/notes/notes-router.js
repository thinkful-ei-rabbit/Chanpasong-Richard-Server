const path = require("path");
const express = require("express");
const xss = require("xss");
const NoteService = require("./note-service");

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = (note) => ({
  id: note.id,
  name: xss(note.name),
  content: xss(note.content),
  modified: xss(note.modified),
  folderId: note.folderId,
});

notesRouter
  .route("/")
  .get((req, res, next) => {
    NoteService.getAllNotes(req.app.get("db"))
      .then((result) => {
        res.json(result.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, content, folderId } = req.body;
    // Make sure there is a name
    if (!name) {
      res.status(404).send("Note name is required");
    }
    if (!content) {
      res.status(404).send("Content is required");
    }
    if (!folderId) {
      res.status(404).send("FolderId is required");
    }
    // Sanitize the name and grab
    NoteService.insertNote(req.app.get("db"), { name, content, folderId })
      .then((result) => {
        res.status(201).json(serializeNote(result));
      })
      .catch(next);
  });

notesRouter
  .route("/:note_id")
  .all((req, res, next) => {
    NoteService.getById(req.app.get("db"), req.params.note_id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` },
          });
        }
        res.note = note; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    NoteService.getById(req.app.get("db"), res.note.id)
      .then((result) => {
        res.json(serializeNote(result));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    NoteService.deleteNote(req.app.get("db"), res.note.id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;
