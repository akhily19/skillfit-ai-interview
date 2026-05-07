const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage for interview videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skillfit-ai/interviews',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov', 'avi'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  }
});

// Cloudinary storage for audio files
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skillfit-ai/audio',
    resource_type: 'video', // Cloudinary uses 'video' for audio too
    allowed_formats: ['mp3', 'wav', 'webm', 'ogg']
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'];

  if ([...allowedVideoTypes, ...allowedAudioTypes].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

const uploadAudio = multer({
  storage: audioStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

module.exports = { cloudinary, uploadVideo, uploadAudio };
