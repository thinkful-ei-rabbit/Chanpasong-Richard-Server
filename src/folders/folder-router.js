const path = require('path');
const express = require('express');
const xss = require('xss');
const FolderService = require('./folder-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

foldersRouter
  .route('/')
  .get((req, res, next) => {
    
  })
  .post(jsonParser, (req, res, next) => {
    
  });

foldersRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FolderService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
          });
        }
        res.article = folder; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    
  })
  .delete((req, res, next) => {
    
  })
  .patch(jsonParser, (req, res, next) => {
  
  });

module.exports = foldersRouter;