
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, Trash2, Edit, CheckCircle, Home, Gift } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import type { Citizen } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';


type CitizenActionsProps = {
  citizen: Citizen;
  onUpdate: (citizen: Citizen) => void;
  onRemove: (citizenId: string) => void;
};

export function CitizenActions({ citizen, onUpdate, onRemove }: CitizenActionsProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedCitizen, setEditedCitizen] = useState(citizen);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedCitizen(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: 'dustbin' | 'compost', checked: boolean) => {
    setEditedCitizen(prev => ({ ...prev, [id]: checked }));
  }

  const handleSaveChanges = () => {
    onUpdate(editedCitizen);
    setIsEditOpen(false);
  };
  
  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                View Details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the
                citizen from the system.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onRemove(citizen.id)} className="bg-destructive hover:bg-destructive/90">
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
     </AlertDialog>


      {/* View Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
             <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={citizen.avatar} alt={citizen.name} />
                    <AvatarFallback>{citizen.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <DialogTitle>{citizen.name}</DialogTitle>
                    <DialogDescription>Citizen ID: {citizen.id}</DialogDescription>
                </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-muted-foreground" />
                <span>Ward: <strong>{citizen.ward}</strong></span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span>Training: <Badge variant={citizen.training === 'Completed' ? 'default' : 'secondary'} className={citizen.training === 'Completed' ? 'bg-green-600' : ''}>{citizen.training}</Badge></span>
            </div>
            <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-muted-foreground" />
                <span>Dustbin Issued: {citizen.dustbin ? 'Yes' : 'No'}</span>
            </div>
             <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-muted-foreground" />
                <span>Compost Kit Issued: {citizen.compost ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsProfileOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Citizen Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Citizen</DialogTitle>
            <DialogDescription>Update the details for {citizen.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={editedCitizen.name} onChange={handleEditChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ward" className="text-right">
                Ward
              </Label>
              <Input id="ward" value={editedCitizen.ward} onChange={handleEditChange} className="col-span-3" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm col-span-4">
              <div className="space-y-0.5">
                <Label htmlFor="dustbin-issued">Dustbin Issued</Label>
              </div>
              <Switch
                id="dustbin"
                checked={editedCitizen.dustbin}
                onCheckedChange={(checked) => handleSwitchChange('dustbin', checked)}
              />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm col-span-4">
              <div className="space-y-0.5">
                <Label htmlFor="compost-kit-issued">Compost Kit Issued</Label>
              </div>
              <Switch
                id="compost"
                checked={editedCitizen.compost}
                onCheckedChange={(checked) => handleSwitchChange('compost', checked)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    