const cloudinary = require('../config/cloudinary');

const uploadImage = async (filePath) => {
    // Check for placeholder credentials and use mock mode
    if (process.env.CLOUDINARY_API_KEY === 'your_api_key' || !process.env.CLOUDINARY_API_KEY) {
        console.warn('⚠️  Cloudinary: Using Local Storage Fallback.');
        const filename = filePath.split(/[\\/]/).pop();
        const port = process.env.PORT || 5000;
        return {
            url: `http://localhost:${port}/uploads/${filename}`,
            publicId: 'local_' + Date.now()
        };
    }

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'lost-and-found',
            resource_type: 'auto'
        });
        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        throw new Error('Cloudinary upload failed: ' + error.message);
    }
};

const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error('Cloudinary deletion failed: ' + error.message);
    }
};

module.exports = { uploadImage, deleteImage };
