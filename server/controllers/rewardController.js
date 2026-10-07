import dbService from '../services/dbService.js';

export const getUserRewards = async (req, res) => {
  try {
    const rewards = await dbService.getRewardsForUser(req.user._id);
    const user = await dbService.findUserById(req.user._id);
    res.json({
      success: true,
      totalPoints: user?.rewardPoints || 0,
      rewards
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve rewards.' });
  }
};

export const getAllRewardsAdmin = async (req, res) => {
  try {
    const rewards = await dbService.getAllRewards();
    res.json({ success: true, rewards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reward logs.' });
  }
};

export const awardPoints = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;
    if (!userId || !points || !reason) {
      return res.status(400).json({ success: false, message: 'User ID, points, and reason are required.' });
    }

    const reward = await dbService.createReward({
      user: userId,
      points: Number(points),
      reason: reason.trim()
    });

    await dbService.createNotification({
      user: userId,
      title: 'Bonus Points Awarded! 🌟',
      message: `You were awarded +${points} reward points for: ${reason}`,
      type: 'REWARD',
      link: '/rewards'
    });

    res.status(201).json({
      success: true,
      message: `Successfully awarded ${points} points to user.`,
      reward
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to award points.' });
  }
};
