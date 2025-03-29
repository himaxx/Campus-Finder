import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  // Convert file to base64 string
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
  
  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(base64String, {
    folder: 'lost-and-found',
  });
  
  return result.secure_url;
} 