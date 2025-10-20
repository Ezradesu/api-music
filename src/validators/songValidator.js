import Joi from "joi";

export const songCreateSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "title must be a string",
    "any.required": "title is required",
  }),
  year: Joi.number().integer().required().messages({
    "number.base": "year must be a number",
    "any.required": "year is required",
  }),
  genre: Joi.string().required().messages({
    "string.base": "genre must be a string",
    "any.required": "genre is required",
  }),
  performer: Joi.string().required().messages({
    "string.base": "performer must be a string",
    "any.required": "performer is required",
  }),
  duration: Joi.number().integer().optional().allow(null),
  albumId: Joi.string().optional().allow(null),
});
