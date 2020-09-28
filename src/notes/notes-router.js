const path = require("path");
const express = require("express");
const xss = require("xss");
const NoteService = require("./note-service");

const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route("/")
  .get((req, res, next) => {
    NoteService.getAllNotes(req.app.get("db")).then((result) => {
      res.json(result);
    });
  })
  .post(jsonParser, (req, res, next) => {});

notesRouter
  .route("/:note_id")
  .all((req, res, next) => {
    NoteService.getById(req.app.get("db"), req.params.folder_id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` },
          });
        }
        res.article = note; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {})
  .delete((req, res, next) => {})
  .patch(jsonParser, (req, res, next) => {});

module.exports = notesRouter;
