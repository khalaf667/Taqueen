const pool = require('../../config/database');
const { successResponse, createdResponse, errorResponse, notFoundResponse, paginatedResponse } = require('../../utils/responses');
const { paginate } = require('../../utils/helpers');
const logger = require('../../utils/logger');

const createOrder = async (req, res, next) => {
  try {
    const { branchId, tableId, items, notes, customerId } = req.body;
    const userId = req.user.id;

    if (!branchId || !items || items.length === 0) {
      return errorResponse(res, 'Branch ID and items are required', 400);
    }

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      const result = await pool.query(
        'SELECT price FROM menu_items WHERE id = $1',
        [item.menuItemId]
      );
      if (result.rows.length > 0) {
        subtotal += result.rows[0].price * item.quantity;
      }
    }

    const tax = parseFloat((subtotal * 0.15).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // Generate order number
    const orderNumber = '#' + Date.now().toString().slice(-8);

    // Create order
    const orderResult = await pool.query(
      `INSERT INTO orders (order_number, branch_id, table_id, customer_id, user_id, subtotal, tax, total, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, order_number, status, created_at`,
      [orderNumber, branchId, tableId, customerId, userId, subtotal, tax, total, 'PENDING', notes]
    );

    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.menuItemId, item.quantity, item.price, item.notes]
      );
    }

    // Update table status if table exists
    if (tableId) {
      await pool.query(
        'UPDATE tables SET status = $1, current_order_id = $2 WHERE id = $3',
        ['OCCUPIED', orderId, tableId]
      );
    }

    logger.info(`Order created: ${orderNumber}`);

    createdResponse(res, orderResult.rows[0], 'Order created successfully');
  } catch (error) {
    logger.error('Create order error:', error);
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, branchId, status } = req.query;
    const { offset } = paginate(parseInt(page), parseInt(limit));

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (branchId) {
      query += ` AND branch_id = $${paramIndex++}`;
      params.push(branchId);
    }

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM orders WHERE 1=1 ${branchId ? `AND branch_id = $1` : ''} ${status ? `AND status = $${branchId ? 2 : 1}` : ''}`,
      params
    );

    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    paginatedResponse(res, result.rows, parseInt(page), parseInt(limit), total);
  } catch (error) {
    logger.error('Get all orders error:', error);
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return notFoundResponse(res, 'Order not found');
    }

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    const order = orderResult.rows[0];
    order.items = itemsResult.rows;

    successResponse(res, order);
  } catch (error) {
    logger.error('Get order by ID error:', error);
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      'UPDATE orders SET notes = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [notes, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Order not found');
    }

    logger.info(`Order updated: ${id}`);
    successResponse(res, result.rows[0], 'Order updated successfully');
  } catch (error) {
    logger.error('Update order error:', error);
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'PAID', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, `Invalid status. Allowed: ${validStatuses.join(', ')}`, 400);
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Order not found');
    }

    logger.info(`Order status updated: ${id} -> ${status}`);
    successResponse(res, result.rows[0], 'Order status updated successfully');
  } catch (error) {
    logger.error('Update order status error:', error);
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get order
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return notFoundResponse(res, 'Order not found');
    }

    // Delete order items
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);

    // Delete order
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);

    // Reset table status
    const order = orderResult.rows[0];
    if (order.table_id) {
      await pool.query(
        'UPDATE tables SET status = $1, current_order_id = NULL WHERE id = $2',
        ['AVAILABLE', order.table_id]
      );
    }

    logger.info(`Order deleted: ${id}`);
    successResponse(res, {}, 'Order deleted successfully');
  } catch (error) {
    logger.error('Delete order error:', error);
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder
};
