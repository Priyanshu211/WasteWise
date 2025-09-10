
'use client';

import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { trainingCompletionByAudience } from '@/lib/data';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

export function TrainingCompletionByAudienceChart() {
  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={{}} className="min-h-[200px] w-full">
            <PieChart>
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={trainingCompletionByAudience}
                    dataKey="completed"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
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
                    {trainingCompletionByAudience.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    </div>
  );
}
