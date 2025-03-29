import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';

export async function POST(request: Request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse request body
    const data = await request.json();
    
    // Create new report
    const newReport = new Report({
      type: data.type,
      category: data.category,
      name: data.name,
      description: data.description,
      location: data.location,
      landmark: data.landmark,
      latitude: data.latitude,
      longitude: data.longitude,
      date: new Date(data.date),
      contactMethod: data.contactMethod,
      contactInfo: data.contactMethod !== 'inapp' ? data.contactInfo : null,
      // Map images to the format expected by our schema
      images: data.imageUrls ? data.imageUrls.map((url: string) => ({ url })) : [],
      // If you have authentication:
      // userId: session?.user?.id,
    });
    
    // Save to database
    await newReport.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Report created successfully',
      reportId: newReport._id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create report' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get query parameters (for filtering)
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    
    // Build filter object
    const filter: any = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    
    // Fetch reports
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform for client
    const transformedReports = reports.map(report => ({
      ...report,
      id: report._id.toString(),
      _id: undefined,
    }));
    
    return NextResponse.json({ reports: transformedReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
} 