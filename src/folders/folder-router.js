/* eslint-disable quotes */
const path = require("path");
const express = require("express");
const xss = require("xss");
const FolderService = require("./folder-service");

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = (folder) => ({
  id: folder.id,
  name: xss(folder.name),
  modified: xss(folder.modified),
});

foldersRouter
  .route("/")
  .get((req, res, next) => {
    FolderService.getAllFolders(req.app.get("db"))
      .then((result) => {
        res.json(result.map(serializeFolder));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    console.log(name);
    // Make sure there is a name
    if (!name) {
      res.status(404).send("Folder name is required");
    }
    // Sanitize the name
    FolderService.insertFolder(req.app.get("db"), { name: name })
      .then((result) => {
        res.status(201).json(serializeFolder(result));
      })
      .catch(next);
  });

foldersRouter
  .route("/:folder_id")
  .all((req, res, next) => {
    FolderService.getById(req.app.get("db"), req.params.folder_id)
      .then((folder) => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` },
          });
        }
        res.folder = folder; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    FolderService.getById(req.app.get("db"), res.folder.id)
      .then((result) => {
        res.json(serializeFolder(result));
      })
      .catch(next);
  });

module.exports = foldersRouter;
