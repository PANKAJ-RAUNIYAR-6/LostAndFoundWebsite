import dbService from '../services/dbService.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await dbService.getAllCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const category = await dbService.createCategory({
      name: name.trim(),
      icon: icon || 'HelpCircle',
      description: description ? description.trim() : ''
    });

    res.status(201).json({ success: true, message: 'Category created.', category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await dbService.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
};
