import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Building, Map, PlusCircle } from 'lucide-react';
import { facilities } from '@/lib/data';
import Image from 'next/image';

export default function FacilitiesPage() {
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Facility List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">{facility.name}</TableCell>
                    <TableCell>{facility.type}</TableCell>
                    <TableCell>{facility.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Facility Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] w-full p-0">
             <Image 
                src="https://picsum.photos/seed/mapview/800/600"
                alt="Map of facilities"
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-b-lg"
                data-ai-hint="city map"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
