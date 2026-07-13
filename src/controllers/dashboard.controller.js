import { getDashboardStats } from "../services/dashboard.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const result = await getDashboardStats(req.user.userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};