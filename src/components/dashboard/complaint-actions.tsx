
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, Calendar, Tag, MapPin, Globe } from 'lucide-react';
import type { Complaint, Worker } from '@/lib/types';
import { workers } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Image from 'next/image';


type ComplaintActionsProps = {
  complaint: Complaint;
  onUpdate: (complaint: Complaint) => void;
};

export function ComplaintActions({ complaint, onUpdate }: ComplaintActionsProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(complaint.assignedWorker || '');

  const handleMarkAsCompleted = () => {
    onUpdate({ ...complaint, status: 'Completed' });
  };
  
  const handleUnmark = () => {
    onUpdate({ ...complaint, status: 'In Progress' });
  }

  const handleAssignWorker = () => {
    if (selectedWorkerId) {
      onUpdate({ ...complaint, assignedWorker: selectedWorkerId, status: 'In Progress' });
    }
    setIsAssignOpen(false);
  };
  
  const assignedWorker = workers.find(w => w.workerId === complaint.assignedWorker);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setIsDetailsOpen(true)}>View Details</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsAssignOpen(true)}>Assign Worker</DropdownMenuItem>
          <DropdownMenuSeparator />
          {complaint.status !== 'Completed' ? (
            <DropdownMenuItem onClick={handleMarkAsCompleted}>Mark as Completed</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleUnmark}>Unmark as Completed</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>ID: {complaint.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
             <div className="relative h-48 w-full rounded-md overflow-hidden">
                <Image src={complaint.imageUrl} alt="Complaint Image" layout="fill" objectFit="cover" data-ai-hint="waste picture" />
             </div>
             <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{complaint.userName}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{complaint.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{format(parseISO(complaint.createdAt), 'PPp')}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span>{complaint.wasteCategory}</span>
                </div>
                {complaint.locationCoords && (
                     <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${complaint.locationCoords.lat},${complaint.locationCoords.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {complaint.locationCoords.lat}, {complaint.locationCoords.lng}
                        </a>
                    </div>
                )}
                {assignedWorker && (
                    <div className="flex items-center gap-2 col-span-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>Assigned to: <strong>{assignedWorker.name}</strong></span>
                    </div>
                )}
             </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Worker Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Worker</DialogTitle>
            <DialogDescription>Select a worker to assign to this complaint.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select onValueChange={setSelectedWorkerId} defaultValue={selectedWorkerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a worker" />
              </SelectTrigger>
              <SelectContent>
                {workers.map(worker => (
                  <SelectItem key={worker.workerId} value={worker.workerId}>
                    <div className="flex items-center gap-2">
                      <span>{worker.name}</span>
                      <span className="text-xs text-muted-foreground">({worker.area})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignWorker} disabled={!selectedWorkerId}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
