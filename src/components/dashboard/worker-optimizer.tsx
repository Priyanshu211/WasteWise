'use client';

import { useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { optimizeWorkerAssignments, OptimizeWorkerAssignmentsOutput } from '@/ai/flows/optimize-worker-assignments';
import { workers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export function WorkerOptimizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<OptimizeWorkerAssignmentsOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a work order description.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const availableWorkers = workers.map(w => ({
          workerId: w.workerId,
          location: w.area,
          skills: w.skills,
          pastPerformance: w.performance,
      }));

      const response = await optimizeWorkerAssignments({
        workOrderDescription: description,
        availableWorkers: availableWorkers,
      });

      setResult(response);
    } catch (error) {
      console.error('Error optimizing assignments:', error);
      toast({
        title: 'Optimization Failed',
        description: 'Could not get suggestions from the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Optimize Assignments
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Worker Assignment Optimizer
          </DialogTitle>
          <DialogDescription>
            Describe the work order and let AI suggest the most efficient worker assignments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Work Order Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., 'Large pile of mixed construction debris at Sector 17 plaza, requires heavy lifting and hazardous material handling.'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
             <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Suggested Assignments</h3>
            <div className="h-[240px] overflow-y-auto space-y-4 pr-2">
              {isLoading && (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              )}
              {!isLoading && !result && (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  AI suggestions will appear here.
                </div>
              )}
              {result && result.suggestedAssignments.map(assignment => {
                 const worker = workers.find(w => w.workerId === assignment.workerId);
                 return (
                    <Card key={assignment.workerId} className="shadow-sm">
                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base">
                                {worker?.name || assignment.workerId}
                            </CardTitle>
                             <Badge className={getConfidenceColor(assignment.confidenceScore)}>
                                {`Confidence: ${(assignment.confidenceScore * 100).toFixed(0)}%`}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                           <p>{assignment.reasoning}</p>
                        </CardContent>
                    </Card>
                 )
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
