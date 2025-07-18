const { z } = require("zod");

const createNoteSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, "title must be at least 1 character long"),

  content: z
    .string()
    .optional(), 
});

const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "title must be at least 1 character long")
    .optional(),

  content: z
    .string()
    .optional(),
});

const noteValidators = {
  createNoteSchema,
  updateNoteSchema,
};

module.exports = noteValidators;
