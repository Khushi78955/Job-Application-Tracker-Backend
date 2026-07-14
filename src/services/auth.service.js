import pool from "../config/db.js"
import AppError from "../errors/AppError.js"
import hashPassword from "../utils/hashPassword.js"
import comparePassword from "../utils/comparePassword.js"
import sendEmail from "../utils/sendEmail.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import generateResetToken from "../utils/generateResetToken.js";
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../utils/jwt.js"
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export const registerUser = async ({name, email, password}) => {

    const existingUser = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
    )

    if(existingUser.rows.length > 0){
        throw new AppError("User already exists", 409);
    }

    const passwordHash = await hashPassword(password);
    const result = await pool.query(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, is_verified, two_factor_enabled
        `,
        [name, email, passwordHash]
    )

    const user = result.rows[0];
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await pool.query(
        `
        UPDATE users
        SET refresh_token = $1
        WHERE id = $2
        `,
        [refreshToken, user.id]
    )

    await sendVerificationEmail(user.id);

    return {
        user,
        tokens: {
            accessToken,
            refreshToken
        }
    }
}





export const loginUser = async ({email, password}) => {
    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    )
    if(result.rows.length === 0){
        throw new AppError("Invalid email or password", 401)
    }

    const user = result.rows[0];
    if(!user.password_hash){
        throw new AppError("Please login using Google", 400)
    }

    const isPasswordCorrect = await comparePassword(password, user.password_hash);
    if(!isPasswordCorrect){
        throw new AppError("Invalid email or password", 401)
    }
    if (!user.is_verified) {
        throw new AppError(
            "Please verify your email before logging in",
            403
        );
    }
    if (user.two_factor_enabled) {
        return {
            requiresTwoFactor: true,
            userId: user.id,
        };
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query(
        `
        UPDATE users
        SET refresh_token = $1
        WHERE id = $2
        `,
        [refreshToken, user.id]
    )

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.is_verified,
            twoFactorEnabled: user.two_factor_enabled,
        },
        tokens: {
            accessToken,
            refreshToken
        }
    }
}



export const refreshUserToken = async (refreshToken) => {
    if(!refreshToken){
        throw new AppError("Refresh token is required", 401);
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
        throw new AppError("Invalid or expired refresh token", 401);
    }
    
    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE id = $1
        `,
        [decoded.userId]
    )
    if(result.rows.length === 0){
        throw new AppError("User not found", 404);
    }

    const user = result.rows[0];
    if(user.refresh_token !== refreshToken){
        throw new AppError("Invalid refresh token", 401);
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await pool.query(
        `
        UPDATE users
        SET refresh_token = $1
        WHERE id = $2
        `,
        [newRefreshToken, user.id]
    )

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}




export const logoutUser = async (userId) => {
    await pool.query(
    `
    UPDATE users
    SET refresh_token = NULL
    WHERE id = $1
    `,
    [userId]
  );
  return {
    message: "Logged out successfully",
  }
}



export const sendVerificationEmail = async (userId) => {
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    const result = await pool.query(
        `
        UPDATE users
        SET
            email_verification_token = $1,
            email_verification_expires_at = $2
        WHERE id = $3
        RETURNING email
        `,
        [token, expiresAt, userId]
    )

    if(result.rows.length === 0){
        throw new AppError("User not found", 404)
    }

    const email = result.rows[0].email;
    const verificationLink = `http://localhost:2000/api/v1/auth/verify-email?token=${token}`;
    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
        <h2>Verify your Email</h2>
        <p>Click the link below:</p>
        <a href="${verificationLink}">
            Verify Email
        </a>
        `,
    });

    return {
        message: "Verification email sent successfully"
    }
}



export const verifyEmail = async (token) => {
    const result = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email_verification_token = $1
        AND email_verification_expires_at > CURRENT_TIMESTAMP
        `,
        [token]
    )
    if(result.rows.length === 0){
        throw new AppError("Invalid or expired verification token", 400);
    }

    const userId = result.rows[0].id;
    await pool.query(
        `
        UPDATE users
        SET
        is_verified = TRUE,
        email_verification_token = NULL,
        email_verification_expires_at = NULL
        WHERE id = $1
        `,
        [userId]
    )
    return {
        message: "Email verified successfully",
    }
}


