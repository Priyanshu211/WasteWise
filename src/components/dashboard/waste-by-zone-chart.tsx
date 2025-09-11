
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
    'North Delhi': { label: 'North Delhi', color: 'hsl(var(--chart-1))' },
    'South Delhi': { label: 'South Delhi', color: 'hsl(var(--chart-2))' },
    'East Delhi': { label: 'East Delhi', color: 'hsl(var(--chart-3))' },
    'West Delhi': { label: 'West Delhi', color: 'hsl(var(--chart-4))' },
    'Chandigarh': { label: 'Chandigarh', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

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
                    {wasteByZone.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    </div>
  );
}
