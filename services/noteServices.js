const { Note, Category } = require("../models/index.js");
const validateId = require("../helpers/validateId.js");
const { col, fn, Op, where } = require("sequelize");

const createNoteService = async (noteData, user_id) => {
    const { title, content, } = noteData;

    if (!title || typeof title !== "string") throw new Error("Invalid title");
    if (typeof content !== "string") throw new Error("Invalid content");

    const createdNote = await Note.create({ ...noteData, user_id });
    return createdNote;
};

const updateNoteService = async (id, user_id, updatedData) => {
    validateId(id);

    const { title, content } = updatedData;

    if (!title || typeof title !== "string") throw new Error("Invalid title");
    if (typeof content !== "string") throw new Error("Invalid content");

    const note = await Note.findOne({ where: { id, user_id, is_deleted: false } });
    if (!note) return null;

    await note.update(updatedData);
    return note;
};

const softDeleteNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: false } });
    if (!note) return null;

    await note.update({ is_deleted: true, is_archived: false });
    return note;
};

const restoreNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: true } });
    if (!note) return null;

    await note.update({ is_deleted: false });
    return note;
};

const hardDeleteNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: true } });
    if (!note) return null;

    await note.destroy();
    return true;
};

const archiveNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_archived: false, is_deleted: false } });
    if (!note) return null;

    await note.update({ is_archived: true });
    return note;
};

const unArchiveNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_archived: true, is_deleted: false } });
    if (!note) return null;

    await note.update({ is_archived: false });
    return note;
};

const getActiveNotesService = async (user_id) => {
    const notes = await Note.findAll({
        where: { user_id, is_deleted: false, is_archived: false },
        order: [["created_at", "DESC"]],
    });
    return notes;
};

const getNoteByIdService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({
        where: { id, user_id },
    });

    return note;
};

const getNoteByTitleService = async (title, user_id) => {
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

const getAllDeletedNotesService = async (user_id) => {
    console.log(user_id, "USER ID IN SERVICE");
    const notes = await Note.findAll({
        where: { user_id, is_deleted: true },
        order: [["created_at", "DESC"]],
    });

    return notes;
};

const getAllArchivedNotesService = async (user_id) => {
    const notes = await Note.findAll({
        where: { user_id, is_archived: true },
        order: [["created_at", "DESC"]],
    });

    return notes;
};

const buildWhereClause = ({ user_id, category, is_pinned }) => {
    const where = {
        user_id,
        is_deleted: false,
        is_archived: false,
    };

    if (category !== undefined && category !== null && category !== "") {
        where.category = category;
    }

    if (is_pinned !== undefined) {
        if (is_pinned === "true") where.is_pinned = true;
        else if (is_pinned === "false") where.is_pinned = false;
    }

    return where;
};

const buildSortClause = ({ sortBy = "created_at", order = "DESC" }) => {
    const allowedFields = ["created_at", "updated_at", "title"];
    const safeSortBy = allowedFields.includes(sortBy) ? sortBy : "created_at";

    const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    return [[safeSortBy, safeOrder]];
};

const getFilteredSortedNotesService = async (user_id, options = {}) => {
    const whereClause = buildWhereClause({ user_id, ...options });
    const sortClause = buildSortClause(options);

    const notes = await Note.findAll({
        where: whereClause,
        order: sortClause,
    });

    return notes;
};

const createCategoriesService = async (user_id, categoryData) => {
    const { name } = categoryData;

    if (!name || typeof name !== "string") {
        throw new Error("Invalid category name");
    }
    const category = await Category.create({ name, user_id });
    return category;
}

const getAllActiveCategoriesService = async (user_id) => {
    validateId(user_id);

    const categories = await Category.findAll({
        where: { user_id },
        order: [["created_at", "DESC"]],
    });

    return categories;
};

const updateCategoryService = async (id, user_id, updatedData) => {
    validateId(id);

    const { name } = updatedData;

    if (!name || typeof name !== "string") {
        throw new Error("Invalid category name");
    }

    const category = await Category.findOne({ 
        where: { id, user_id }
    });
    if (!category) return null;

    await category.update(updatedData);
    return category;
};

const getNotesCountService = async (user_id) => {
    validateId(user_id);

    const count = await Note.count({
        where: { user_id, is_deleted: false },
    });

    return count;
};

module.exports = {
    createNoteService,
    updateNoteService,
    softDeleteNoteService,
    restoreNoteService,
    hardDeleteNoteService,
    archiveNoteService,
    unArchiveNoteService,
    getActiveNotesService,
    getNoteByIdService,
    getNoteByTitleService,
    getAllDeletedNotesService,
    getAllArchivedNotesService,
    getFilteredSortedNotesService,
    getNotesCountService,
    createCategoriesService,
    getAllActiveCategoriesService,
    updateCategoryService,
};