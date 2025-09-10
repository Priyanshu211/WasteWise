'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { complaintsByDay } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  Completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-1))',
  },
  Pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  'In Progress': {
    label: 'In Progress',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function ComplaintsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Analytics</CardTitle>
        <CardDescription>Trends for the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={complaintsByDay} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
             <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Completed" fill="var(--color-Completed)" radius={4} />
            <Bar dataKey="Pending" fill="var(--color-Pending)" radius={4} />
            <Bar dataKey="In Progress" fill="var(--color-In Progress)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
