const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse } = require('../../utils/responses');
const logger = require('../../utils/logger');

const createIngredient = async (req, res, next) => {
  try {
    const { name, unit, minStock, currentStock, branchId } = req.body;

    if (!name || !unit || !currentStock) {
      return errorResponse(res, 'Name, unit, and current stock are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO ingredients (name, unit, min_stock, current_stock, branch_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, unit, minStock || 0, currentStock, branchId]
    );

    logger.info(`Ingredient created: ${name}`);
    createdResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Create ingredient error:', error);
    next(error);
  }
};

const getAllIngredients = async (req, res, next) => {
  try {
    const { branchId } = req.query;

    let query = 'SELECT * FROM ingredients WHERE 1=1';
    const params = [];

    if (branchId) {
      query += ' AND branch_id = $1';
      params.push(branchId);
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all ingredients error:', error);
    next(error);
  }
};

const getIngredientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM ingredients WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Ingredient not found');
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    logger.error('Get ingredient by ID error:', error);
    next(error);
  }
};

const updateIngredient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, unit, minStock, currentStock } = req.body;

    const result = await pool.query(
      `UPDATE ingredients SET name = COALESCE($1, name), unit = COALESCE($2, unit), min_stock = COALESCE($3, min_stock), current_stock = COALESCE($4, current_stock), updated_at = NOW() WHERE id = $5 RETURNING *`,
      [name, unit, minStock, currentStock, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Ingredient not found');
    }

    logger.info(`Ingredient updated: ${id}`);
    successResponse(res, result.rows[0], 'Ingredient updated successfully');
  } catch (error) {
    logger.error('Update ingredient error:', error);
    next(error);
  }
};

const deleteIngredient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM ingredients WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Ingredient not found');
    }

    logger.info(`Ingredient deleted: ${id}`);
    successResponse(res, {}, 'Ingredient deleted successfully');
  } catch (error) {
    logger.error('Delete ingredient error:', error);
    next(error);
  }
};

const createMovement = async (req, res, next) => {
  try {
    const { ingredientId, quantity, type, reason, branchId } = req.body;

    if (!ingredientId || !quantity || !type) {
      return errorResponse(res, 'Ingredient ID, quantity, and type are required', 400);
    }

    // Get current stock
    const ingredientResult = await pool.query(
      'SELECT current_stock FROM ingredients WHERE id = $1',
      [ingredientId]
    );

    if (ingredientResult.rows.length === 0) {
      return notFoundResponse(res, 'Ingredient not found');
    }

    const currentStock = ingredientResult.rows[0].current_stock;
    const newStock = type === 'IN' ? currentStock + quantity : currentStock - quantity;

    if (newStock < 0) {
      return errorResponse(res, 'Insufficient stock', 400);
    }

    // Create movement record
    const movementResult = await pool.query(
      `INSERT INTO stock_movements (ingredient_id, quantity, type, reason, previous_stock, new_stock, branch_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [ingredientId, quantity, type, reason, currentStock, newStock, branchId]
    );

    // Update ingredient stock
    await pool.query(
      'UPDATE ingredients SET current_stock = $1, updated_at = NOW() WHERE id = $2',
      [newStock, ingredientId]
    );

    logger.info(`Stock movement created: ${ingredientId} - ${type} ${quantity}`);
    createdResponse(res, movementResult.rows[0]);
  } catch (error) {
    logger.error('Create movement error:', error);
    next(error);
  }
};

const getAllMovements = async (req, res, next) => {
  try {
    const { branchId, ingredientId } = req.query;

    let query = 'SELECT * FROM stock_movements WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (branchId) {
      query += ` AND branch_id = $${paramIndex++}`;
      params.push(branchId);
    }

    if (ingredientId) {
      query += ` AND ingredient_id = $${paramIndex++}`;
      params.push(ingredientId);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    successResponse(res, result.rows);
  } catch (error) {
    logger.error('Get all movements error:', error);
    next(error);
  }
};

module.exports = {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  createMovement,
  getAllMovements
};
