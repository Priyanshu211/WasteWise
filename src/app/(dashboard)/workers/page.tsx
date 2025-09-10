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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { workers } from '@/lib/data';
import { WorkerOptimizer } from '@/components/dashboard/worker-optimizer';

export default function WorkersPage() {
  const getTrainingBadgeVariant = (phase: string) => {
    switch (phase) {
      case 'Completed':
        return 'default';
      case 'Phase 2':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <PageHeader
        title="Worker Management"
        description="Manage worker profiles, track training, and view performance."
      >
        <WorkerOptimizer />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Worker Roster</CardTitle>
          <CardDescription>A list of all active workers in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Area</TableHead>
                <TableHead>Training</TableHead>
                <TableHead className="hidden md:table-cell">Tasks Completed</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.workerId}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{worker.area}</TableCell>
                  <TableCell>
                    <Badge variant={getTrainingBadgeVariant(worker.trainingPhase)}>
                      {worker.trainingPhase}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{worker.tasksCompleted}</TableCell>
                  <TableCell>{worker.performance}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
