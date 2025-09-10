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
import { MoreVertical, PlusCircle, X, Edit, List, Map } from 'lucide-react';
import { facilities as allFacilities } from '@/lib/data';
import type { Facility } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AddEditFacilityDialog } from '@/components/dashboard/add-edit-facility-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ITEMS_PER_PAGE = 5;

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>(allFacilities);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | undefined>(undefined);


  const facilityTypes = useMemo(() => {
    const types = new Set(facilities.map(f => f.type));
    return ['all', ...Array.from(types)];
  }, [facilities]);

  const filteredFacilities = useMemo(() => {
    return facilities
      .filter(facility => {
        if (typeFilter === 'all') return true;
        return facility.type === typeFilter;
      })
      .filter(facility => {
        if (statusFilter === 'all') return true;
        return facility.status === statusFilter;
      });
  }, [facilities, typeFilter, statusFilter]);

  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFacilities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFacilities, currentPage]);

  const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);

  const handleOpenAdd = () => {
    setEditingFacility(undefined);
    setIsAddEditOpen(true);
  };
  
  const handleOpenEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setSelectedFacility(null); // Close the details view
    setIsAddEditOpen(true);
  }

  const handleSaveFacility = (facilityData: Omit<Facility, 'id'>, id?: string) => {
    if (id) {
      // Update existing facility
      setFacilities(facilities.map(f => f.id === id ? { ...f, ...facilityData } : f));
    } else {
      // Add new facility
      const newFacility: Facility = {
        id: `F${Date.now().toString().slice(-4)}`, // Simple unique ID generation
        ...facilityData
      };
      setFacilities([newFacility, ...facilities]);
    }
  };

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
        <Button onClick={handleOpenAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </PageHeader>
      
      <Tabs defaultValue="list">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
            <TabsTrigger value="list"><List className="mr-2 h-4 w-4" />List View</TabsTrigger>
            <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" />Map View</TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
        </div>

        <TabsContent value="list">
            <Card>
                <CardHeader>
                <CardTitle>Facility List</CardTitle>
                <CardDescription>A comprehensive list of all operational facilities.</CardDescription>
                </CardHeader>
                <CardContent>
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
        </TabsContent>
        <TabsContent value="map">
            <Card>
                <CardHeader>
                    <CardTitle>Facilities Map</CardTitle>
                    <CardDescription>Geographical distribution of all facilities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted rounded-lg h-96 flex flex-col items-center justify-center text-center p-8">
                         <div className="mx-auto bg-background rounded-full p-4">
                            <Map className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">Interactive Map Coming Soon</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            This area will display an interactive map with facility locations. Integration with a mapping library like Leaflet or Google Maps is required.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
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
          <DialogFooter className="justify-between">
            <Button variant="outline" onClick={() => handleOpenEdit(selectedFacility!)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
            <Button variant="secondary" onClick={() => setSelectedFacility(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Facility Modal */}
      <AddEditFacilityDialog 
        isOpen={isAddEditOpen} 
        onOpenChange={setIsAddEditOpen}
        facility={editingFacility}
        onSave={handleSaveFacility}
      />
    </>
  );
}
