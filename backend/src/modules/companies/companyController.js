const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const createCompany = async (req, res, next) => {
  try {
    const { name, email, phone, address, city, country } = req.body;

    if (!name || !email) {
      return errorResponse(res, 'Name and email are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO companies (name, email, phone, address, city, country, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, email, phone, address, city, country, true]
    );

    logger.info(`Company created: ${name}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create company error:', error);
    next(error);
  }
};

const getAllCompanies = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM companies WHERE is_active = true ORDER BY created_at DESC'
    );

    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all companies error:', error);
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Company not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get company by ID error:', error);
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, country } = req.body;

    const result = await pool.query(
      `UPDATE companies SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        address = COALESCE($4, address),
        city = COALESCE($5, city),
        country = COALESCE($6, country),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *`,
      [name, email, phone, address, city, country, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Company not found');
    }

    logger.info(`Company updated: ${id}`);
    successResponse(res, result.rows[0], 'Company updated successfully');
  } catch (error) {
    logger.error('Update company error:', error);
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete
    const result = await pool.query(
      'UPDATE companies SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Company not found');
    }

    logger.info(`Company deleted: ${id}`);
    successResponse(res, {}, 'Company deleted successfully');
  } catch (error) {
    logger.error('Delete company error:', error);
    next(error);
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};
