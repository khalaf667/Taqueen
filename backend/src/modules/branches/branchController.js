const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const createBranch = async (req, res, next) => {
  try {
    const { companyId, name, email, phone, address, city, country, manager } = req.body;

    if (!companyId || !name) {
      return errorResponse(res, 'Company ID and name are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO branches (company_id, name, email, phone, address, city, country, manager_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [companyId, name, email, phone, address, city, country, manager, true]
    );

    logger.info(`Branch created: ${name}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create branch error:', error);
    next(error);
  }
};

const getAllBranches = async (req, res, next) => {
  try {
    const { companyId } = req.query;

    let query = 'SELECT * FROM branches WHERE is_active = true';
    const params = [];

    if (companyId) {
      query += ' AND company_id = $1';
      params.push(companyId);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all branches error:', error);
    next(error);
  }
};

const getBranchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM branches WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Branch not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get branch by ID error:', error);
    next(error);
  }
};

const updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, country, manager } = req.body;

    const result = await pool.query(
      `UPDATE branches SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        address = COALESCE($4, address),
        city = COALESCE($5, city),
        country = COALESCE($6, country),
        manager_id = COALESCE($7, manager_id),
        updated_at = NOW()
      WHERE id = $8
      RETURNING *`,
      [name, email, phone, address, city, country, manager, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Branch not found');
    }

    logger.info(`Branch updated: ${id}`);
    successResponse(res, result.rows[0], 'Branch updated successfully');
  } catch (error) {
    logger.error('Update branch error:', error);
    next(error);
  }
};

const deleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete
    const result = await pool.query(
      'UPDATE branches SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Branch not found');
    }

    logger.info(`Branch deleted: ${id}`);
    successResponse(res, {}, 'Branch deleted successfully');
  } catch (error) {
    logger.error('Delete branch error:', error);
    next(error);
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch
};
