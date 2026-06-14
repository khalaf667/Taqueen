const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const createCategory = async (req, res, next) => {
  try {
    const { name, description, branchId } = req.body;

    if (!name) {
      return errorResponse(res, 'Category name is required', 400);
    }

    const result = await pool.query(
      `INSERT INTO menu_categories (name, description, branch_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, branchId]
    );

    logger.info(`Menu category created: ${name}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create category error:', error);
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const { branchId } = req.query;

    let query = 'SELECT * FROM menu_categories WHERE 1=1';
    const params = [];

    if (branchId) {
      query += ' AND branch_id = $1';
      params.push(branchId);
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all categories error:', error);
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM menu_categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Category not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get category by ID error:', error);
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await pool.query(
      `UPDATE menu_categories SET name = COALESCE($1, name), description = COALESCE($2, description), updated_at = NOW() WHERE id = $3 RETURNING *`,
      [name, description, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Category not found');
    }

    logger.info(`Category updated: ${id}`);
    successResponse(res, result.rows[0], 'Category updated successfully');
  } catch (error) {
    logger.error('Update category error:', error);
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM menu_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Category not found');
    }

    logger.info(`Category deleted: ${id}`);
    successResponse(res, {}, 'Category deleted successfully');
  } catch (error) {
    logger.error('Delete category error:', error);
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { name, description, categoryId, price, image, isAvailable, branchId } = req.body;

    if (!name || !categoryId || !price) {
      return errorResponse(res, 'Name, category ID, and price are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO menu_items (name, description, category_id, price, image, is_available, branch_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, categoryId, price, image, isAvailable !== false, branchId]
    );

    logger.info(`Menu item created: ${name}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create item error:', error);
    next(error);
  }
};

const getAllItems = async (req, res, next) => {
  try {
    const { branchId, categoryId, isAvailable } = req.query;

    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (branchId) {
      query += ` AND branch_id = $${paramIndex++}`;
      params.push(branchId);
    }

    if (categoryId) {
      query += ` AND category_id = $${paramIndex++}`;
      params.push(categoryId);
    }

    if (isAvailable !== undefined) {
      query += ` AND is_available = $${paramIndex++}`;
      params.push(isAvailable === 'true');
    }

    query += ' ORDER BY category_id, name ASC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all items error:', error);
    next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM menu_items WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Item not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get item by ID error:', error);
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, isAvailable } = req.body;

    const result = await pool.query(
      `UPDATE menu_items SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), image = COALESCE($4, image), is_available = COALESCE($5, is_available), updated_at = NOW() WHERE id = $6 RETURNING *`,
      [name, description, price, image, isAvailable, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Item not found');
    }

    logger.info(`Item updated: ${id}`);
    successResponse(res, result.rows[0], 'Item updated successfully');
  } catch (error) {
    logger.error('Update item error:', error);
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Item not found');
    }

    logger.info(`Item deleted: ${id}`);
    successResponse(res, {}, 'Item deleted successfully');
  } catch (error) {
    logger.error('Delete item error:', error);
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
};
