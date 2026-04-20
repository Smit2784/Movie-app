const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');

// Vendor routes (authenticated vendors)
router.post('/suggestions', authenticateToken, suggestionController.createSuggestion);
router.get('/suggestions/me', authenticateToken, suggestionController.getVendorSuggestions);
router.delete('/suggestions/:id', authenticateToken, suggestionController.deleteVendorSuggestion);

// Admin routes
router.get('/admin/suggestions', authenticateToken, authAdmin, suggestionController.getAllSuggestions);
router.put('/admin/suggestions/:id/reply', authenticateToken, authAdmin, suggestionController.replySuggestion);
router.delete('/admin/suggestions/:id', authenticateToken, authAdmin, suggestionController.deleteSuggestion);

module.exports = router;
