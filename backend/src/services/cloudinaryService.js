/**
 * Cloudinary Service
 * Helper functions for video/audio management
 */
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Delete a resource from Cloudinary
 */
const deleteResource = async (publicId, resourceType = 'video') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return null;
  }
};

/**
 * Generate a signed URL for private video playback
 */
const getSignedUrl = (publicId, expiresInSeconds = 3600) => {
  const timestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return cloudinary.url(publicId, {
    resource_type: 'video',
    sign_url: true,
    type: 'authenticated',
    expires_at: timestamp,
  });
};

/**
 * Upload a buffer directly to Cloudinary
 */
const uploadBuffer = (buffer, folder = 'skillfit-ai/interviews') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'video' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Extract audio from a Cloudinary video using transformations
 */
const extractAudioUrl = (videoPublicId) => {
  return cloudinary.url(videoPublicId, {
    resource_type: 'video',
    format: 'mp3',
    flags: 'attachment',
  });
};

module.exports = { cloudinary, deleteResource, getSignedUrl, uploadBuffer, extractAudioUrl };
