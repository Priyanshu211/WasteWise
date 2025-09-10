
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { facilityUtilization } from '@/lib/data';
import { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  utilization: {
    label: 'Utilization',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function FacilityUtilizationChart() {
  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart 
                data={facilityUtilization}
                margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                accessibilityLayer
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis unit="%" />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Bar 
                    dataKey="utilization" 
                    fill="var(--color-utilization)" 
                    radius={4} 
                />
            </BarChart>
        </ChartContainer>
    </div>
  );
}

