const User = require('../models/User');

const createMasterAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ isMasterAdmin: true });
    
    if (!existingAdmin) {
      const masterAdmin = new User({
        username: 'admin',
        email: 'admin@system.com',
        passwordHash: 'admin123', // This will be hashed by the pre-save hook
        firstName: 'System',
        lastName: 'Administrator',
        isMasterAdmin: true,
        approved: true,
        permissions: [] // Master admin bypasses permission checks
      });

      await masterAdmin.save();
      console.log('Master admin created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('Please change the default password after first login!');
    }
  } catch (error) {
    console.error('Error creating master admin:', error);
  }
};

module.exports = {
  createMasterAdmin
};