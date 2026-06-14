const express = require('express');
const router = express.Router();
const companyController = require('../modules/companies/companyController');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.post('/', adminOnly, companyController.createCompany);
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', adminOnly, companyController.updateCompany);
router.delete('/:id', adminOnly, companyController.deleteCompany);

module.exports = router;
