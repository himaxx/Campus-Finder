import dbConnect from './mongodb';
import Report from '@/models/Report';

export async function getReports(filter = {}) {
  await dbConnect();
  
  // Find reports matching the filter and sort by most recent
  const reports = await Report.find(filter)
    .sort({ createdAt: -1 })
    .lean(); // Use lean() for better performance
  
  // Convert MongoDB _id to id and format dates
  return reports.map((report) => ({
    ...report,
    id: report._id.toString(),
    _id: undefined, // Remove the MongoDB _id
    date: report.date.toISOString().split('T')[0], // Format date
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  }));
}

export async function getReportById(id: string) {
  await dbConnect();
  
  const report = await Report.findById(id).lean();
  
  if (!report) return null;
  
  return {
    ...report,
    id: report._id.toString(),
    _id: undefined,
    date: report.date.toISOString().split('T')[0],
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  };
} 