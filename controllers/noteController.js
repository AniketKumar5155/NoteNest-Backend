const {
    archiveNoteService,
    createNoteService,
    getNoteByIdService,
    getNoteByTitleService,
    hardDeleteNoteService,
    restoreNoteService,
    softDeleteNoteService,
    unArchiveNoteService,
    updateNoteService,
    getFilteredSortedNotesService,
    createCategoriesService,
    getAllActiveCategoriesService,
    updateCategoryService,
    getAllDeletedFilteredSortedNotesService,
    getAllArchivedFilteredSortedNotesService,
    updateNoteColorAndShadeService,
} = require("../services/noteServices.js");

const asyncHandlerMiddleware = require("../middlewares/asyncHolderMiddleware.js");
const { createNoteSchema, updateNoteSchema, createCategorySchema, updateCategorySchema, updateNoteColorSchema } = require("../validators/noteValidators.js");
const validateId = require("../helpers/validateId.js");

exports.createNoteController = asyncHandlerMiddleware(async (req, res) => {
    const validatedData = createNoteSchema.parse(req.body);
    const userId = req.user.id;

    const note = await createNoteService(validatedData, userId);

    return res.status(201).json({
        success: true,
        message: "Note created successfully",
        data: note,
    });
});

exports.updateNoteController = asyncHandlerMiddleware(async (req, res) => {
    const validatedData = updateNoteSchema.parse(req.body)
    const noteId = req.params.id;
    const userId = req.user.id;

    const updatedNote = await updateNoteService(noteId, userId, validatedData);

    if (!updatedNote) {
        return res.status(404).json({
            success: false,
            message: "Note not found, may be deleted or you do not have access",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note updated successfully",
        data: updatedNote,
    });
});

exports.updateNoteColorAndShadeController = asyncHandlerMiddleware(async (req, res) => {
    const validatedData = updateNoteColorSchema.parse(req.body)
    const noteId = req.params.id;
    const userId = req.user.id

    const updatedNoteColorAndShade = await updateNoteColorAndShadeService(noteId, userId, validatedData)

       if (!updatedNoteColorAndShade) {
        return res.status(404).json({
            success: false,
            message: "Note not found",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note color and shade updated successfully",
        data: updatedNoteColorAndShade,
    })

})

exports.softDeleteNotesController = asyncHandlerMiddleware(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    const softDeletedNote = await softDeleteNoteService(noteId, userId);

    if (!softDeletedNote) {
        return res.status(404).json({
            success: false,
            message: "Note not found or already deleted",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note moved to bin successfully",
        data: softDeletedNote,
    });
});

exports.restoreNotesController = asyncHandlerMiddleware(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    const restoredNote = await restoreNoteService(noteId, userId);

    if (!restoredNote) {
        return res.status(404).json({
            success: false,
            message: "Note not found or not deleted",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note restored successfully",
        data: restoredNote,
    });
});

exports.hardDeleteNoteController = asyncHandlerMiddleware(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    const deleted = await hardDeleteNoteService(noteId, userId);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: "Note not found or already deleted permanently",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note permanently deleted successfully",
    });
});

exports.archiveNoteController = asyncHandlerMiddleware(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    const archivedNote = await archiveNoteService(noteId, userId);

    if (!archivedNote) {
        return res.status(404).json({
            success: false,
            message: "Note not found or already archived",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note archived successfully",
        data: archivedNote,
    });
});

exports.unarchiveNoteController = asyncHandlerMiddleware(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    const unArchivedNote = await unArchiveNoteService(noteId, userId);

    if (!unArchivedNote) {
        return res.status(404).json({
            success: false,
            message: "Note not found or already unarchived",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note unarchived successfully",
        data: unArchivedNote,
    });
});


exports.getNoteByIdController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    const noteById = await getNoteByIdService(noteId, userId);

    let status = "active"
    if (noteById.is_deleted){
        status = "deleted"
    }
    else if (noteById.is_archived){
        status = "archived"
    }

    if (!noteById) {
        return res.status(404).json({
            success: false,
            message: "Note not found",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Fetched note by ID successfully",
        data: {
            ...noteById.toJSON(),
            status,
        },
    });
});

exports.getNoteBytitleController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
    const noteTitle = req.params.title;

    if (!noteTitle || typeof noteTitle !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid title",
            data: null,
        });
    }

    const noteByTitle = await getNoteByTitleService(noteTitle, userId);

    if (!noteByTitle || !noteByTitle.note) {
        return res.status(404).json({
            success: false,
            message: "Note not found",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Fetched note by title successfully",
        data: noteByTitle,
    });
});



exports.getFilteredSortedNotesController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
    validateId(userId);

    const {
        sortBy = "created_at",
        order = "DESC",
        category,
        is_pinned,
    } = req.query;

    const normalizedPinned =
        is_pinned === "true" ? true :
            is_pinned === "false" ? false :
                undefined;

    const notes = await getFilteredSortedNotesService(
        userId,
        { sortBy, order, category, is_pinned: normalizedPinned }
    );

    return res.status(200).json({
        success: true,
        message: "Filtered and sorted notes fetched successfully",
        data: notes,
    });
});

exports.getAllDeletedFilteredSortedNotesController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
    validateId(userId)
    const {
        sortBy = "deleted_at",
        order = "DESC",
        category,
        is_pinned,
    } = req.query;

    const normalizedPinned =
        is_pinned === "true" ? true :
            is_pinned === "false" ? false :
                undefined;

    const notes = await getAllDeletedFilteredSortedNotesService(
        userId,
        {
            sortBy,
            order,
            category,
            is_pinned: normalizedPinned,
        });

    res.status(200).json({
        success: true,
        total: notes.length,
        message: "All deleted filtered and sorted notes",
        data: notes,
    });
});

exports.getAllArchivedFilteredSortedNotesController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id
    validateId(userId)
    const {
        sortBy = "updated_at",
        order = "DESC",
        category,
        is_pinned,
        is_deleted = false,
        is_archived = true,
    } = req.query

    const normalizedPinned =
        is_pinned === "true" ? true :
            is_pinned === "false" ? false :
                undefined;

    const notes = await getAllArchivedFilteredSortedNotesService(
        userId,
        {
            sortBy,
            order,
            category,
            is_pinned: normalizedPinned,
            is_deleted,
            is_archived,
        })

        return res.status(200).json({
            success: true,
            message: "All Archived filtered and sorted notes",
            data: notes,
        })
})


exports.createCategoryController = asyncHandlerMiddleware(async (req, res) => {
    const validatedData = createCategorySchema.parse(req.body);
    const userId = req.user.id;
    validateId(userId);

    const { name } = validatedData;

    const category = await createCategoriesService(userId, { name });

    return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
})

exports.getAllActiveCategoriesController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
    validateId(userId);

    const categories = await getAllActiveCategoriesService(userId);

    return res.status(200).json({
        success: true,
        message: "Fetched active categories successfully",
        data: categories,
    });
});

exports.updateCategoryController = asyncHandlerMiddleware(async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user.id;
    validateId(userId);
    validateId(categoryId);

    const updatedData = updateCategorySchema.parse(req.body);

    const updatedCategory = await updateCategoryService(categoryId, userId, updatedData);

    if (!updatedCategory) {
        return res.status(404).json({
            success: false,
            message: "Category not found or already deleted",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
})