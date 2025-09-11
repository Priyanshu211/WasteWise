
'use client';
import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, ShieldAlert, Trophy, X, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dummyComplianceData = [
  { id: 'BG001', name: 'Elante Mall', type: 'Commercial', compliance: 95, points: 500, penalties: 0 },
  { id: 'BG002', name: 'DLF IT Park', type: 'Commercial', compliance: 82, points: 250, penalties: 1 },
  { id: 'BG003', name: 'Sector 17 Plaza', type: 'Commercial', compliance: 75, points: 150, penalties: 2 },
  { id: 'BG004', name: 'The Oberoi Sukhvilas', type: 'Hotel', compliance: 98, points: 600, penalties: 0 },
  { id: 'BG005', name: 'Godrej Apartments', type: 'Residential', compliance: 65, points: 50, penalties: 3 },
  { id: 'BG006', name: 'Delhi Public School', type: 'Institutional', compliance: 88, points: 300, penalties: 0 },
  { id: 'BG007', name: 'Taj Hotel, Chandigarh', type: 'Hotel', compliance: 92, points: 450, penalties: 0 },
  { id: 'BG008', name: 'Infosys Campus', type: 'Commercial', compliance: 91, points: 400, penalties: 0 },
  { id: 'BG009', name: 'Max Hospital', type: 'Hospital', compliance: 85, points: 280, penalties: 1 },
  { id: 'BG010', name: 'Phoenix Palassio', type: 'Commercial', compliance: 78, points: 180, penalties: 2 },
  { id: 'BG011', name: 'Hyatt Regency', type: 'Hotel', compliance: 96, points: 550, penalties: 0 },
  { id: 'BG012', name: 'Emaar MGF', type: 'Residential', compliance: 72, points: 100, penalties: 2 },
  { id: 'BG013', name: 'Panjab University', type: 'Institutional', compliance: 89, points: 350, penalties: 0 },
  { id: 'BG014', name: 'Fortis Hospital', type: 'Hospital', compliance: 86, points: 290, penalties: 1 },
  { id: 'BG015', name: 'JW Marriott', type: 'Hotel', compliance: 99, points: 700, penalties: 0 },
  { id: 'BG016', name: 'Select Citywalk', type: 'Commercial', compliance: 93, points: 480, penalties: 0 },
  { id: 'BG017', name: 'Ireo Grand Arch', type: 'Residential', compliance: 80, points: 200, penalties: 1 },
  { id: 'BG018', name: 'Indian School of Business', type: 'Institutional', compliance: 94, points: 520, penalties: 0 },
  { id: 'BG019', name: 'Apollo Hospital', type: 'Hospital', compliance: 88, points: 320, penalties: 1 },
  { id: 'BG020', name: 'Ambience Mall', type: 'Commercial', compliance: 81, points: 220, penalties: 2 },
];

export default function IncentivesPage() {
  const [complianceData, setComplianceData] = useState(dummyComplianceData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  const generatorTypes = useMemo(() => {
    const types = new Set(complianceData.map(c => c.type));
    return ['all', ...Array.from(types)];
  }, [complianceData]);

  const filteredData = useMemo(() => {
    return complianceData
      .filter(item => {
        if (typeFilter === 'all') return true;
        return item.type === typeFilter;
      })
      .filter(item => {
        if (!searchTerm) return true;
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [complianceData, typeFilter, searchTerm]);

  const handleAwardIncentive = (id: string, name: string) => {
    console.log(`Awarding incentive to ${id}`);
    toast({
      title: 'Incentive Awarded',
      description: `Incentive points have been successfully awarded to ${name}.`,
    });
  };

  const handleImposePenalty = (id: string, name: string) => {
    console.log(`Imposing penalty on ${id}`);
    toast({
      title: 'Penalty Imposed',
      description: `A penalty has been marked for ${name}.`,
      variant: 'destructive',
    });
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600 font-bold';
    if (compliance >= 75) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <>
      <PageHeader
        title="Incentives & Penalties"
        description="Manage segregation compliance for bulk generators."
      >
        <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>Monitor compliance, award incentives, and impose penalties.</CardDescription>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {generatorTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type === 'all' ? 'All Types' : type}
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
                <TableHead>Generator Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Compliance</TableHead>
                <TableHead className="text-center">Incentive Points</TableHead>
                <TableHead className="text-center">Penalties</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell className={`text-center ${getComplianceColor(item.compliance)}`}>
                    {item.compliance}%
                  </TableCell>
                  <TableCell className="text-center">{item.points}</TableCell>
                   <TableCell className="text-center">{item.penalties}</TableCell>
                   <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleAwardIncentive(item.id, item.name)}>
                           <Trophy className="mr-2 h-4 w-4" /> Award
                        </Button>
                         <Button variant="destructive" size="sm" onClick={() => handleImposePenalty(item.id, item.name)}>
                           <ShieldAlert className="mr-2 h-4 w-4" /> Penalize
                        </Button>
                    </div>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredData.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                  No matching generators found.
              </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
