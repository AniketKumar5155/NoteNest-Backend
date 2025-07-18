import { Note } from "../models/index.js";
import validateId from "../helpers/validateId.js";
import { col, fn, Op, where } from "sequelize";

export const createNoteService = async (noteData, user_id) => {
    const { title, content } = noteData;

    if (!title || typeof title !== "string") throw new Error("Invalid title");
    if (typeof content !== "string") throw new Error("Invalid content");

    const createdNote = await Note.create({ ...noteData, user_id });
    return createdNote;
};

export const updateNoteService = async (id, user_id, updatedData) => {
    validateId(id);

    const { title, content } = updatedData;

    if (!title || typeof title !== "string") throw new Error("Invalid title");
    if (typeof content !== "string") throw new Error("Invalid content");

    const note = await Note.findOne({ where: { id, user_id, is_deleted: false } });
    if (!note) return null;

    await note.update(updatedData);
    return note;
};

export const softDeleteNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: false } });
    if (!note) return null;

    await note.update({ is_deleted: true, is_archived: false });
    return note;
};

export const restoreNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: true } });
    if (!note) return null;

    await note.update({ is_deleted: false });
    return note;
};

export const hardDeleteNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: true } });
    if (!note) return null;

    await note.destroy();
    return true;
};

export const archiveNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_archived: false, is_deleted: false } });
    if (!note) return null;

    await note.update({ is_archived: true });
    return note;
};

export const unArchiveNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_archived: true, is_deleted: false } });
    if (!note) return null;

    await note.update({ is_archived: false });
    return note;
};

export const getActiveNotesService = async (user_id) => {
    const notes = await Note.findAll({
        where: { user_id, is_deleted: false, is_archived: false },
        order: [["created_at", "DESC"]],
    });
    return notes;
};

export const getNoteByIdService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({
        where: { id, user_id},
    });

    return note;
};

export const getNoteByTitleService = async (title, user_id) => {
    if (!title || typeof title !== "string") throw new Error("Invalid title");

    const note = await Note.findOne({
        where: {
            [Op.and]: [
                where(fn("LOWER", col("title")), title.toLowerCase()),
                { is_deleted: false, user_id },
            ],
        },
    });

    return note;
};

export const getAllDeletedNotesService = async (user_id) => {
    console.log(user_id, "USER ID IN SERVICE");
    const notes = await Note.findAll({
        where: { user_id, is_deleted: true },
        order: [["created_at", "DESC"]],
    });

    return notes;
};

export const getAllArchivedNotesService = async (user_id) => {
    const notes = await Note.findAll({
        where: { user_id, is_archived: true },
        order: [["created_at", "DESC"]],
    });

    return notes;
};

export const getFilteredSortedNotesService = async (
    user_id,
    { sortBy = "created_at", order = "DESC", category, is_pinned }
) => {
    const whereClause = {
        user_id,
        is_deleted: false,
    };

    if (category) {
        whereClause.category = category;
    }

    if (typeof is_pinned === "boolean") {
        whereClause.is_pinned = is_pinned;
    }

    const notes = await Note.findAll({
        where: whereClause,
        order: [[sortBy, order]],
    });

    return notes;
};

export const getNotesCountService = async (user_id) => {
    validateId(user_id);

    const count = await Note.count({
        where: { user_id, is_deleted: false },
    });

    return count;
};