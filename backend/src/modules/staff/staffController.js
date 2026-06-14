const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const createStaff = async (req, res, next) => {
  try {
    const { userId, branchId, position, salary } = req.body;

    if (!userId || !branchId) {
      return errorResponse(res, 'User ID and Branch ID are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO branch_staff (user_id, branch_id, position, salary)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, branchId, position, salary]
    );

    logger.info(`Staff created: ${userId} at branch ${branchId}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create staff error:', error);
    next(error);
  }
};

const getAllStaff = async (req, res, next) => {
  try {
    const { branchId } = req.query;

    let query = `SELECT 
      bs.id,
      bs.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.role,
      bs.position,
      bs.salary,
      bs.joined_at
    FROM branch_staff bs
    JOIN users u ON bs.user_id = u.id
    WHERE 1=1`;
    const params = [];

    if (branchId) {
      query += ' AND bs.branch_id = $1';
      params.push(branchId);
    }

    query += ' ORDER BY u.first_name ASC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all staff error:', error);
    next(error);
  }
};

const getStaffById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        bs.id,
        bs.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.role,
        bs.position,
        bs.salary,
        bs.joined_at
      FROM branch_staff bs
      JOIN users u ON bs.user_id = u.id
      WHERE bs.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Staff not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get staff by ID error:', error);
    next(error);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { position, salary } = req.body;

    const result = await pool.query(
      `UPDATE branch_staff SET position = COALESCE($1, position), salary = COALESCE($2, salary), updated_at = NOW() WHERE id = $3 RETURNING *`,
      [position, salary, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Staff not found');
    }

    logger.info(`Staff updated: ${id}`);
    successResponse(res, result.rows[0], 'Staff updated successfully');
  } catch (error) {
    logger.error('Update staff error:', error);
    next(error);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM branch_staff WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Staff not found');
    }

    logger.info(`Staff deleted: ${id}`);
    successResponse(res, {}, 'Staff deleted successfully');
  } catch (error) {
    logger.error('Delete staff error:', error);
    next(error);
  }
};

const createShift = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    const { startTime, endTime, date } = req.body;

    if (!startTime || !endTime || !date) {
      return errorResponse(res, 'Start time, end time, and date are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO staff_shifts (branch_staff_id, start_time, end_time, shift_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [staffId, startTime, endTime, date]
    );

    logger.info(`Shift created for staff: ${staffId}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create shift error:', error);
    next(error);
  }
};

const getStaffShifts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    let query = 'SELECT * FROM staff_shifts WHERE branch_staff_id = $1';
    const params = [id];

    if (date) {
      query += ' AND shift_date = $2';
      params.push(date);
    }

    query += ' ORDER BY shift_date DESC, start_time ASC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get staff shifts error:', error);
    next(error);
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  createShift,
  getStaffShifts
};
