
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
import { MoreVertical, PlusCircle, X, Edit, List, Map, FileDown } from 'lucide-react';
import { facilities as allFacilities } from '@/lib/data';
import type { Facility } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AddEditFacilityDialog } from '@/components/dashboard/add-edit-facility-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Globe } from '@/components/ui/globe';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>(allFacilities);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | undefined>(undefined);
  const [exportType, setExportType] = useState('all');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');


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
      setFacilities(facilities.map(f => f.id === id ? { ...f, ...facilityData } as Facility : f));
    } else {
      // Add new facility
      const newFacility: Facility = {
        id: `F${Date.now().toString().slice(-4)}`, // Simple unique ID generation
        ...facilityData,
        location: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi for new facilities
      };
      setFacilities([newFacility, ...facilities]);
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting ${exportType} facilities as ${format}`);
    
    toast({
      title: 'Export Started',
      description: `Your export of "${exportType}" facilities as a ${format.toUpperCase()} file has started. You'll be notified when it's ready.`,
    });
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

  const globeConfig = {
    pointSize: 4,
    globeColor: "#1d222d",
    showAtmosphere: true,
    atmosphereColor: "#ffffff",
    atmosphereAltitude: 0.1,
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 20.5937, lng: 78.9629 }, // Center of India
    initialZoom: 1.5,
  };

  const globeData = useMemo(() => {
    return facilities.map(f => ({
        location: [f.location.lat, f.location.lng],
        size: 0.05,
        name: f.name,
    }));
  }, [facilities]);


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
      
      <Tabs defaultValue="list" onValueChange={setActiveTab}>
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

        <div className={cn(activeTab !== 'list' && 'hidden')}>
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
        </div>
        <div className={cn(activeTab !== 'map' && 'hidden')}>
            <Card>
                <CardHeader>
                    <CardTitle>Facilities Map</CardTitle>
                    <CardDescription>Geographical distribution of all facilities across India.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative h-[600px] w-full">
                        <Globe
                            globeConfig={globeConfig}
                            data={globeData}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
      </Tabs>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Export Facility Data</CardTitle>
          <CardDescription>Download a report of facilities based on their type.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Select value={exportType} onValueChange={setExportType}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Select facility type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facility Types</SelectItem>
              <SelectItem value="W-to-E">W-to-E</SelectItem>
              <SelectItem value="Biomethanization">Biomethanization</SelectItem>
              <SelectItem value="Recycling Center">Recycling Center</SelectItem>
              <SelectItem value="Scrap Shop">Scrap Shop</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
          </div>
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
