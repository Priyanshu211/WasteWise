import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck } from 'lucide-react';

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        title="Training"
        description="Track worker training phases and manage materials."
      />
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4">
                <BookOpenCheck className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Training Module Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow you to manage training videos, PDFs, and track completion statistics.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
