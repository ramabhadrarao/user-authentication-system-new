const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'read', 'update', 'delete'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  module: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create compound index for model and action
permissionSchema.index({ model: 1, action: 1 });

module.exports = mongoose.model('Permission', permissionSchema);