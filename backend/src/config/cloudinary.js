const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer directly to Cloudinary using stream.
 * @param {Buffer} fileBuffer - File buffer from multer memory storage
 * @param {Object} options - Upload options (folder, resource_type, public_id)
 * @returns {Promise<Object>} Cloudinary upload response object containing secure_url
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'kth_assets',
        resource_type: options.resource_type || 'auto',
        allowed_formats: options.allowed_formats || ['jpg', 'jpeg', 'png', 'webp', 'mp3', 'wav', 'm4a', 'ogg', 'webm'],
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary by public ID.
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - 'image', 'video', or 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('[Cloudinary Delete Error]:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
