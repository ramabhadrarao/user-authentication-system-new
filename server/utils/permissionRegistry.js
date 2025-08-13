const Permission = require('../models/Permission');

const modulePermissions = [
  // User Management
  {
    name: 'user:create',
    model: 'user',
    action: 'create',
    description: 'Create new users',
    module: 'User Management'
  },
  {
    name: 'user:read',
    model: 'user',
    action: 'read',
    description: 'View users',
    module: 'User Management'
  },
  {
    name: 'user:update',
    model: 'user',
    action: 'update',
    description: 'Update user information',
    module: 'User Management'
  },
  {
    name: 'user:delete',
    model: 'user',
    action: 'delete',
    description: 'Delete users',
    module: 'User Management'
  },

  // Product Management
  {
    name: 'product:create',
    model: 'product',
    action: 'create',
    description: 'Create new products',
    module: 'Product Management'
  },
  {
    name: 'product:read',
    model: 'product',
    action: 'read',
    description: 'View products',
    module: 'Product Management'
  },
  {
    name: 'product:update',
    model: 'product',
    action: 'update',
    description: 'Update product information',
    module: 'Product Management'
  },
  {
    name: 'product:delete',
    model: 'product',
    action: 'delete',
    description: 'Delete products',
    module: 'Product Management'
  },

  // Permission Management
  {
    name: 'permission:read',
    model: 'permission',
    action: 'read',
    description: 'View permissions',
    module: 'Permission Management'
  },

  // Dashboard
  {
    name: 'dashboard:read',
    model: 'dashboard',
    action: 'read',
    description: 'View dashboard',
    module: 'Dashboard'
  }
];

const registerModulePermissions = async () => {
  try {
    for (const permissionData of modulePermissions) {
      await Permission.findOneAndUpdate(
        { name: permissionData.name },
        permissionData,
        { upsert: true, new: true }
      );
    }
    console.log('Module permissions registered successfully');
  } catch (error) {
    console.error('Error registering permissions:', error);
  }
};

module.exports = {
  registerModulePermissions
};