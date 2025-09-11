
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BookOpenCheck,
  Building,
  FileText,
  LayoutDashboard,
  LineChart,
  Search,
  Settings,
  Trash2,
  Trophy,
  Users,
  PanelLeft,
  ClipboardList,
  Package,
  ShieldAlert,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useComplaints } from '@/context/ComplaintsContext';

function DashboardNav() {
  const pathname = usePathname();
  const { complaints } = useComplaints();
  const isActive = (href: string) => pathname.startsWith(href) && (href !== '/' || pathname === '/');
  const pendingComplaintsCount = complaints.filter(c => c.status === 'Pending').length;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/complaints', label: 'Complaints', icon: FileText, badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : undefined },
    { href: '/citizens', label: 'Citizens', icon: Users },
    { href: '/workers', label: 'Waste Workers', icon: Users },
    { href: '/facilities', label: 'Facilities', icon: Building },
    { href: '/reports', label: 'Reports', icon: LineChart },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/training', label: 'Training', icon: BookOpenCheck },
    { href: '/incentives', label: 'Incentives & Penalties', icon: ShieldAlert },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
  
  const trainingSubNav = [
    { href: '/training', label: 'Programs' },
    { href: '/training-assignment', label: 'Assignment' },
    { href: '/training-analytics', label: 'Analytics' },
  ];

  return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Trash2 className="w-7 h-7 text-primary" />
            <span className="text-xl font-semibold font-headline">WasteWise</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
               <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto">{item.badge}</Badge>
                    )}
                  </SidebarMenuButton>
                </Link>
                {item.href === '/training' && pathname.startsWith('/training') && (
                    <SidebarMenuSub>
                       {trainingSubNav.map(subItem => (
                         <SidebarMenuSubItem key={subItem.label}>
                            <Link href={subItem.href}>
                                <SidebarMenuSubButton isActive={pathname === subItem.href}>
                                    {subItem.label}
                                </SidebarMenuSubButton>
                            </Link>
                         </SidebarMenuSubItem>
                       ))}
                    </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <DashboardNav />
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden"/>
            <div className="w-full flex-1">
                <form>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                    />
                </div>
                </form>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/admin-avatar/40/40" alt="Admin" />
                    <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Super Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/login">
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </Link>
                </DropdownMenuContent>
            </DropdownMenu>
            </header>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
