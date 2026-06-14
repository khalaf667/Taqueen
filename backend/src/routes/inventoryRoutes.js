const express = require('express');
const router = express.Router();
const inventoryController = require('../modules/inventory/inventoryController');
const { adminOnly } = require('../middlewares/roleMiddleware');

// Ingredients
router.post('/ingredients', adminOnly, inventoryController.createIngredient);
router.get('/ingredients', inventoryController.getAllIngredients);
router.get('/ingredients/:id', inventoryController.getIngredientById);
router.put('/ingredients/:id', adminOnly, inventoryController.updateIngredient);
router.delete('/ingredients/:id', adminOnly, inventoryController.deleteIngredient);

// Stock Movements
router.post('/movements', inventoryController.createMovement);
router.get('/movements', inventoryController.getAllMovements);

module.exports = router;
