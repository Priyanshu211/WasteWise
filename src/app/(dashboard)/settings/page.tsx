
'use client';

import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileDown, MoreVertical, Upload } from 'lucide-react';
import { useEffect } from 'react';

// Sample data for user management
const admins = [
  { id: 'admin1', name: 'Super Admin', email: 'admin@wastewise.com', role: 'Super Admin', avatar: 'https://picsum.photos/seed/admin-avatar/40/40' },
  { id: 'admin2', name: 'Ravi Kumar', email: 'ravi.k@wastewise.com', role: 'Regional Admin (Delhi)', avatar: 'https://picsum.photos/seed/admin2/40/40' },
  { id: 'admin3', name: 'Priya Singh', email: 'priya.s@wastewise.com', role: 'Regional Admin (Chandigarh)', avatar: 'https://picsum.photos/seed/admin3/40/40' },
];

export default function SettingsPage() {
  
  useEffect(() => {
    // On mount, check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') || 'system';
    handleThemeChange(savedTheme as 'light' | 'dark' | 'system');
  }, []);


  // In a real application, these handlers would interact with a backend/Firebase.
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading file:', file.name);
      // TODO: Implement Firebase Storage upload logic here.
      // 1. Get a reference to Firebase Storage.
      // 2. Create a storage reference (e.g., 'organization/logo.png').
      // 3. Upload the file using `uploadBytes`.
      // 4. Get the download URL using `getDownloadURL`.
      // 5. Save the URL to Firestore in the organization settings document.
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    // TODO: Save theme preference to localStorage and/or Firestore for persistence.
    localStorage.setItem('theme', theme);
  };

  const handleExport = (dataType: 'complaints' | 'workers' | 'leaderboard', format: 'csv' | 'pdf') => {
    console.log(`Exporting ${dataType} as ${format}`);
    // TODO: Implement Cloud Function trigger here.
    // This would typically involve making an HTTPS call to a Cloud Function endpoint,
    // which would then generate the file and provide a download link.
  };

  return (
    <>
      <PageHeader
        title="Settings & Profile"
        description="Manage your profile and configure system rules."
      />
      <Tabs defaultValue="organization">
        <TabsList className="mb-4">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
        </TabsList>

        {/* Organization Settings */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Update your organization's name, logo, and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Firestore Security Rule Comment: Only users with 'Super Admin' role should be able to write to '/settings/organization'. */}
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="WasteWise" />
              </div>
              <div className="space-y-2">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://picsum.photos/seed/org-logo/128/128" alt="Organization Logo" />
                    <AvatarFallback>WW</AvatarFallback>
                  </Avatar>
                  <Button asChild variant="outline">
                    <label htmlFor="logo-upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                      <input id="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                    </label>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-info">Contact Info</Label>
                <Input id="contact-info" placeholder="e.g., contact@wastewise.com, +1234567890" />
              </div>
               <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User & Role Management */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>User & Role Management</CardTitle>
                    <CardDescription>Manage admin access and roles within the system.</CardDescription>
                </div>
                <Button>Add New Admin</Button>
            </CardHeader>
            <CardContent>
              {/* Firestore Security Rule Comment: Reading users should be restricted to admins. Updating/deleting users restricted to 'Super Admin'. */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={admin.avatar} />
                            <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{admin.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.role}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose which events trigger push notifications for admins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Firestore Security Rule Comment: Users should only be able to update their own notification settings document (e.g., /users/{userId}/settings). */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="new-complaint" className="text-base">New Complaint Created</Label>
                  <p className="text-sm text-muted-foreground">Notify when a citizen files a new complaint.</p>
                </div>
                <Switch id="new-complaint" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="task-assigned" className="text-base">Task Assigned to Worker</Label>
                  <p className="text-sm text-muted-foreground">Notify when a complaint is assigned to a worker.</p>
                </div>
                <Switch id="task-assigned" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                 <div className="space-y-0.5">
                    <Label htmlFor="training-reminder" className="text-base">Worker Training Reminder</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for upcoming training deadlines.</p>
                 </div>
                <Switch id="training-reminder" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Preferences */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the look and feel of the admin panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Firestore Security Rule Comment: Users should only be able to write to their own theme preference field in their user document. */}
              <p className="font-medium">Appearance</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleThemeChange('light')}>Light</Button>
                <Button variant="outline" onClick={() => handleThemeChange('dark')}>Dark</Button>
                <Button variant="outline" onClick={() => handleThemeChange('system')}>System</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Export */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export system data as CSV or PDF.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Firestore Security Rule Comment: Triggering exports should be restricted to users with 'Super Admin' role. */}
              <div className="flex flex-wrap items-center justify-between rounded-lg border p-4">
                <p className="font-medium">All Complaints</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleExport('complaints', 'csv')}>
                    <FileDown className="mr-2 h-4 w-4" /> CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('complaints', 'pdf')}>
                    <FileDown className="mr-2 h-4 w-4" /> PDF
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg border p-4">
                <p className="font-medium">All Workers</p>
                <div className="flex gap-2">
                   <Button variant="outline" onClick={() => handleExport('workers', 'csv')}>
                    <FileDown className="mr-2 h-4 w-4" /> CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('workers', 'pdf')}>
                    <FileDown className="mr-2 h-4 w-4" /> PDF
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg border p-4">
                <p className="font-medium">Leaderboard Data</p>
                 <div className="flex gap-2">
                   <Button variant="outline" onClick={() => handleExport('leaderboard', 'csv')}>
                    <FileDown className="mr-2 h-4 w-4" /> CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('leaderboard', 'pdf')}>
                    <FileDown className="mr-2 h-4 w-4" /> PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
