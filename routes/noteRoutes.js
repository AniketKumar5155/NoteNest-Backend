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
  getFilteredSortedNotesController,
  createCategoryController,
  getAllActiveCategoriesController,
  updateCategoryController,
} = require("../controllers/noteController.js");
const validateZod = require("../middlewares/validateZod.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const { createNoteSchema, updateNoteSchema, createCategorySchema, updateCategorySchema } = require("../validators/noteValidators.js");

const router = express.Router();

router.get("/archive", authMiddleware, getAllArchivedNotesController);
router.get("/bin", authMiddleware, getAllDeletedNotesController);
router.get("/filter", authMiddleware, getFilteredSortedNotesController);
router.get("/active-categories", authMiddleware, getAllActiveCategoriesController);

router.post("/", authMiddleware, validateZod(createNoteSchema), createNoteController);
router.post("/category", authMiddleware, validateZod(createCategorySchema), createCategoryController);
router.patch("/:id", authMiddleware, validateZod(updateNoteSchema), updateNoteController);
router.patch("/:id/category", authMiddleware, validateZod(updateCategorySchema), updateCategoryController);
router.patch("/:id/update", authMiddleware, updateNoteController);
router.patch("/:id/soft-delete", authMiddleware, softDeleteNotesController);
router.patch("/:id/restore", authMiddleware, restoreNotesController);
router.delete("/:id/hard-delete", authMiddleware, hardDeleteNoteController);
router.patch("/:id/archive", authMiddleware, archiveNoteController);
router.patch("/:id/unarchive", authMiddleware, unarchiveNoteController);

router.get("/", authMiddleware, getAllActiveNotesController);

router.get("/:id", authMiddleware, getNoteByIdController);

module.exports = router;
