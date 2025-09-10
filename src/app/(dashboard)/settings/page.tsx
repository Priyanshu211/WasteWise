import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings & Profile"
        description="Manage your profile and configure system rules."
      />
       <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4">
                <SettingsIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">System Settings Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow for admin profile management and configuration of incentive/penalty rules.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
