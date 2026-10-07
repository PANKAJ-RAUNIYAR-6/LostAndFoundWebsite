import dbService from '../services/dbService.js';

export const getStats = async (req, res) => {
  try {
    const stats = await dbService.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats.' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await dbService.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { isBlocked, role, isVerified } = req.body;
    const updates = {};
    if (isBlocked !== undefined) updates.isBlocked = isBlocked;
    if (role !== undefined) updates.role = role;
    if (isVerified !== undefined) updates.isVerified = isVerified;

    const user = await dbService.updateUser(req.params.id, updates);
    res.json({ success: true, message: 'User updated successfully.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await dbService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await dbService.getActivityLogs(50);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve activity logs.' });
  }
};
