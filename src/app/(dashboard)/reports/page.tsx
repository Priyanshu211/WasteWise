
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Globe, MoreVertical, X, ChevronsUpDown, ArrowUp, ArrowDown, History } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { complaints as allComplaints, workers as allWorkers, trainingProgress as allTrainingProgress } from '@/lib/data';
import type { Complaint, Worker, TrainingProgress } from '@/lib/types';
import Image from 'next/image';

const ITEMS_PER_PAGE = 10;
type SortKey = 'name' | 'tasksCompleted' | 'performance';
type SortDirection = 'asc' | 'desc';

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [sortBy, setSortBy] = useState<SortKey>('performance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredComplaints = useMemo(() => {
    return allComplaints
      .filter((complaint) => {
        if (statusFilter === 'all') return true;
        return complaint.status === statusFilter;
      })
      .filter((complaint) => {
        if (!dateRange || (!dateRange.from && !dateRange.to)) return true;
        const complaintDate = parseISO(complaint.createdAt);
        const interval = {
            start: dateRange.from ? startOfDay(dateRange.from) : new Date(0),
            end: dateRange.to ? endOfDay(dateRange.to) : new Date(),
        }
        return isWithinInterval(complaintDate, interval);
      });
  }, [statusFilter, dateRange]);

  const paginatedComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredComplaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredComplaints, currentPage]);

  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);

  const sortedWorkers = useMemo(() => {
    return [...allWorkers].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortBy, sortDirection]);

  const filteredTrainingProgress = useMemo(() => {
    if (moduleFilter === 'all') return allTrainingProgress;
    return allTrainingProgress.filter(p => p.module === moduleFilter);
  }, [moduleFilter]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortBy !== key) return <ChevronsUpDown className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUp className="h-4 w-4" />;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'destructive';
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateRange(undefined);
    setCurrentPage(1);
  };
  
  const hasActiveFilters = statusFilter !== 'all' || !!dateRange;

  return (
    <>
      <PageHeader
        title="Analytics & Reports"
        description="Generate and export detailed system reports."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="xl:col-span-2">
            <CardHeader>
            <CardTitle>Complaints Report</CardTitle>
            <CardDescription>Filter and view all complaints in the system.</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
                </Select>

                <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                        <>
                            {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                        </>
                        ) : (
                        format(dateRange.from, 'LLL dd, y')
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    />
                </PopoverContent>
                </Popover>
                
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="text-destructive hover:text-destructive">
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {paginatedComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                    <TableCell className="font-mono">{complaint.id.slice(0, 6)}...</TableCell>
                    <TableCell className="font-medium">{complaint.userName}</TableCell>
                    <TableCell>
                        <a
                        href={`https://www.google.com/maps/search/?api=1&query=${complaint.locationCoords.lat},${complaint.locationCoords.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:underline"
                        >
                        <Globe className="h-4 w-4" />
                        {complaint.location}
                        </a>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(complaint.status)} className={complaint.status === 'Completed' ? 'bg-green-600' : ''}>
                        {complaint.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{format(parseISO(complaint.createdAt), 'PP')}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedComplaint(complaint)}>
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {filteredComplaints.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No complaints found for the selected filters.
                </div>
            )}
            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    >
                    Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    >
                    Next
                    </Button>
                </div>
            )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Worker Performance Report</CardTitle>
                <CardDescription>View and sort worker performance data.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                           <TableHead>
                             <Button variant="ghost" onClick={() => handleSort('name')}>
                                Name {getSortIcon('name')}
                             </Button>
                           </TableHead>
                           <TableHead>
                             <Button variant="ghost" onClick={() => handleSort('tasksCompleted')}>
                                Tasks Completed {getSortIcon('tasksCompleted')}
                             </Button>
                           </TableHead>
                           <TableHead>
                             <Button variant="ghost" onClick={() => handleSort('performance')}>
                                Performance Score {getSortIcon('performance')}
                             </Button>
                           </TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedWorkers.map(worker => (
                            <TableRow key={worker.workerId}>
                                <TableCell className="font-medium">{worker.name}</TableCell>
                                <TableCell>{worker.tasksCompleted}</TableCell>
                                <TableCell>{worker.performance}%</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedWorker(worker)}>
                                        <History className="h-4 w-4" />
                                        <span className='sr-only'>View History</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Training Progress Report</CardTitle>
                <CardDescription>Monitor worker training completion and activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Select value={moduleFilter} onValueChange={setModuleFilter}>
                        <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Filter by module..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Modules</SelectItem>
                            <SelectItem value="Hazardous Waste 101">Hazardous Waste 101</SelectItem>
                            <SelectItem value="Advanced Composting">Advanced Composting</SelectItem>
                            <SelectItem value="Heavy Machinery Ops">Heavy Machinery Ops</SelectItem>
                            <SelectItem value="Safety Procedures">Safety Procedures</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Worker</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Completion</TableHead>
                            <TableHead className="text-right">Last Accessed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTrainingProgress.map(item => (
                            <TableRow key={item.workerId + item.module}>
                                <TableCell className="font-medium">{item.workerName}</TableCell>
                                <TableCell>{item.module}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={item.completion} className="w-24 h-2" />
                                        <span className="text-xs text-muted-foreground">{item.completion}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{format(parseISO(item.lastAccessed), 'PP')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </div>

      {/* Complaint Details Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={(isOpen) => !isOpen && setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>ID: {selectedComplaint?.id}</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="relative h-60 w-full rounded-md overflow-hidden">
                <Image src={selectedComplaint.imageUrl} alt="Complaint Image" layout="fill" objectFit="cover" data-ai-hint="waste picture" />
              </div>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <p><strong>User:</strong> {selectedComplaint.userName}</p>
                <p><strong>Location:</strong> {selectedComplaint.location}</p>
                <p><strong>Date:</strong> {format(parseISO(selectedComplaint.createdAt), 'PPp')}</p>
                <p><strong>Category:</strong> {selectedComplaint.wasteCategory}</p>
                <p><strong>Status:</strong> {selectedComplaint.status}</p>
                <p><strong>Assigned Worker:</strong> {selectedComplaint.assignedWorker || 'N/A'}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Worker History Modal */}
      <Dialog open={!!selectedWorker} onOpenChange={(isOpen) => !isOpen && setSelectedWorker(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Work History: {selectedWorker?.name}</DialogTitle>
                <DialogDescription>
                    A summary of recent tasks and performance metrics.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <p><strong>Total Tasks Completed:</strong> {selectedWorker?.tasksCompleted}</p>
                <p><strong>Average Performance Score:</strong> {selectedWorker?.performance}%</p>
                <h4 className="font-semibold">Recent Activity (Dummy Data)</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                    <li>Completed task #C012 - Mixed waste pickup.</li>
                    <li>Completed task #C008 - Organic waste at India Gate.</li>
                    <li>Assigned to new task #C023 - Mixed waste at Agrasen ki Baoli.</li>
                    <li>Received positive feedback for quick resolution.</li>
                </ul>
            </div>
             <DialogFooter>
                <Button variant="secondary" onClick={() => setSelectedWorker(null)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
