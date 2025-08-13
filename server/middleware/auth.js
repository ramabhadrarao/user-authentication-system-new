const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.approved) {
      return res.status(403).json({ message: 'Account not approved' });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({ 
        message: `Access denied. Required permission: ${permission}` 
      });
    }

    next();
  };
};

const requireMasterAdmin = (req, res, next) => {
  if (!req.user || !req.user.isMasterAdmin) {
    return res.status(403).json({ message: 'Master admin access required' });
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
  requireMasterAdmin
};