const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const createUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return errorResponse(res, 'Email is required', 400);
    }

    const result = await pool.query(
      `INSERT INTO users (email, first_name, last_name, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name, role, is_active, created_at`,
      [email, firstName, lastName, true]
    );

    logger.info(`User created: ${email}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create user error:', error);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );

    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get user by ID error:', error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, role } = req.body;

    const result = await pool.query(
      `UPDATE users SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        role = COALESCE($4, role),
        updated_at = NOW()
      WHERE id = $5
      RETURNING id, email, first_name, last_name, phone, role, is_active`,
      [firstName, lastName, phone, role, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found');
    }

    logger.info(`User updated: ${id}`);
    successResponse(res, result.rows[0], 'User updated successfully');
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found');
    }

    logger.info(`User deleted: ${id}`);
    successResponse(res, {}, 'User deleted successfully');
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
