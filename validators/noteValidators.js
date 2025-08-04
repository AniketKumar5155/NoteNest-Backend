const { z } = require("zod");

const ALLOWED_COLORS = [
  "gray", "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "blue", "indigo", "violet", "purple", "pink", "rose", "brown", "black"
];

const ALLOWED_SHADES = [
  "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"
];

// ✅ Reusable validators
const colorSchema = z
  .string()
  .refine(val => ALLOWED_COLORS.includes(val), {
    message: "Invalid color",
  });

const shadeSchema = z
  .string()
  .refine(val => ALLOWED_SHADES.includes(val), {
    message: "Invalid shade",
  });

// ✅ Create Note
const createNoteSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, "title must be at least 1 character long"),

  content: z.string().optional(),

  category: z.string().nullable().optional(),

  color: colorSchema.default("amber"),

  shade: shadeSchema.default("300"),
});

// ✅ Update Note
const updateNoteSchema = z.object({
  title: z.string().min(1, "title must be at least 1 character long").optional(),
  content: z.string().optional(),
  category: z.string().nullable().optional(),
  color: colorSchema.optional(),
  shade: shadeSchema.optional(),
});

// ✅ Only update color and shade + id
const updateNoteColorSchema = z.object({
  color: colorSchema,
  shade: shadeSchema,
});

// ✅ Create Category
const createCategorySchema = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string"
    })
    .min(1, "name must be at least 1 character long")
    .trim(),
});

// ✅ Update Category
const updateCategorySchema = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string"
    })
    .min(1, "name must be at least 1 character long")
    .trim(),
});

// ✅ Export all
const noteValidators = {
  createNoteSchema,
  updateNoteSchema,
  updateNoteColorSchema,
  createCategorySchema,
  updateCategorySchema,
};

module.exports = noteValidators;
