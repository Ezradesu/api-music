// routes/users.js
import express from "express";
import {
  registerUser,
  getUserProfile,
} from "../controllers/usersController.js";
import { validateBody } from "../middlewares/validate.js";
import { userCreateSchema } from "../validators/authValidator.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", validateBody(userCreateSchema), registerUser);

router.get("/profile", authenticate, getUserProfile);

export default router;
