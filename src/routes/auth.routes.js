import express from "express";
import validate from "../middleware/validate.js";

import { register, login, refreshToken, logout } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator.js";

const router = express.Router();
router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh", validate(refreshTokenSchema), refreshToken)
router.post("/logout", logout)

export default router;