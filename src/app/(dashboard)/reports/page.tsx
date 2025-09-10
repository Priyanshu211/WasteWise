
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
import { CalendarIcon, Globe, MoreVertical, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { complaints as allComplaints } from '@/lib/data';
import type { Complaint } from '@/lib/types';
import Image from 'next/image';

const ITEMS_PER_PAGE = 10;

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // In a real application, filtering would be done via Firestore queries.
  // Example Firestore query:
  // let query = collection(db, 'complaints');
  // if (statusFilter !== 'all') {
  //   query = query.where('status', '==', statusFilter);
  // }
  // if (dateRange?.from && dateRange?.to) {
  //   query = query.where('createdAt', '>=', dateRange.from).where('createdAt', '<=', dateRange.to);
  // }
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
      <Card>
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
                  <TableCell className="font-mono">{complaint.id}</TableCell>
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

          {/* Pagination */}
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
        </CardContent>
      </Card>

      {/* Details Modal */}
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
    </>
  );
}
