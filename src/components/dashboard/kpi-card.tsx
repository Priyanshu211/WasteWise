import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

type KpiCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'increase' | 'decrease';
};

export function KpiCard({ title, value, icon: Icon, change, changeType }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
              {changeType === 'increase' ? '+' : '-'}
              {change}
            </span>{' '}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
