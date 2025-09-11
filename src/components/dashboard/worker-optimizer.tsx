
'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { optimizeAssignments, OptimizeAssignmentsOutput } from '@/ai/flows/optimize-assignments-flow';
import type { Complaint, Worker } from '@/lib/types';
import { Bot, Check, Loader2 } from 'lucide-react';

type WorkerOptimizerProps = {
  pendingComplaints: Complaint[];
  availableWorkers: Worker[];
  onAssignmentsOptimized: (assignments: OptimizeAssignmentsOutput['assignments']) => void;
};

export function WorkerOptimizer({ pendingComplaints, availableWorkers, onAssignmentsOptimized }: WorkerOptimizerProps) {
  const [isPending, startTransition] = useTransition();
  const [optimizationResult, setOptimizationResult] = useState<OptimizeAssignmentsOutput | null>(null);
  const { toast } = useToast();

  const handleOptimize = () => {
    startTransition(async () => {
      setOptimizationResult(null);
      if (pendingComplaints.length === 0 || availableWorkers.length === 0) {
        toast({
          title: 'Optimization Skipped',
          description: 'There are no pending complaints or available workers.',
          variant: 'destructive',
        });
        return;
      }
      
      try {
        const input = {
          complaints: pendingComplaints.map(({ id, location, wasteCategory }) => ({ id, location, wasteCategory })),
          workers: availableWorkers.map(({ workerId, name, skills, area }) => ({ workerId, name, skills, area })),
        };
        const result = await optimizeAssignments(input);
        setOptimizationResult(result);
        onAssignmentsOptimized(result.assignments);
        toast({
          title: 'Optimization Successful',
          description: 'Assignments have been optimized and applied.',
        });
      } catch (error) {
        console.error('Optimization failed:', error);
        toast({
          title: 'Optimization Failed',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Worker Assignment Optimizer
        </CardTitle>
        <CardDescription>
          Use AI to automatically assign pending complaints to the most suitable available workers based on location and skills.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm p-3 bg-muted rounded-md">
            <span>Pending Complaints: <strong>{pendingComplaints.length}</strong></span>
            <span>Available Workers: <strong>{availableWorkers.length}</strong></span>
          </div>
          <Button onClick={handleOptimize} disabled={isPending || pendingComplaints.length === 0}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Optimizing...' : 'Optimize Assignments'}
          </Button>
          {optimizationResult && (
            <div className="text-sm border p-3 rounded-md bg-green-50 dark:bg-green-950/50">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-600" />
                Optimization Complete
              </h4>
              <p className="text-muted-foreground">{optimizationResult.summary}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
