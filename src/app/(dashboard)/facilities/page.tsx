
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
import { MoreVertical, PlusCircle, X } from 'lucide-react';
import { facilities as allFacilities } from '@/lib/data';
import type { Facility } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const ITEMS_PER_PAGE = 5;

export default function FacilitiesPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const facilityTypes = useMemo(() => {
    const types = new Set(allFacilities.map(f => f.type));
    return ['all', ...Array.from(types)];
  }, []);

  const filteredFacilities = useMemo(() => {
    // In a real app, filtering would be part of the Firestore query.
    return allFacilities
      .filter(facility => {
        if (typeFilter === 'all') return true;
        return facility.type === typeFilter;
      })
      .filter(facility => {
        if (statusFilter === 'all') return true;
        return facility.status === statusFilter;
      });
  }, [typeFilter, statusFilter]);

  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFacilities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFacilities, currentPage]);

  const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);

  const clearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };
  
  const hasActiveFilters = typeFilter !== 'all' || statusFilter !== 'all';
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      default: return 'destructive';
    }
  };


  return (
    <>
      <PageHeader
        title="Facilities & Resources"
        description="Manage recycling centers, compost plants, and other facilities."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Facility List</CardTitle>
          <CardDescription>A comprehensive list of all operational facilities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Filter by Type */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type..." />
              </SelectTrigger>
              <SelectContent>
                {facilityTypes.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>

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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFacilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell>{facility.type}</TableCell>
                  <TableCell>{facility.address}</TableCell>
                  <TableCell>{facility.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(facility.status)} className={facility.status === 'Active' ? 'bg-green-600' : ''}>
                      {facility.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedFacility(facility)}>
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFacilities.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                  No facilities found for the selected filters.
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
      
      {/* Facility Details Modal */}
      <Dialog open={!!selectedFacility} onOpenChange={(isOpen) => !isOpen && setSelectedFacility(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedFacility?.name}</DialogTitle>
            <DialogDescription>ID: {selectedFacility?.id}</DialogDescription>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-4 py-4 text-sm">
                <div className="relative h-40 w-full rounded-md overflow-hidden bg-muted">
                    {/* In a real app, this image would come from the facility data */}
                    <Image src={`https://picsum.photos/seed/${selectedFacility.id}/600/400`} alt={selectedFacility.name} layout="fill" objectFit="cover" data-ai-hint="industrial building" />
                </div>
                <p><strong>Type:</strong> {selectedFacility.type}</p>
                <p><strong>Address:</strong> {selectedFacility.address}</p>
                <p><strong>Capacity:</strong> {selectedFacility.capacity}</p>
                <p><strong>Status:</strong> {selectedFacility.status}</p>
                <div className="pt-2">
                    <h4 className="font-semibold">Dummy Operational Data</h4>
                    <ul className="list-disc list-inside text-muted-foreground mt-2">
                        <li>Daily Throughput: 450 TPD</li>
                        <li>Energy Generated: 10 MWh</li>
                        <li>Last Maintenance: 2024-05-15</li>
                    </ul>
                </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelectedFacility(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
