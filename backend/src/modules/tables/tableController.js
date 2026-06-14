const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const createTable = async (req, res, next) => {
  try {
    const { branchId, tableNumber, capacity, section } = req.body;

    if (!branchId || !tableNumber || !capacity) {
      return errorResponse(res, 'Branch ID, table number, and capacity are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO tables (branch_id, table_number, capacity, section, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [branchId, tableNumber, capacity, section, 'AVAILABLE']
    );

    logger.info(`Table created: ${tableNumber}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create table error:', error);
    next(error);
  }
};

const getAllTables = async (req, res, next) => {
  try {
    const { branchId } = req.query;

    let query = 'SELECT * FROM tables WHERE 1=1';
    const params = [];

    if (branchId) {
      query += ' AND branch_id = $1';
      params.push(branchId);
    }

    query += ' ORDER BY table_number ASC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all tables error:', error);
    next(error);
  }
};

const getTableById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM tables WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Table not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get table by ID error:', error);
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, section } = req.body;

    const result = await pool.query(
      `UPDATE tables SET table_number = COALESCE($1, table_number), capacity = COALESCE($2, capacity), section = COALESCE($3, section), updated_at = NOW() WHERE id = $4 RETURNING *`,
      [tableNumber, capacity, section, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Table not found');
    }

    logger.info(`Table updated: ${id}`);
    successResponse(res, result.rows[0], 'Table updated successfully');
  } catch (error) {
    logger.error('Update table error:', error);
    next(error);
  }
};

const updateTableStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'DIRTY'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, `Invalid status. Allowed: ${validStatuses.join(', ')}`, 400);
    }

    const result = await pool.query(
      'UPDATE tables SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Table not found');
    }

    logger.info(`Table status updated: ${id} -> ${status}`);
    successResponse(res, result.rows[0], 'Table status updated successfully');
  } catch (error) {
    logger.error('Update table status error:', error);
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tables WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Table not found');
    }

    logger.info(`Table deleted: ${id}`);
    successResponse(res, {}, 'Table deleted successfully');
  } catch (error) {
    logger.error('Delete table error:', error);
    next(error);
  }
};

module.exports = {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  updateTableStatus,
  deleteTable
};
