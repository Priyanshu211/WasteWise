
'use client';

import { Pie, PieChart, Tooltip, Cell, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { wasteByZone } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    'North Delhi': { label: 'North Delhi' },
    'South Delhi': { label: 'South Delhi' },
    'East Delhi': { label: 'East Delhi' },
    'West Delhi': { label: 'West Delhi' },
    'Chandigarh': { label: 'Chandigarh' },
} satisfies ChartConfig;

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6'];


export function WasteByZoneChart() {
  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <PieChart accessibilityLayer>
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Legend content={<ChartLegendContent nameKey="name" />} />
                <Pie
                    data={wasteByZone}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
                    {wasteByZone.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    </div>
  );
}
