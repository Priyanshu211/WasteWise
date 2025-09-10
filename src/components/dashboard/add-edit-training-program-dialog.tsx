
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TrainingProgram } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

// Zod schema for form validation
const programSchema = z.object({
  name: z.string().min(3, { message: 'Program name must be at least 3 characters.' }),
  audience: z.enum(['Workers', 'Citizens']),
  phase: z.string().min(1, { message: 'Phase/Level is required.' }),
  duration: z.string().min(1, { message: 'Duration is required.' }),
  status: z.enum(['Active', 'Upcoming', 'Completed']),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  trainerName: z.string().min(2, { message: 'Trainer name is required.' }),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().min(1, { message: 'End date is required.' }),
});

type ProgramFormValues = z.infer<typeof programSchema>;

type AddEditTrainingProgramDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  program?: TrainingProgram;
  onSave: (data: ProgramFormValues, id?: string) => void;
};

export function AddEditTrainingProgramDialog({ isOpen, onOpenChange, program, onSave }: AddEditTrainingProgramDialogProps) {
  const { toast } = useToast();

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: program || {
      name: '',
      audience: 'Workers',
      phase: '',
      duration: '',
      status: 'Upcoming',
      description: '',
      trainerName: '',
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (program) {
      form.reset(program);
    } else {
      form.reset({
        name: '',
        audience: 'Workers',
        phase: '',
        duration: '',
        status: 'Upcoming',
        description: '',
        trainerName: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [program, form, isOpen]);

  const onSubmit = (data: ProgramFormValues) => {
    console.log('Form data submitted:', data);
    
    onSave(data, program?.id);

    toast({
      title: program ? 'Program Updated' : 'Program Added',
      description: `The details for "${data.name}" have been saved successfully.`,
    });

    onOpenChange(false);
  };

  const handleMaterialUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Simulating material upload:', file.name);
      toast({
        title: 'Material Selected',
        description: `${file.name} is ready for upload. Save the form to finalize.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{program ? 'Edit Training Program' : 'Add New Training Program'}</DialogTitle>
          <DialogDescription>
            {program ? `Update the details for ${program.name}.` : 'Fill in the details for the new program.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Advanced Composting Techniques" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of the training program..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an audience" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Workers">Workers</SelectItem>
                        <SelectItem value="Citizens">Citizens</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phase"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phase / Level</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Phase 2 or Advanced" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 3 days or 2 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="trainerName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Trainer Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Dr. Priya Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
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
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <div className="space-y-2">
              <FormLabel>Training Material (PDF, Video, etc.)</FormLabel>
              <FormControl>
                 <Button asChild variant="outline" className="w-full">
                    <label htmlFor="material-upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Material
                      <input id="material-upload" type="file" className="sr-only" onChange={handleMaterialUpload} />
                    </label>
                  </Button>
              </FormControl>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Program</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
