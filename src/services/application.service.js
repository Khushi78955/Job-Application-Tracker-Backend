import pool from "../config/db.js";
import AppError from "../errors/AppError.js";

export const createApplication = async (userId, data) => {
    const {company, role, status, applied_date, follow_up_date, notes} = data;
    const result = await pool.query(
        `
        INSERT INTO applications
        (user_id, company, role, status, applied_date, follow_up_date, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [userId, company, role, status, applied_date, follow_up_date, notes]
    );
    return result.rows[0];
};



export const getApplications = async (userId, query) => {
    const {status, company, search, page, limit, sort} = query;
    let sql = 
    `
        SELECT *
        FROM applications
        WHERE user_id = $1
    `;
    const values = [userId];
    let index = 2;

    if (status) {
        sql += ` AND status = $${index}`;
        values.push(status);
        index++;
    }

    if (company) {
        sql += ` AND company ILIKE $${index}`;
        values.push(`%${company}%`);
        index++;
    }

    if (search) {
        sql += `
        AND (
            company ILIKE $${index}
            OR role ILIKE $${index}
        )
        `;
        values.push(`%${search}%`);
        index++;
    }

    sql += ` ORDER BY ${sort} DESC`;

    sql += ` LIMIT $${index}`;
    values.push(limit);
    index++;

    sql += ` OFFSET $${index}`;
    values.push((page - 1) * limit);

    const result = await pool.query(sql, values);

    return result.rows;
};


export const getApplicationById = async (userId, applicationId) => {
    const result = await pool.query(
        `
        SELECT *
        FROM applications
        WHERE id = $1
        AND user_id = $2
        `,
        [applicationId, userId]
    );
    if (result.rows.length === 0) {
        throw new AppError("Application not found", 404);
    }
    return result.rows[0];
};



export const updateApplication = async (userId, applicationId, data) => {
    const {company, role, status, applied_date, follow_up_date, notes} = data;
    const result = await pool.query(
        `
        UPDATE applications
        SET
        company = $1,
        role = $2,
        status = $3,
        applied_date = $4,
        follow_up_date = $5,
        notes = $6,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        AND user_id = $8
        RETURNING *
        `,
        [company, role, status, applied_date, follow_up_date, notes, applicationId, userId]
    );
    if (result.rows.length === 0) {
        throw new AppError("Application not found", 404);
    }
    return result.rows[0];
};






export const deleteApplication = async (userId, applicationId) => {
    const result = await pool.query(
        `
        DELETE FROM applications
        WHERE id = $1
        AND user_id = $2
        RETURNING *
        `,
        [applicationId, userId]
    );

    if (result.rows.length === 0) {
        throw new AppError("Application not found", 404);
    }

    return {
        message: "Application deleted successfully",
    };
};