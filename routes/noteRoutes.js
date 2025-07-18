import express from "express";
import {
  archiveNoteController,
  createNoteController,
  getAllActiveNotesController,
  getAllArchivedNotesController,
  getNoteByIdController,
  hardDeleteNoteController,
  restoreNotesController,
  softDeleteNotesController,
  unarchiveNoteController,
  updateNoteController,
  getAllDeletedNotesController,
} from "../controllers/noteController.js";
import validateZod from "../middlewares/validateZod.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createNoteSchema, updateNoteSchema } from "../validators/noteValidators.js";

const noteRouter = express.Router();

// ✅ Specific routes first (important)
noteRouter.get("/archive", authMiddleware, getAllArchivedNotesController);
noteRouter.get("/bin", authMiddleware, getAllDeletedNotesController);

// ✅ CRUD + note actions
noteRouter.post("/", authMiddleware, validateZod(createNoteSchema), createNoteController);
noteRouter.patch("/:id", authMiddleware, validateZod(updateNoteSchema), updateNoteController);
noteRouter.patch("/:id/update", authMiddleware, updateNoteController); // optional, your design
noteRouter.patch("/:id/soft-delete", authMiddleware, softDeleteNotesController);
noteRouter.patch("/:id/restore", authMiddleware, restoreNotesController);
noteRouter.delete("/:id/hard-delete", authMiddleware, hardDeleteNoteController);
noteRouter.patch("/:id/archive", authMiddleware, archiveNoteController);
noteRouter.patch("/:id/unarchive", authMiddleware, unarchiveNoteController);

// ✅ All active notes
noteRouter.get("/", authMiddleware, getAllActiveNotesController);

// ✅ Dynamic route last to prevent overriding
noteRouter.get("/:id", authMiddleware, getNoteByIdController);

export default noteRouter;
