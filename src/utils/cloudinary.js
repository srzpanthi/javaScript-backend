import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    console.log('File has been successfully uploaded on Cloudinary:', response.url);

    // Always remove the local file after the upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);

    // Ensure the local file is removed in case of an error
    fs.unlinkSync(localFilePath);

    return null;
  }
};

export { uploadOnCloudinary };
