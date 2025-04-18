import { Router } from "express";
import { NotesController } from "../controllers/notes.controller";
import { verifyToken } from "../middlewares/verifyToken";

const noteRoutes = Router();

noteRoutes.get("/notes", verifyToken, NotesController.getAllNotes);
noteRoutes.get("/notes/create", verifyToken, NotesController.getCreateNotePage);
noteRoutes.post("/notes/create", verifyToken, NotesController.createNote);
noteRoutes.get("/notes/:id", verifyToken, NotesController.getOneNote);
noteRoutes.get("/notes/update/:id", verifyToken, NotesController.getUpdateNotePage);
noteRoutes.post("/notes/update/:id", verifyToken, NotesController.updateNote);
noteRoutes.post("/notes/delete/:id", verifyToken, NotesController.deleteNote);

export default noteRoutes;
