import dbService from '../services/dbService.js';

export const createFeedback = async (req, res) => {
  try {
    const { rating, comment, targetType } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating (1-5) and comment are required.' });
    }

    const feedback = await dbService.createFeedback({
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
      targetType: targetType || 'PLATFORM'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit feedback.' });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await dbService.getAllFeedbacks();
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve feedback.' });
  }
};
