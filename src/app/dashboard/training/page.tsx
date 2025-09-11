
'use client';

import { useState, useMemo } from 'react';
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
import { MoreVertical, PlusCircle, X, Edit, FileDown } from 'lucide-react';
import { trainingPrograms as allPrograms } from '@/lib/data';
import type { TrainingProgram } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AddEditTrainingProgramDialog } from '@/components/dashboard/add-edit-training-program-dialog';
import { format, parseISO } from 'date-fns';

const ITEMS_PER_PAGE = 5;

export default function TrainingPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>(allPrograms);
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | undefined>(undefined);

  const filteredPrograms = useMemo(() => {
    return programs
      .filter(program => {
        if (audienceFilter === 'all') return true;
        return program.audience === audienceFilter;
      })
      .filter(program => {
        if (statusFilter === 'all') return true;
        return program.status === statusFilter;
      });
  }, [programs, audienceFilter, statusFilter]);

  const paginatedPrograms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrograms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPrograms, currentPage]);

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  
  const handleOpenAdd = () => {
    setEditingProgram(undefined);
    setIsAddEditOpen(true);
  };
  
  const handleOpenEdit = (program: TrainingProgram) => {
    setEditingProgram(program);
    setSelectedProgram(null); // Close details modal
    setIsAddEditOpen(true);
  }

  const handleSaveProgram = (programData: Omit<TrainingProgram, 'id' | 'seatsFilled'>, id?: string) => {
    if (id) {
      setPrograms(programs.map(p => p.id === id ? { ...programs.find(p => p.id === id)!, ...programData } : p));
    } else {
      const newProgram: TrainingProgram = {
        id: `TP${Date.now().toString().slice(-4)}`,
        seatsFilled: 0, // Default for new programs
        ...programData
      };
      setPrograms([newProgram, ...programs]);
    }
  };

  const clearFilters = () => {
    setAudienceFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };
  
  const hasActiveFilters = audienceFilter !== 'all' || statusFilter !== 'all';
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Upcoming': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <PageHeader
        title="Training Programs"
        description="Manage all training programs for workers and citizens."
      >
         <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={handleOpenAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </PageHeader>
      
      <Card>
          <CardHeader>
              <CardTitle>All Programs</CardTitle>
              <CardDescription>
                A list of all training programs in the system.
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2 pt-4">
                  <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filter by audience..." />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Audiences</SelectItem>
                      <SelectItem value="Workers">Workers</SelectItem>
                      <SelectItem value="Citizens">Citizens</SelectItem>
                  </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status..." />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters} className="text-destructive hover:text-destructive">
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                  </Button>
                  )}
              </div>
          </CardHeader>
          <CardContent>
          <Table>
              <TableHeader>
              <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Seats Filled</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
              {paginatedPrograms.map((program) => (
                  <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>{program.audience}</TableCell>
                  <TableCell>{program.seatsFilled}</TableCell>
                  <TableCell>{program.trainerName}</TableCell>
                  <TableCell>
                      <Badge variant={getStatusBadgeVariant(program.status)} className={program.status === 'Active' ? 'bg-green-600' : ''}>
                      {program.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedProgram(program)}>
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                      </Button>
                  </TableCell>
                  </TableRow>
              ))}
              </TableBody>
          </Table>

          {filteredPrograms.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                  No programs found for the selected filters.
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
      
      {/* Program Details Modal */}
      <Dialog open={!!selectedProgram} onOpenChange={(isOpen) => !isOpen && setSelectedProgram(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
            <DialogDescription>ID: {selectedProgram?.id}</DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4 py-4 text-sm">
                <p><strong>Audience:</strong> {selectedProgram.audience}</p>
                <p><strong>Phase/Level:</strong> {selectedProgram.phase}</p>
                <p><strong>Duration:</strong> {selectedProgram.duration}</p>
                <p><strong>Status:</strong> {selectedProgram.status}</p>
                <p><strong>Description:</strong> {selectedProgram.description}</p>
                <p><strong>Trainer:</strong> {selectedProgram.trainerName}</p>
                 <p><strong>Seats Filled:</strong> {selectedProgram.seatsFilled}</p>
                <p><strong>Schedule:</strong> {format(parseISO(selectedProgram.startDate), 'PP')} to {format(parseISO(selectedProgram.endDate), 'PP')}</p>
            </div>
          )}
          <DialogFooter className="justify-between">
            <Button variant="outline" onClick={() => handleOpenEdit(selectedProgram!)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
            <Button variant="secondary" onClick={() => setSelectedProgram(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Program Modal */}
      <AddEditTrainingProgramDialog 
        isOpen={isAddEditOpen} 
        onOpenChange={setIsAddEditOpen}
        program={editingProgram}
        onSave={handleSaveProgram}
      />
    </>
  );
}

    