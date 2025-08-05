const express = require("express");
const {
  archiveNoteController,
  createNoteController,
  getNoteByIdController,
  hardDeleteNoteController,
  restoreNotesController,
  softDeleteNotesController,
  unarchiveNoteController,
  updateNoteController,
  createCategoryController,
  updateCategoryController,
  getAllActiveCategoriesController,
  getFilteredSortedNotesController,
  getAllDeletedFilteredSortedNotesController,
  getAllArchivedFilteredSortedNotesController,
  updateNoteColorAndShadeController,
  deleteCategoryController
} = require("../controllers/noteController.js");
const validateZod = require("../middlewares/validateZod.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const { createNoteSchema, updateNoteSchema, createCategorySchema, updateCategorySchema } = require("../validators/noteValidators.js");

const router = express.Router();

router.get("/", authMiddleware, getFilteredSortedNotesController);
router.get("/archive", authMiddleware, getAllArchivedFilteredSortedNotesController);
router.get("/bin", authMiddleware, getAllDeletedFilteredSortedNotesController);
router.get("/active-categories", authMiddleware, getAllActiveCategoriesController);

router.post("/", authMiddleware, validateZod(createNoteSchema), createNoteController);
router.post("/category", authMiddleware, validateZod(createCategorySchema), createCategoryController);
router.patch("/:id/update", authMiddleware, validateZod(updateNoteSchema), updateNoteController);
router.patch("/:id/category", authMiddleware, validateZod(updateCategorySchema), updateCategoryController);
router.patch("/:id/soft-delete", authMiddleware, softDeleteNotesController);
router.patch("/:id/restore", authMiddleware, restoreNotesController);
router.delete("/:id/hard-delete", authMiddleware, hardDeleteNoteController);
router.delete("/:id/category/delete", authMiddleware, deleteCategoryController)
router.patch("/:id/archive", authMiddleware, archiveNoteController);
router.patch("/:id/unarchive", authMiddleware, unarchiveNoteController);
router.patch("/:id/update-color-shade", authMiddleware, updateNoteColorAndShadeController)

router.get("/:id", authMiddleware, getNoteByIdController);

module.exports = router;  
 