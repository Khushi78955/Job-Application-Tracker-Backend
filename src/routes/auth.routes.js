import express from "express";
import validate from "../middleware/validate.js";
import protect from "../middleware/auth.middleware.js";
import passport from "../config/passport.js";

import { register, login, refreshToken, logout, sendVerification, verify, forgot, reset, enable2FA, verify2FA, disable2FA } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, verifyTwoFactorSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh", validate(refreshTokenSchema), refreshToken)
router.post("/logout", protect, logout)
router.post("/send-verification", protect, sendVerification)
router.get("/verify-email", verify);
router.post("/forgot-password", validate(forgotPasswordSchema), forgot)
router.post("/reset-password", validate(resetPasswordSchema), reset)

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}))

router.get("/google/callback", passport.authenticate("google", {
        session: false,
        failureMessage: true
    }),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Google login successful",
            data: req.user,
        });
    }
);

router.post("/enable-2fa", protect, enable2FA);
router.post("/verify-2fa", protect, validate(verifyTwoFactorSchema), verify2FA)
router.post("/disable-2fa", protect, disable2FA)


export default router;