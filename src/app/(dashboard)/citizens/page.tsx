
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// In a real application, this data would be fetched from Firestore
const dummyCitizens = [
  { id: 'CZ001', name: 'Aarav Sharma', ward: 'Ward 5', training: 'Completed', dustbin: true, compost: true, avatar: 'https://picsum.photos/seed/citizen1/40/40' },
  { id: 'CZ002', name: 'Diya Gupta', ward: 'Ward 12', training: 'Not Started', dustbin: false, compost: false, avatar: 'https://picsum.photos/seed/citizen2/40/40' },
  { id: 'CZ003', name: 'Rohan Mehra', ward: 'Ward 8', training: 'In Progress', dustbin: true, compost: false, avatar: 'https://picsum.photos/seed/citizen3/40/40' },
  { id: 'CZ004', name: 'Isha Singh', ward: 'Ward 5', training: 'Completed', dustbin: true, compost: true, avatar: 'https://picsum.photos/seed/citizen4/40/40' },
  { id: 'CZ005', name: 'Kabir Kumar', ward: 'Ward 2', training: 'Completed', dustbin: true, compost: false, avatar: 'https://picsum.photos/seed/citizen5/40/40' },
];

export default function CitizensPage() {
  const [citizens] = useState(dummyCitizens);
  const [searchTerm, setSearchTerm] = useState('');
  const [wardFilter, setWardFilter] = useState('all');

  const wards = useMemo(() => {
    const allWards = new Set(citizens.map(c => c.ward));
    return ['all', ...Array.from(allWards)];
  }, [citizens]);

  const filteredCitizens = useMemo(() => {
    return citizens
      .filter(citizen => {
        if (wardFilter === 'all') return true;
        return citizen.ward === wardFilter;
      })
      .filter(citizen => {
        if (!searchTerm) return true;
        return citizen.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [citizens, wardFilter, searchTerm]);

  const getTrainingBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <PageHeader
        title="Citizen Management"
        description="View and manage citizen participation and training."
      />
      <Card>
        <CardHeader>
          <CardTitle>Registered Citizens</CardTitle>
          <CardDescription>A list of all citizens engaged with the program.</CardDescription>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={wardFilter} onValueChange={setWardFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map(ward => (
                    <SelectItem key={ward} value={ward} className="capitalize">
                      {ward === 'all' ? 'All Wards' : ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Training Status</TableHead>
                <TableHead>Dustbin Issued</TableHead>
                <TableHead>Compost Kit Issued</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCitizens.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell className="font-medium">{citizen.name}</TableCell>
                  <TableCell>{citizen.ward}</TableCell>
                  <TableCell>
                    <Badge variant={getTrainingBadgeVariant(citizen.training)} className={citizen.training === 'Completed' ? 'bg-green-600' : ''}>
                      {citizen.training}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {citizen.dustbin ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-destructive" />}
                  </TableCell>
                   <TableCell>
                    {citizen.compost ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-destructive" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredCitizens.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                  No citizens found for the selected filters.
              </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
