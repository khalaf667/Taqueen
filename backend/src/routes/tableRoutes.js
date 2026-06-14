const express = require('express');
const router = express.Router();
const tableController = require('../modules/tables/tableController');

router.post('/', tableController.createTable);
router.get('/', tableController.getAllTables);
router.get('/:id', tableController.getTableById);
router.put('/:id', tableController.updateTable);
router.put('/:id/status', tableController.updateTableStatus);
router.delete('/:id', tableController.deleteTable);

module.exports = router;
