const path = require("path");
const express = require("express");
const xss = require("xss");
const NotesService = require("./notes-service.js");

const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route("/")
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get("db")).then(notes => res.json(notes));
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, folder } = req.body;
    const newNote = { title, content, folder };
    NotesService.createNote(req.app.get("db"), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(note);
      })
      .catch(next);
  });

notesRouter
  .route("/:note_id")
  .all((req, res, next) => {
    NotesService.getById(req.app.get("db"), req.params.note_id)
      .then(note => {
        if (!note) {
          return res.status(404).json({ error: { message: `Note no existo` } });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.note);
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get("db"), req.params.note_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, content, folder } = req.body;
    const noteToUpdate = { title, content, folder };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request must contain 'title', 'content', or 'folder'`
        }
      });

    NotesService.updateNote(
      req.app.get("db"),
      req.params.note_id,
      noteToUpdate
    ).then(numRowsAffected => res.status(204).end());
  });

module.exports = notesRouter;
