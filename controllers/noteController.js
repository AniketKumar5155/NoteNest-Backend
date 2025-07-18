import {
    archiveNoteService,
    createNoteService,
    getActiveNotesService,
    getAllArchivedNotesService,
    getAllDeletedNotesService,
    getNoteByIdService,
    getNoteByTitleService,
    hardDeleteNoteService,
    restoreNoteService,
    softDeleteNoteService,
    unArchiveNoteService,
    updateNoteService,
} from "../services/noteServices.js";

import asyncHandlerMiddleware from "../Middlewares/asyncHolderMiddleware.js";
import { createNoteSchema, updateNoteSchema } from "../validators/noteValidators.js";
import validateId from "../helpers/validateId.js";

export const createNoteController = asyncHandlerMiddleware(async (req, res) => {
    const validatedData = createNoteSchema.parse(req.body);
    const userId = req.user.id;

    const note = await createNoteService(validatedData, userId);

    return res.status(201).json({
        success: true,
        message: "Note created successfully",
        data: note,
    });
});

export const updateNoteController = asyncHandlerMiddleware(async (req, res) => {
    const validatedData = updateNoteSchema.parse(req.body)
    const noteId = req.params.id;
    const userId = req.user.id;

    const updatedNote = await updateNoteService(noteId, userId, validatedData);

    if (!updatedNote) {
        return res.status(404).json({
            success: false,
            message: "Note not found or already deleted",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Note updated successfully",
        data: updatedNote,
    });
});

export const softDeleteNotesController = asyncHandlerMiddleware(async (req, res) => {
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

export const restoreNotesController = asyncHandlerMiddleware(async (req, res) => {
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

export const hardDeleteNoteController = asyncHandlerMiddleware(async (req, res) => {
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

export const archiveNoteController = asyncHandlerMiddleware(async (req, res) => {
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

export const unarchiveNoteController = asyncHandlerMiddleware(async (req, res) => {
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

export const getAllActiveNotesController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;

    const notes = await getActiveNotesService(userId);

    return res.status(200).json({
        success: true,
        message: "Fetched active notes successfully",
        data: notes,

    });
});

export const getNoteByIdController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    const noteById = await getNoteByIdService(noteId, userId);
    
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
        data: noteById,
    });
});

export const getNoteBytitleController = asyncHandlerMiddleware(async (req, res) => {
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

export const getAllDeletedNotesController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
    validateId(userId);
    console.log(userId, "USER ID IN CONTROLLER");
    const allDeletedNotes = await getAllDeletedNotesService(userId)

    return res.status(200).json({
        success: true,
        message: "Fetched deleted notes successfully",
        data: allDeletedNotes,

    });
});

export const getAllArchivedNotesController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user.id;
validateId(userId);
    const allArchivedNotes = await getAllArchivedNotesService(userId)

    return res.status(200).json({
        success: true,
        message: "Fetched archived notes successfully",
        data: allArchivedNotes,

    });
});