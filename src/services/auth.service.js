import pool from "../config/db.js"
import AppError from "../errors/AppError.js"
import hashPassword from "../utils/hashPassword.js"
import comparePassword from "../utils/comparePassword.js"
import sendEmail from "../utils/sendEmail.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";

import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../utils/jwt.js"

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

    const decoded = verifyRefreshToken(refreshToken);
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