
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
    },
    'In Progress': {
        label: 'In Progress',
    },
    'Completed': {
        label: 'Completed',
    },
} satisfies ChartConfig;

const COLORS = ['#ef4444', '#f97316', '#22c55e'];


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
                    {trainingCompletionRates.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    </div>
  );
}
