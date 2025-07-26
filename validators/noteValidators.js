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

const createCategorySchema = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string"
    })
    .min(1, "name must be at least 1 character long")
    .trim(),
});

const updateCategorySchema = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string"
    })
    .min(1, "name must be at least 1 character long")
    .trim(),
});

const noteValidators = {
  createNoteSchema,
  updateNoteSchema,
  createCategorySchema,
  updateCategorySchema,
};

module.exports = noteValidators;
