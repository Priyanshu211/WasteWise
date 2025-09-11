
'use client';

import { Pie, PieChart, Tooltip, Legend, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { trainingCompletionRates } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    'Not Started': {
        label: 'Not Started',
        color: 'hsl(var(--chart-5))',
    },
    'In Progress': {
        label: 'In Progress',
        color: 'hsl(var(--chart-3))',
    },
    'Completed': {
        label: 'Completed',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;


export function TrainingCompletionChart() {
  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <PieChart accessibilityLayer>
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                 <Legend content={<ChartLegendContent />} />
                <Pie
                    data={trainingCompletionRates}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                        <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            className="text-xs font-bold"
                        >
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                        );
                    }}
                >
                    {trainingCompletionRates.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    </div>
  );
}
