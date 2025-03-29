import { getReports } from '@/lib/getReports';
import { ReportCard } from '@/components/report/report-card';

export default async function DashboardPage() {
  // Fetch reports from MongoDB
  const reports = await getReports();
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
        
        {reports.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-10">
            No reports found. Be the first to report a lost or found item!
          </p>
        )}
      </div>
    </div>
  );
} 