import express from "express";
import validate from "../middleware/validate.js";
import protect from "../middleware/auth.middleware.js";

import { register, login, refreshToken, logout, sendVerification, verify } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator.js";

const router = express.Router();
router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh", validate(refreshTokenSchema), refreshToken)
router.post("/logout", logout)
router.post("/send-verification", protect, sendVerification)
router.get("/verify-email", verify);

export default router;