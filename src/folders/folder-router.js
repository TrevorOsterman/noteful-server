const path = require("path");
const express = require("express");
const xss = require("xss");
const FolderService = require("./folder-service");

const folderRouter = express.Router();
const jsonParser = express.json();

folderRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    FolderService.getAllFolders(knexInstance).then(folders => {
      res.json(folders);
    });
  })
  .post(jsonParser, (req, res, next) => {
    const { title } = req.body;
    const newFolder = { title };
    FolderService.createFolder(req.app.get("db"), newFolder)
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(folder);
      })
      .catch(next);
  });

folderRouter
  .route("/:folder_id")
  .all((req, res, next) => {
    FolderService.getById(req.app.get("db"), req.params.folder_id)
      .then(folder => {
        if (!folder) {
          return res
            .status(404)
            .json({ error: { message: `Folder no existo` } });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.folder);
  })
  .delete((req, res, next) => {
    FolderService.deleteFolder(req.app.get("db"), req.params.folder_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { title } = req.body;
    const folderToUpdate = { title };

    if (!folderToUpdate)
      return res
        .status(400)
        .json({ error: { message: `Request body must contain title` } });

    FolderService.updateFolder(
      req.app.get("db"),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;
