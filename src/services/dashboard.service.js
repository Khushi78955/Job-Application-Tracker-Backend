import pool from "../config/db.js";

export const getDashboardStats = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'Applied') AS applied,
      COUNT(*) FILTER (WHERE status = 'Interview') AS interview,
      COUNT(*) FILTER (WHERE status = 'Offer') AS offer,
      COUNT(*) FILTER (WHERE status = 'Rejected') AS rejected,
      COUNT(*) FILTER (WHERE status = 'Wishlist') AS wishlist
    FROM applications
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};