import { NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/uploadImage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No file provided' 
      }, { status: 400 });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadImageToCloudinary(file);

    return NextResponse.json({ 
      success: true, 
      url: imageUrl 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to upload image' 
    }, { status: 500 });
  }
} 