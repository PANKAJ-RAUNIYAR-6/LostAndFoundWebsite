import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('[CloudinaryService] Configured for cloud:', process.env.CLOUDINARY_CLOUD_NAME);
}

export const uploadToCloudinary = async (fileBuffer, mimetype, filename = 'item') => {
  if (isCloudinaryConfigured) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'findit_lost_found', resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              public_id: result.public_id
            });
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (err) {
      console.warn('[CloudinaryService] Cloud upload failed, falling back to data URL:', err.message);
    }
  }

  // Fast reliable fallback: Data URL
  const base64 = fileBuffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64}`;
  return {
    url: dataUrl,
    public_id: `local_${Date.now()}_${filename.replace(/\s+/g, '_')}`
  };
};

export const isCloudinaryActive = () => isCloudinaryConfigured;
