import Joi from "joi";

export const exportPlaylistSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});
