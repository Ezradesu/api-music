// routes/authentications.js
import express from "express";
import { validateBody } from "../middlewares/validate.js";
import {
  authLoginSchema,
  refreshTokenSchema,
} from "../validators/authValidator.js";
import {
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/", validateBody(authLoginSchema), loginUser);

router.put("/", validateBody(refreshTokenSchema), refreshToken);

router.delete("/", validateBody(refreshTokenSchema), logoutUser);

export default router;
