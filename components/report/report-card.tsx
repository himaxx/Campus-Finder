import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReportCardProps {
  report: {
    id: string;
    name: string;
    type: string;
    category: string;
    location: string;
    date: string;
    images: { url: string }[];
  };
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link href={`/reports/${report.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-video relative overflow-hidden">
          {report.images && report.images.length > 0 ? (
            <Image
              src={report.images[0].url}
              alt={report.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image</p>
            </div>
          )}
          <Badge
            className="absolute top-2 right-2"
            variant={report.type === 'lost' ? 'destructive' : 'default'}
          >
            {report.type === 'lost' ? 'Lost' : 'Found'}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">{report.name}</h3>
        </CardHeader>
        
        <CardContent className="space-y-2 pb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Tag className="h-4 w-4 mr-2" />
            <span>{report.category}</span>
          </div>
          
          {report.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{report.location}</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(report.date).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
} 