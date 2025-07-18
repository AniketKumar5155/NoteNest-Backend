import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, "title must be at least 1 character long"),

  content: z
    .string()
    .optional(), 
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "title must be at least 1 character long")
    .optional(),

  content: z
    .string()
    .optional(),
});
