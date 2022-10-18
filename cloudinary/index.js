const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CN_CLOUD_NAME,
  api_key: process.env.CN_KEY,
  api_secret: process.env.CN_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PhotoSpots',
    allowedFormats: ['jpeg', 'jpg', 'png']
  }
});

module.exports = {
  cloudinary,
  storage
}