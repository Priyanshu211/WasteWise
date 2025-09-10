
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Facility } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const facilitySchema = z.object({
  name: z.string().min(3, { message: 'Facility name must be at least 3 characters.' }),
  type: z.enum(['W-to-E', 'Biomethanization', 'Recycling Center', 'Scrap Shop']),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  capacity: z.string().min(1, { message: 'Capacity is required.' }),
  status: z.enum(['Active', 'Under Maintenance']),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

type AddEditFacilityDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: Facility;
  onSave: (data: FacilityFormValues, id?: string) => void;
};

export function AddEditFacilityDialog({ isOpen, onOpenChange, facility, onSave }: AddEditFacilityDialogProps) {
  const { toast } = useToast();

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: facility || {
      name: '',
      type: 'Recycling Center',
      address: '',
      capacity: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (facility) {
      form.reset(facility);
    } else {
      form.reset({
        name: '',
        type: 'Recycling Center',
        address: '',
        capacity: '',
        status: 'Active',
      });
    }
  }, [facility, form]);

  const onSubmit = (data: FacilityFormValues) => {
    console.log('Form data submitted:', data);

    onSave(data, facility?.id);

    toast({
      title: facility ? 'Facility Updated' : 'Facility Added',
      description: `The details for "${data.name}" have been saved successfully.`,
    });

    onOpenChange(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Simulating image upload:', file.name);
      toast({
        title: 'Image Selected',
        description: `${file.name} is ready for upload. Save the form to proceed.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{facility ? 'Edit Facility' : 'Add New Facility'}</DialogTitle>
          <DialogDescription>
            {facility ? `Update the details for ${facility.name}.` : 'Fill in the details for the new facility.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Okhla W-to-E Plant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a facility type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="W-to-E">W-to-E</SelectItem>
                      <SelectItem value="Biomethanization">Biomethanization</SelectItem>
                      <SelectItem value="Recycling Center">Recycling Center</SelectItem>
                      <SelectItem value="Scrap Shop">Scrap Shop</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address / Zone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Okhla Industrial Area, New Delhi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2000 TPD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Facility Image/Logo</FormLabel>
              <FormControl>
                 <Button asChild variant="outline" className="w-full">
                    <label htmlFor="logo-upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                      <input id="logo-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </Button>
              </FormControl>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
