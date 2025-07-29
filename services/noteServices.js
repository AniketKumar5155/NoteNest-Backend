const { Note, Category } = require("../models/index.js");
const validateId = require("../helpers/validateId.js");
const { col, fn, Op, where } = require("sequelize");

const createNoteService = async (noteData, user_id) => {
  const { title, content, category } = noteData;

  if (!title || typeof title !== "string") throw new Error("Invalid title");
  if (typeof content !== "string") throw new Error("Invalid content");

  if (category && typeof category !== "string") {
    throw new Error("Invalid category");
  }

  const newNote = await Note.create({
    user_id,
    title,
    content,
  });

  return newNote;
};


const updateNoteService = async (id, user_id, updatedData) => {
  validateId(id);

  if ("title" in updatedData && typeof updatedData.title !== "string")
    throw new Error("Invalid title");

  if ("content" in updatedData && typeof updatedData.content !== "string")
    throw new Error("Invalid content");

  if ("category" in updatedData && typeof updatedData.category !== "string")
    throw new Error("Invalid category");

  const note = await Note.findOne({
    where: { id, user_id, is_deleted: false },
  });

  if (!note) return null;

  await note.update(updatedData);
  return note;
};



const softDeleteNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: false } });
    if (!note) return null;

    await note.update({
        is_deleted: true,
        is_archived: false,
        deleted_at: new Date(),
    });
    return note;
};

const restoreNoteService = async (id, user_id) => {
    validateId(id);

    const note = await Note.findOne({ where: { id, user_id, is_deleted: true } });
    if (!note) return null;

    await note.update({
        is_deleted: false,
        deleted_at: null,
    });
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

const buildWhereClause = ({
    user_id,
    category,
    is_pinned,
    is_deleted,
    is_archived,
}) => {
    const where = { user_id };

    if (typeof is_deleted === "boolean") {
        where.is_deleted = is_deleted;
    }

    if (typeof is_archived === "boolean") {
        where.is_archived = is_archived;
    }

    if (typeof is_pinned === "boolean") {
        where.is_pinned = is_pinned;
    }

    if (category !== undefined && category !== null && category !== "") {
        where.category = category;
    }

    return where;
};


const buildSortClause = ({ sortBy = "created_at", order = "DESC" }) => {
    const allowedFields = ["deleted_at", "created_at", "updated_at", "title"];
    const safeSortBy = allowedFields.includes(sortBy) ? sortBy : "created_at";

    const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    return [[safeSortBy, safeOrder]];
};

const getFilteredSortedNotesService = async (userId, options) => {
  const { category, is_pinned } = options;

  const whereClause = {
    user_id: userId,
    is_deleted: false,
    is_archived: false,
  };

  if (typeof is_pinned === "boolean") {
    whereClause.is_pinned = is_pinned;
  }

  if (category !== undefined && category !== null && category !== "") {
    whereClause.category = category;
  }

  const sortClause = buildSortClause(options);

  const notes = await Note.findAll({
    where: whereClause,
    order: sortClause,
  });

  return notes;
};

const getAllDeletedFilteredSortedNotesService = async (user_id, options) => {
    const whereClause = buildWhereClause({ user_id, ...options, is_deleted: true, is_archived: false });
    const sortClause = buildSortClause(options);

    const notes = await Note.findAll({
        where: whereClause,
        order: sortClause,
    });

    return notes;
};

const getAllArchivedFilteredSortedNotesService = async (user_id, options) => {
    const whereClause = buildWhereClause({ user_id, ...options, is_deleted: false, is_archived: true });
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
};

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
    getNoteByIdService,
    getNoteByTitleService,
    getFilteredSortedNotesService,
    getNotesCountService,
    createCategoriesService,
    getAllActiveCategoriesService,
    updateCategoryService,
    getAllDeletedFilteredSortedNotesService,
    getAllArchivedFilteredSortedNotesService,
};
