const express = require("express");
const {
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
} = require("../controllers/noteController.js");
const validateZod = require("../middlewares/validateZod.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const { createNoteSchema, updateNoteSchema } = require("../validators/noteValidators.js");

const router = express.Router();

// ✅ Specific routes first (important)
router.get("/archive", authMiddleware, getAllArchivedNotesController);
router.get("/bin", authMiddleware, getAllDeletedNotesController);

// ✅ CRUD + note actions
router.post("/", authMiddleware, validateZod(createNoteSchema), createNoteController);
router.patch("/:id", authMiddleware, validateZod(updateNoteSchema), updateNoteController);
router.patch("/:id/update", authMiddleware, updateNoteController); // optional, your design
router.patch("/:id/soft-delete", authMiddleware, softDeleteNotesController);
router.patch("/:id/restore", authMiddleware, restoreNotesController);
router.delete("/:id/hard-delete", authMiddleware, hardDeleteNoteController);
router.patch("/:id/archive", authMiddleware, archiveNoteController);
router.patch("/:id/unarchive", authMiddleware, unarchiveNoteController);

// ✅ All active notes
router.get("/", authMiddleware, getAllActiveNotesController);

// ✅ Dynamic route last to prevent overriding
router.get("/:id", authMiddleware, getNoteByIdController);

module.exports = router;
