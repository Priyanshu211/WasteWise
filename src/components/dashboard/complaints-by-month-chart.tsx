
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { complaintsByMonth } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'Complaints',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ComplaintsByMonthChart() {
  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart 
                data={complaintsByMonth}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                accessibilityLayer
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Bar 
                    dataKey="count" 
                    fill="var(--color-count)" 
                    radius={4} 
                />
            </BarChart>
        </ChartContainer>
    </div>
  );
}
