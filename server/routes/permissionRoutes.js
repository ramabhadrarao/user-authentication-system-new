const express = require('express');
const Permission = require('../models/Permission');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all permissions
router.get('/', authenticate, authorize('permission:read'), async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ module: 1, model: 1, action: 1 });
    res.json({ permissions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch permissions', error: error.message });
  }
});

// Get permissions grouped by module
router.get('/by-module', authenticate, authorize('permission:read'), async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ module: 1, model: 1, action: 1 });
    
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {});

    res.json({ permissions: grouped });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch permissions', error: error.message });
  }
});

module.exports = router;