export const forgotPassword = async ({email}) => {
    const result = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
    )
    if(result.rows.length === 0){
        throw new AppError("User not found", 404);
    }

    const userId = result.rows[0].id;
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await pool.query(
        `
        UPDATE users
        SET
        password_reset_token = $1,
        password_reset_expires_at = $2
        WHERE id = $3
        `,
        [token, expiresAt, userId]

    )

    const resetLink = `http://localhost:${process.env.PORT}/api/v1/auth/reset-password?token=${token}`;
    await sendEmail({
        to: email,
        subject: "Reset your password",
        html: `
        <h2>Reset Password</h2>
        <p>Click below to reset your password.</p>
        <a href="${resetLink}">
            Reset Password
        </a>
        `,
    });
    return {
        message: "Password reset email sent successfully",
    }
}



export const resetPassword = async ({token, password}) => {
    const result = await pool.query(
        `
        SELECT id
        FROM users
        WHERE password_reset_token = $1
        AND password_reset_expires_at > CURRENT_TIMESTAMP
        `,
        [token]
    )
    if(result.rows.length === 0){
        throw new AppError("Invalid or expired reset token", 400);
    }

    const userId = result.rows[0].id;
    const passwordHash = await hashPassword(password);
    await pool.query(
        `
        UPDATE users
        SET
        password_hash = $1,
        password_reset_token = NULL,
        password_reset_expires_at = NULL
        WHERE id = $2
        `,
        [passwordHash, userId]
    );
    return {
        message: "Password reset successfully",
    }


}



export const googleLogin = async (profile) => {
    const googleId = profile.id;
    
    if (!profile.emails || profile.emails.length === 0) {
        throw new AppError("Google account has no email", 400);
    }

    const email = profile.emails[0].value;
    const name = profile.displayName;
    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    )
    let user;
    if (result.rows.length > 0) {
        user = result.rows[0];

        if (!user.google_id) {
            const updatedUser = await pool.query(
                `
                UPDATE users
                SET 
                    google_id = $1,
                    is_verified = TRUE
                WHERE id = $2
                RETURNING *
                `,
                [googleId, user.id]
            );

            user = updatedUser.rows[0];
        }
    }
    else{
        const newUser = await pool.query(
            `
            INSERT INTO users
            (
                name,
                email,
                google_id,
                is_verified
            )
            VALUES
            ($1,$2,$3,TRUE)
            RETURNING *
            `,
            [name,email,googleId]
        );
        user = newUser.rows[0];
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await pool.query(
        `
        UPDATE users
        SET refresh_token = $1
        WHERE id = $2
        `,
        [refreshToken, user.id]
    );
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.is_verified,
            twoFactorEnabled: user.two_factor_enabled,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };

}


export const enableTwoFactor = async (userId) => {
    const secret = speakeasy.generateSecret({
        name: "Job Application Tracker"
    })
    await pool.query(
        `
        UPDATE users
        SET two_factor_secret = $1
        WHERE id = $2
        `,
        [secret.base32, userId]
    );

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    return {
        secret: secret.base32,
        qrCode

    }
}



export const verifyTwoFactor = async ({userId, token}) => {
    const result = await pool.query(
        `
        SELECT two_factor_secret
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    if(result.rows.length === 0){
        throw new AppError("User not found", 404);
    }
    const secret = result.rows[0].two_factor_secret;
    const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token
    })

    if(!verified){
        throw new AppError("Invalid verification code", 400);
    }
    await pool.query(
        `
        UPDATE users
        SET
            two_factor_enabled = TRUE
        WHERE id = $1
        `,
        [userId]
    );

    const userResult = await pool.query(
        `
        SELECT *
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    const user = userResult.rows[0];

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query(
        `
        UPDATE users
        SET refresh_token = $1
        WHERE id = $2
        `,
        [refreshToken, user.id]
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.is_verified,
            twoFactorEnabled: user.two_factor_enabled,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}


export const disableTwoFactor = async (userId) => {
    const result = await pool.query(
        `
        UPDATE users
        SET
            two_factor_enabled = FALSE,
            two_factor_secret = NULL
        WHERE id = $1
        RETURNING id
        `,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new AppError("User not found", 404);
    }

    return {
        message: "Two-factor authentication disabled successfully",
    };
};