import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileDown, Medal } from 'lucide-react';
import { workers } from '@/lib/data';

export default function LeaderboardPage() {
  const sortedWorkers = [...workers].sort((a, b) => b.tasksCompleted - a.tasksCompleted);

  const getBadge = (rank: number) => {
    if (rank === 0) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-yellow-700" />;
    return <span className="text-sm text-muted-foreground">{rank + 1}</span>;
  };

  return (
    <>
      <PageHeader
        title="Leaderboard"
        description="Recognize top-performing workers and foster healthy competition."
      >
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Ranked by tasks completed this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead className="text-right">Tasks Completed</TableHead>
                <TableHead className="text-right">Performance Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedWorkers.map((worker, index) => (
                <TableRow key={worker.workerId}>
                  <TableCell>
                    <div className="flex items-center justify-center font-bold">
                        {getBadge(index)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell className="text-right">{worker.tasksCompleted}</TableCell>
                  <TableCell className="text-right">{worker.performance}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
