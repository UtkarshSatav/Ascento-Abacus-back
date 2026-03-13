const cloudinary = require('cloudinary').v2;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadBase64(base64Data, folder = 'school-erp') {
  if (!isCloudinaryConfigured()) {
    throw { status: 500, message: 'Cloudinary is not configured' };
  }

  const result = await cloudinary.uploader.upload(base64Data, { folder });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes
  };
}

async function uploadBuffer(buffer, folder = 'school-erp', options = {}) {
  if (!isCloudinaryConfigured()) {
    throw { status: 500, message: 'Cloudinary is not configured' };
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'raw', ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes
        });
      }
    );
    stream.end(buffer);
  });
}

module.exports = {
  isCloudinaryConfigured,
  uploadBase64,
  uploadBuffer
};
