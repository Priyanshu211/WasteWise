
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { trainingParticipationByMonth } from '@/lib/data';
import { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  workers: {
    label: 'Workers',
    color: 'hsl(var(--chart-1))',
  },
  citizens: {
    label: 'Citizens',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function TrainingParticipationChart() {
  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart 
                data={trainingParticipationByMonth}
                margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
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
                    content={<ChartTooltipContent indicator="dot" />}
                />
                 <Legend content={<ChartLegendContent />} />
                <Bar 
                    dataKey="workers" 
                    fill="var(--color-workers)" 
                    radius={[4, 4, 0, 0]}
                />
                <Bar 
                    dataKey="citizens" 
                    fill="var(--color-citizens)" 
                     radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ChartContainer>
    </div>
  );
}
