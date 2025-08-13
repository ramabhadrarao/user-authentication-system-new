const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, authorize, requireMasterAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/profiles';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all users (master admin only)
router.get('/', authenticate, requireMasterAdmin, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-passwordHash -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get user profile
router.get('/profile', authenticate, (req, res) => {
  const userProfile = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    profilePhotoUrl: req.user.profilePhotoUrl,
    permissions: req.user.permissions,
    isMasterAdmin: req.user.isMasterAdmin,
    approved: req.user.approved,
    createdAt: req.user.createdAt,
    lastLogin: req.user.lastLogin,
    displayName: req.user.getDisplayName()
  };

  res.json({ user: userProfile });
});

// Update user profile
router.put('/profile', authenticate, [
  body('firstName').optional().trim().escape().isLength({ max: 50 }),
  body('lastName').optional().trim().escape().isLength({ max: 50 }),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email } = req.body;
    const user = await User.findById(req.user._id);

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    await user.save();

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
      permissions: user.permissions,
      isMasterAdmin: user.isMasterAdmin,
      approved: user.approved,
      displayName: user.getDisplayName()
    };

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// Upload profile photo
router.post('/profile/photo', authenticate, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    const user = await User.findById(req.user._id);
    
    // Delete old photo if it exists
    if (user.profilePhotoUrl) {
      const oldPhotoPath = path.join(__dirname, '..', user.profilePhotoUrl);
      try {
        await fs.unlink(oldPhotoPath);
      } catch (error) {
        // Ignore error if file doesn't exist
      }
    }

    const photoUrl = `/uploads/profiles/${req.file.filename}`;
    user.profilePhotoUrl = photoUrl;
    await user.save();

    res.json({ 
      message: 'Photo uploaded successfully', 
      profilePhotoUrl: photoUrl 
    });
  } catch (error) {
    res.status(500).json({ message: 'Photo upload failed', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password change failed', error: error.message });
  }
});

// Approve user (master admin only)
router.put('/:userId/approve', authenticate, requireMasterAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.approved = true;
    await user.save();

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'User approval failed', error: error.message });
  }
});

// Update user permissions (master admin only)
router.put('/:userId/permissions', authenticate, requireMasterAdmin, [
  body('permissions').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { permissions } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isMasterAdmin) {
      return res.status(400).json({ message: 'Cannot modify master admin permissions' });
    }

    user.permissions = permissions;
    await user.save();

    res.json({ message: 'Permissions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Permission update failed', error: error.message });
  }
});

module.exports = router;