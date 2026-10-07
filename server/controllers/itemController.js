import dbService from '../services/dbService.js';

export const getItems = async (req, res) => {
  try {
    const { type, category, status, search, date, page = 1, limit = 12 } = req.query;

    const filters = {};
    if (type) filters.type = type.toUpperCase();
    if (category) filters.category = category;
    if (status) filters.status = status.toUpperCase();
    if (search) filters.search = search;
    if (date) filters.date = date;

    const result = await dbService.findItems(filters, {
      page: Number(page),
      limit: Number(limit)
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve items.' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await dbService.findItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }
    res.json({ success: true, item });
  } catch (error) {
    console.error('Get item by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve item details.' });
  }
};

export const createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      images,
      date,
      location,
      latitude,
      longitude,
      contactPhone,
      contactEmail,
      tags
    } = req.body;

    if (!type || !title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type (LOST/FOUND), title, description, category, and location.'
      });
    }

    const coordinates = {
      latitude: Number(latitude) || 28.6139,
      longitude: Number(longitude) || 77.2090
    };

    const newItem = await dbService.createItem({
      type: type.toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      category,
      images: Array.isArray(images) ? images : (images ? [images] : []),
      date: date || new Date().toISOString().split('T')[0],
      location: location.trim(),
      coordinates,
      user: req.user._id,
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email || '',
      tags: Array.isArray(tags) ? tags : []
    });

    // Reward for active reporting
    const pointsAwarded = type.toUpperCase() === 'FOUND' ? 25 : 10;
    await dbService.createReward({
      user: req.user._id,
      points: pointsAwarded,
      reason: `Reported a ${type.toLowerCase()} item: "${title}"`,
      item: newItem._id
    });

    // Activity log
    await dbService.createActivityLog({
      user: req.user._id,
      action: `${type.toUpperCase()}_ITEM_REPORTED`,
      details: `Reported: ${title}`,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: `${type === 'LOST' ? 'Lost' : 'Found'} item reported successfully! You earned +${pointsAwarded} reward points.`,
      item: newItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ success: false, message: 'Failed to create item.' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const existing = await dbService.findItemById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    const itemUserId = existing.user?._id || existing.user;
    if (String(itemUserId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this item.' });
    }

    const {
      title,
      description,
      category,
      images,
      date,
      location,
      latitude,
      longitude,
      status,
      contactPhone,
      contactEmail
    } = req.body;

    const updates = {};
    if (title) updates.title = title.trim();
    if (description) updates.description = description.trim();
    if (category) updates.category = category;
    if (images) updates.images = Array.isArray(images) ? images : [images];
    if (date) updates.date = date;
    if (location) updates.location = location;
    if (status) updates.status = status;
    if (contactPhone !== undefined) updates.contactPhone = contactPhone;
    if (contactEmail !== undefined) updates.contactEmail = contactEmail;
    if (latitude !== undefined && longitude !== undefined) {
      updates.coordinates = { latitude: Number(latitude), longitude: Number(longitude) };
    }

    const updated = await dbService.updateItem(req.params.id, updates);

    res.json({
      success: true,
      message: 'Item updated successfully.',
      item: updated
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ success: false, message: 'Failed to update item.' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const existing = await dbService.findItemById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    const itemUserId = existing.user?._id || existing.user;
    if (String(itemUserId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this item.' });
    }

    await dbService.deleteItem(req.params.id);

    await dbService.createActivityLog({
      user: req.user._id,
      action: 'ITEM_DELETED',
      details: `Deleted item: ${existing.title}`,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Item removed successfully.'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item.' });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const { type } = req.query;
    const filters = { user: req.user._id };
    if (type) filters.type = type.toUpperCase();

    const result = await dbService.findItems(filters, { page: 1, limit: 100 });
    res.json({ success: true, items: result.items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve your items.' });
  }
};
