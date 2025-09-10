'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { workers as initialWorkers } from '@/lib/data';
import { WorkerOptimizer } from '@/components/dashboard/worker-optimizer';
import { WorkerActions } from '@/components/dashboard/worker-actions';
import type { Worker } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  
  useEffect(() => {
    setWorkers(initialWorkers.map(w => ({
        ...w,
        safetyGearIssued: Math.random() > 0.5,
        attendance: Math.floor(Math.random() * 11) + 90, // 90-100%
        status: Math.random() > 0.2 ? 'On-Duty' : 'Off-Duty',
    })));
  }, []);

  const handleUpdateWorker = (updatedWorker: Worker) => {
    setWorkers(prevWorkers => 
      prevWorkers.map(w => w.workerId === updatedWorker.workerId ? updatedWorker : w)
    );
  };

  const handleRemoveWorker = (workerId: string) => {
    setWorkers(prevWorkers => prevWorkers.filter(w => w.workerId !== workerId));
  };


  return (
    <>
      <PageHeader
        title="Waste Worker Management"
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
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Training Completion</TableHead>
                <TableHead>Safety Gear</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.workerId}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>{worker.area}</TableCell>
                   <TableCell>
                    <Badge variant={worker.status === 'On-Duty' ? 'default' : 'outline'} className={worker.status === 'On-Duty' ? 'bg-green-600' : ''}>
                      {worker.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={worker.performance} className="w-24 h-2" />
                        <span className="text-xs text-muted-foreground">{worker.performance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {worker.safetyGearIssued ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-destructive" />}
                  </TableCell>
                  <TableCell>{worker.attendance}%</TableCell>
                  <TableCell>
                    <WorkerActions 
                        worker={worker} 
                        onUpdate={handleUpdateWorker}
                        onRemove={handleRemoveWorker}
                    />
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
