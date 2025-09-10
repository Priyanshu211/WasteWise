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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { complaints } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ComplaintsPage() {
    
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'default';
            case 'In Progress':
                return 'secondary';
            default:
                return 'destructive';
        }
    }
    
  return (
    <>
      <PageHeader
        title="Complaints"
        description="View, manage, and assign all citizen complaints."
      >
        <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>All Complaints</CardTitle>
            <CardDescription>A complete list of all registered complaints.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map(complaint => (
                <TableRow key={complaint.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Avatar className='w-12 h-12 rounded-md'>
                            <AvatarImage
                                src={complaint.imageUrl}
                                alt="Complaint image"
                                className='object-cover'
                            />
                            <AvatarFallback>IMG</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                               <AvatarImage src={complaint.userPhotoUrl} />
                               <AvatarFallback>{complaint.userName.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div>
                            <div>{complaint.userName}</div>
                            <div className="text-sm text-muted-foreground">{complaint.location}</div>
                           </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(complaint.status)} className={complaint.status === 'Completed' ? 'bg-green-600' : ''}>{complaint.status}</Badge>
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{complaint.wasteCategory}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {format(parseISO(complaint.createdAt), 'PPp')}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Assign Worker</DropdownMenuItem>
                                <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
