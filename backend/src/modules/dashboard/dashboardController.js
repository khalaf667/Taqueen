const pool = require('../../config/database');
const { successResponse, errorResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const getDashboardOverview = async (req, res, next) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      return errorResponse(res, 'Branch ID is required', 400);
    }

    // Total orders today
    const ordersResult = await pool.query(
      `SELECT COUNT(*) as total FROM orders WHERE branch_id = $1 AND DATE(created_at) = CURRENT_DATE`,
      [branchId]
    );

    // Total revenue today
    const revenueResult = await pool.query(
      `SELECT SUM(total) as revenue FROM orders WHERE branch_id = $1 AND DATE(created_at) = CURRENT_DATE AND status = 'PAID'`,
      [branchId]
    );

    // Active tables
    const tablesResult = await pool.query(
      `SELECT COUNT(*) as active FROM tables WHERE branch_id = $1 AND status = 'OCCUPIED'`,
      [branchId]
    );

    // Pending orders
    const pendingResult = await pool.query(
      `SELECT COUNT(*) as pending FROM orders WHERE branch_id = $1 AND status IN ('PENDING', 'PREPARING')`,
      [branchId]
    );

    const overview = {
      totalOrders: parseInt(ordersResult.rows[0].total),
      totalRevenue: parseFloat(revenueResult.rows[0].revenue) || 0,
      activeTables: parseInt(tablesResult.rows[0].active),
      pendingOrders: parseInt(pendingResult.rows[0].pending)
    };

    successResponse(res, overview);
  } catch (error) {
    logger.error('Get dashboard overview error:', error);
    next(error);
  }
};

const getSalesData = async (req, res, next) => {
  try {
    const { branchId, period = 'day' } = req.query;

    if (!branchId) {
      return errorResponse(res, 'Branch ID is required', 400);
    }

    let query;
    if (period === 'day') {
      query = `SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE branch_id = $1 AND status = 'PAID' AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) DESC`;
    } else if (period === 'month') {
      query = `SELECT 
        DATE_TRUNC('month', created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE branch_id = $1 AND status = 'PAID' AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) DESC`;
    }

    const result = await pool.query(query, [branchId]);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get sales data error:', error);
    next(error);
  }
};

const getTopSellingItems = async (req, res, next) => {
  try {
    const { branchId, limit = 10 } = req.query;

    if (!branchId) {
      return errorResponse(res, 'Branch ID is required', 400);
    }

    const result = await pool.query(
      `SELECT 
        mi.id,
        mi.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.branch_id = $1 AND o.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY mi.id, mi.name
      ORDER BY total_sold DESC
      LIMIT $2`,
      [branchId, parseInt(limit)]
    );

    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get top selling items error:', error);
    next(error);
  }
};

const getInventoryReport = async (req, res, next) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      return errorResponse(res, 'Branch ID is required', 400);
    }

    const result = await pool.query(
      `SELECT 
        id,
        name,
        unit,
        current_stock,
        min_stock,
        CASE WHEN current_stock <= min_stock THEN 'LOW' ELSE 'OK' END as status
      FROM ingredients
      WHERE branch_id = $1
      ORDER BY current_stock ASC`,
      [branchId]
    );

    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get inventory report error:', error);
    next(error);
  }
};

const getStaffPerformance = async (req, res, next) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      return errorResponse(res, 'Branch ID is required', 400);
    }

    const result = await pool.query(
      `SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.role,
        COUNT(o.id) as total_orders,
        SUM(o.total) as total_revenue
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.branch_id = $1 AND o.created_at >= NOW() - INTERVAL '7 days'
      WHERE u.id IN (
        SELECT user_id FROM branch_staff WHERE branch_id = $1
      )
      GROUP BY u.id, u.first_name, u.last_name, u.role
      ORDER BY total_orders DESC`,
      [branchId]
    );

    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get staff performance error:', error);
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
  getSalesData,
  getTopSellingItems,
  getInventoryReport,
  getStaffPerformance
};
