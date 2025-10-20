import Joi from 'joi';

export const albumCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "name must be a string",
    "any.required": "name is required",
    "string.empty": "name cannot be empty",
  }),
  year: Joi.number().integer().required().messages({
    "number.base": "year must be a number",
    "any.required": "year is required",
  }),
});
