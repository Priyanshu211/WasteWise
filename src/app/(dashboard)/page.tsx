
'use client';

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Users,
  PieChart,
  BarChart,
  GraduationCap,
  Building,
  Wrench,
  BarChart3,
} from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
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
import { Badge } from '@/components/ui/badge';
import { complaints, workers, facilities } from '@/lib/data';
import { PageHeader } from '@/components/common/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ComplaintsByMonthChart } from '@/components/dashboard/complaints-by-month-chart';
import { WasteByZoneChart } from '@/components/dashboard/waste-by-zone-chart';
import { TrainingCompletionChart } from '@/components/dashboard/training-completion-chart';
import { FacilityUtilizationChart } from '@/components/dashboard/facility-utilization-chart';
import { useComplaints } from '@/context/ComplaintsContext';
import { useMemo } from 'react';

export default function DashboardPage() {
    const { complaints } = useComplaints();
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    const completedComplaints = complaints.filter(c => c.status === 'Completed').length;
    const activeWorkers = workers.length;

    const facilityCounts = useMemo(() => {
        return facilities.reduce((acc, facility) => {
            if (!acc[facility.type]) {
                acc[facility.type] = 0;
            }
            acc[facility.type]++;
            return acc;
        }, {} as Record<string, number>);
    }, []);

    const maintenanceFacilities = useMemo(() => {
        return facilities.filter(f => f.status === 'Under Maintenance');
    }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Here's a snapshot of the waste management system."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard
          title="Total Complaints"
          value={totalComplaints.toString()}
          icon={AlertCircle}
          change="5.2%"
          changeType="increase"
        />
        <KpiCard
          title="Pending"
          value={pendingComplaints.toString()}
          icon={Activity}
          change="1.2%"
          changeType="decrease"
        />
        <KpiCard
          title="Completed"
          value={completedComplaints.toString()}
          icon={CheckCircle2}
          change="12.1%"
          changeType="increase"
        />
        <KpiCard
          title="Active Workers"
          value={activeWorkers.toString()}
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-6">
        <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/>Complaints Per Month</CardTitle>
                <CardDescription>Historical trend of filed complaints.</CardDescription>
            </CardHeader>
            <CardContent>
                <ComplaintsByMonthChart />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5" />Waste by Zone</CardTitle>
                <CardDescription>Distribution of collected waste across major zones.</CardDescription>
            </CardHeader>
            <CardContent>
                <WasteByZoneChart />
            </CardContent>
        </Card>
      </div>

       <div className="mb-6">
        <Card>
           <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" />Facility Overview</CardTitle>
            <CardDescription>Summary of operational facilities.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <KpiCard
                title="W-to-E Plants"
                value={facilityCounts['W-to-E']?.toString() || '0'}
                icon={Building}
             />
              <KpiCard
                title="Biomethanization"
                value={facilityCounts['Biomethanization']?.toString() || '0'}
                icon={Building}
             />
              <KpiCard
                title="Recycling Centers"
                value={facilityCounts['Recycling Center']?.toString() || '0'}
                icon={Building}
             />
             <KpiCard
                title="Scrap Shops"
                value={facilityCounts['Scrap Shop']?.toString() || '0'}
                icon={Building}
             />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
         <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Facility Capacity</CardTitle>
            <CardDescription>
              Current capacity utilization across active facilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacilityUtilizationChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5" />Facilities Needing Maintenance</CardTitle>
            <CardDescription>
              Facilities currently marked as under maintenance.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceFacilities.length > 0 ? maintenanceFacilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">{facility.name}</TableCell>
                    <TableCell>{facility.type}</TableCell>
                    <TableCell>{facility.address}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No facilities are currently under maintenance.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>
              The latest complaints filed by citizens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.slice(0, 5).map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={complaint.userPhotoUrl} alt="Avatar" />
                          <AvatarFallback>{complaint.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{complaint.userName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{complaint.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          complaint.status === 'Completed'
                            ? 'default'
                            : complaint.status === 'Pending'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={complaint.status === 'Completed' ? 'bg-green-600' : ''}
                      >
                        {complaint.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" />Training Completion</CardTitle>
                <CardDescription>Overview of worker training status.</CardDescription>
            </CardHeader>
            <CardContent>
                <TrainingCompletionChart />
            </CardContent>
        </Card>
      </div>
    </>
  );
}


