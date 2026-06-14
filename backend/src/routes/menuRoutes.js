const express = require('express');
const router = express.Router();
const menuController = require('../modules/menu/menuController');
const { adminOnly } = require('../middlewares/roleMiddleware');

// Categories
router.post('/categories', adminOnly, menuController.createCategory);
router.get('/categories', menuController.getAllCategories);
router.get('/categories/:id', menuController.getCategoryById);
router.put('/categories/:id', adminOnly, menuController.updateCategory);
router.delete('/categories/:id', adminOnly, menuController.deleteCategory);

// Items
router.post('/items', adminOnly, menuController.createItem);
router.get('/items', menuController.getAllItems);
router.get('/items/:id', menuController.getItemById);
router.put('/items/:id', adminOnly, menuController.updateItem);
router.delete('/items/:id', adminOnly, menuController.deleteItem);

module.exports = router;
