import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Analytics & Reports"
        description="Generate and export detailed system reports."
      />
       <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4">
                <LineChart className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Advanced Analytics Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will provide deep insights into complaint types, worker efficiency, and environmental impact.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
