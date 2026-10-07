import dbService from '../services/dbService.js';

export const createReport = async (req, res) => {
  try {
    const { itemId, targetUserId, reason, details } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason for report is required.' });
    }

    const report = await dbService.createAbuseReport({
      reporter: req.user._id,
      item: itemId || null,
      targetUser: targetUserId || null,
      reason: reason.trim(),
      details: details ? details.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderators will review this promptly.',
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit abuse report.' });
  }
};

export const getReportsAdmin = async (req, res) => {
  try {
    const reports = await dbService.getAllAbuseReports();
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reports.' });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid report status.' });
    }

    const updated = await dbService.updateAbuseReportStatus(req.params.id, status);
    res.json({ success: true, message: 'Report status updated.', report: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update report status.' });
  }
};
