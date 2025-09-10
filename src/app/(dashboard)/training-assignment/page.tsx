
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { trainingPrograms, workers as allWorkers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { BookCheck, CheckCircle, Clock, Medal } from 'lucide-react';
import type { Worker } from '@/lib/types';


const assignedTrainings = [
    { workerId: 'W001', programId: 'TP001', assignedDate: '2024-07-20', status: 'Completed' },
    { workerId: 'W002', programId: 'TP002', assignedDate: '2024-07-21', status: 'In Progress' },
    { workerId: 'W003', programId: 'TP001', assignedDate: '2024-07-22', status: 'Completed' },
    { workerId: 'W004', programId: 'TP001', assignedDate: '2024-07-23', status: 'Ongoing' },
    { workerId: 'W001', programId: 'TP002', assignedDate: '2024-07-25', status: 'Ongoing' },
];

export default function TrainingAssignmentPage() {
    const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(trainingPrograms[0]?.id);
    const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
    const { toast } = useToast();

    const handleAssign = () => {
        if (!selectedProgramId || selectedWorkerIds.length === 0) {
            toast({
                title: 'Assignment Failed',
                description: 'Please select a program and at least one worker.',
                variant: 'destructive',
            });
            return;
        }
        console.log(`Assigning program ${selectedProgramId} to workers:`, selectedWorkerIds);
        toast({
            title: 'Training Assigned',
            description: `Successfully assigned the selected training to ${selectedWorkerIds.length} worker(s).`,
        });
        setSelectedWorkerIds([]); // Reset selection
    };

    const toggleWorkerSelection = (workerId: string) => {
        setSelectedWorkerIds(prev =>
            prev.includes(workerId)
                ? prev.filter(id => id !== workerId)
                : [...prev, workerId]
        );
    };

    const programProgress = useMemo(() => {
        return trainingPrograms.map(p => ({
            ...p,
            completion: Math.floor(Math.random() * 80) + 20, // Random completion %
        }));
    }, []);

    const trainingLeaderboard = useMemo(() => {
        return allWorkers.slice(0, 5).map(w => ({
            ...w,
            trainingsCompleted: Math.floor(Math.random() * 5) + 1
        })).sort((a,b) => b.trainingsCompleted - a.trainingsCompleted);
    }, []);

    return (
        <>
            <PageHeader
                title="Assign Training &amp; Progress"
                description="Manage training assignments and track completion across your workforce."
            />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Assign Training Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Assign Training Program</CardTitle>
                        <CardDescription>Select a program and the workers to assign it to.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={setSelectedProgramId} defaultValue={selectedProgramId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a training program" />
                            </SelectTrigger>
                            <SelectContent>
                                {trainingPrograms.map(program => (
                                    <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="border rounded-md h-72 overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted">
                                    <TableRow>
                                        <TableHead className="w-12"><Checkbox onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedWorkerIds(allWorkers.map(w => w.workerId));
                                            } else {
                                                setSelectedWorkerIds([]);
                                            }
                                        }}
                                        checked={selectedWorkerIds.length === allWorkers.length && allWorkers.length > 0}
                                        /></TableHead>
                                        <TableHead>Worker</TableHead>
                                        <TableHead>Zone</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allWorkers.map(worker => (
                                        <TableRow key={worker.workerId}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedWorkerIds.includes(worker.workerId)}
                                                    onCheckedChange={() => toggleWorkerSelection(worker.workerId)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{worker.name}</TableCell>
                                            <TableCell>{worker.area}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <Button onClick={handleAssign} className="w-full">
                            Assign to {selectedWorkerIds.length} worker(s)
                        </Button>
                    </CardContent>
                </Card>

                {/* Assigned Trainings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Assignments</CardTitle>
                        <CardDescription>An overview of who is assigned to which training.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md h-[420px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Worker</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignedTrainings.map(assignment => {
                                        const worker = allWorkers.find(w => w.workerId === assignment.workerId);
                                        const program = trainingPrograms.find(p => p.id === assignment.programId);
                                        return (
                                            <TableRow key={`${assignment.workerId}-${assignment.programId}`}>
                                                <TableCell>{worker?.name}</TableCell>
                                                <TableCell>{program?.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={assignment.status === 'Completed' ? 'default' : 'secondary'} className={assignment.status === 'Completed' ? 'bg-green-600' : ''}>
                                                        {assignment.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Tracker Section */}
            <div className="mt-6">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Progress Tracker</h2>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <KpiCard title="Total Assigned" value="150" icon={BookCheck} />
                    <KpiCard title="Ongoing" value="85" icon={Clock} />
                    <KpiCard title="Completed" value="65" icon={CheckCircle} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Program Completion</CardTitle>
                            <CardDescription>Completion percentage for active programs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {programProgress.map(program => (
                                <div key={program.id}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium">{program.name}</span>
                                        <span className="text-sm text-muted-foreground">{program.completion}%</span>
                                    </div>
                                    <Progress value={program.completion} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Training Leaderboard</CardTitle>
                            <CardDescription>Top workers by completed trainings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">Rank</TableHead>
                                        <TableHead>Worker</TableHead>
                                        <TableHead className="text-right">Trainings Completed</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trainingLeaderboard.map((worker, index) => (
                                        <TableRow key={worker.workerId}>
                                            <TableCell className="font-bold text-center">
                                                {index < 3 ? <Medal className={`h-5 w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-yellow-700'}`}/> : index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`https://picsum.photos/seed/${worker.workerId}/40/40`} />
                                                        <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{worker.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">{worker.trainingsCompleted}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
