import { uploadToCloudinary } from '../services/cloudinaryService.js';

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      // Check single file req.file
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
        return res.json({ success: true, url: result.url, public_id: result.public_id });
      }
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, file.mimetype, file.originalname)
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(r => r.url);

    res.json({
      success: true,
      urls,
      images: results
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed.' });
  }
};
