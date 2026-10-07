import dbService from '../services/dbService.js';
import { sendClaimNotificationEmail } from '../services/emailService.js';

export const createClaim = async (req, res) => {
  try {
    const { itemId, proofDescription, proofImages } = req.body;

    if (!itemId || !proofDescription) {
      return res.status(400).json({ success: false, message: 'Please provide item ID and proof description.' });
    }

    const item = await dbService.findItemById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    const itemOwnerId = item.user?._id || item.user;
    if (String(itemOwnerId) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot submit a claim on your own item listing.' });
    }

    // Check if user already submitted a pending claim on this item
    const existingClaims = await dbService.findClaims({ item: itemId, claimant: req.user._id });
    const pendingClaim = existingClaims.find(c => c.status === 'PENDING');
    if (pendingClaim) {
      return res.status(400).json({ success: false, message: 'You already have a pending claim for this item.' });
    }

    const claim = await dbService.createClaim({
      item: itemId,
      claimant: req.user._id,
      owner: itemOwnerId,
      proofDescription: proofDescription.trim(),
      proofImages: Array.isArray(proofImages) ? proofImages : (proofImages ? [proofImages] : [])
    });

    // Update item status to CLAIM_PENDING if currently OPEN
    if (item.status === 'OPEN') {
      await dbService.updateItem(itemId, { status: 'CLAIM_PENDING' });
    }

    // Create in-app notification for item owner
    await dbService.createNotification({
      user: itemOwnerId,
      title: 'New Ownership Claim Submitted',
      message: `${req.user.name} submitted a claim for "${item.title}". Please verify their proof.`,
      type: 'CLAIM',
      link: '/claims'
    });

    // Send email alert to owner if email exists
    if (item.contactEmail) {
      await sendClaimNotificationEmail(item.contactEmail, item.title, req.user.name);
    }

    await dbService.createActivityLog({
      user: req.user._id,
      action: 'CLAIM_SUBMITTED',
      details: `Claim submitted on item: ${item.title}`,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Claim request submitted successfully! The poster has been notified.',
      claim
    });
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit claim request.' });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const claimsMade = await dbService.findClaims({ claimant: req.user._id });
    const claimsReceived = await dbService.findClaims({ owner: req.user._id });

    res.json({
      success: true,
      claimsMade,
      claimsReceived
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve your claims.' });
  }
};

export const updateClaimStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be ACCEPTED or REJECTED.' });
    }

    const claim = await dbService.findClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found.' });
    }

    const ownerId = claim.owner?._id || claim.owner;
    if (String(ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to decide this claim.' });
    }

    const updated = await dbService.updateClaim(req.params.id, {
      status,
      adminNotes: adminNotes || claim.adminNotes
    });

    const claimantId = claim.claimant?._id || claim.claimant;
    const itemId = claim.item?._id || claim.item;

    if (status === 'ACCEPTED') {
      // Mark item as RESOLVED
      await dbService.updateItem(itemId, { status: 'RESOLVED' });

      // Reward points to finder / resolver (+50 points)
      await dbService.createReward({
        user: ownerId,
        points: 50,
        reason: 'Successfully resolved and returned claimed item to rightful owner',
        item: itemId
      });

      // Notification to claimant
      await dbService.createNotification({
        user: claimantId,
        title: 'Claim Approved! 🎉',
        message: `Your ownership claim has been verified and accepted! Please coordinate recovery.`,
        type: 'CLAIM',
        link: '/claims'
      });
    } else {
      // If rejected and no other pending claims, set back to OPEN
      const allItemClaims = await dbService.findClaims({ item: itemId });
      const stillPending = allItemClaims.some(c => c.status === 'PENDING' && String(c._id) !== String(claim._id));
      if (!stillPending) {
        await dbService.updateItem(itemId, { status: 'OPEN' });
      }

      await dbService.createNotification({
        user: claimantId,
        title: 'Claim Rejected',
        message: `Your claim for "${claim.item?.title || 'the item'}" was declined after review.`,
        type: 'CLAIM',
        link: '/claims'
      });
    }

    res.json({
      success: true,
      message: `Claim has been ${status.toLowerCase()} successfully.`,
      claim: updated
    });
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({ success: false, message: 'Failed to update claim status.' });
  }
};

export const getAllClaimsAdmin = async (req, res) => {
  try {
    const claims = await dbService.findClaims();
    res.json({ success: true, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve all claims.' });
  }
};
