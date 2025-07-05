'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { taskSchema, TaskFormData } from './task.schema';
import { useCreateTask } from '@/src/hooks/useTasks';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onSuccess?: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const createTask = useCreateTask();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      type: 'work',
      category: '',
      minEndDate: new Date(),
      maxEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (!isValid) return;
    
    const data = form.getValues();
    await createTask.mutateAsync(data);
    form.reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter task title"
          {...form.register('title')}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={form.watch('type')}
            onValueChange={(value) => form.setValue('type', value as any)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category (Optional)</Label>
          <Input
            id="category"
            placeholder="e.g., Development, Shopping"
            {...form.register('category')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Minimum End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !form.watch('minEndDate') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch('minEndDate') ? (
                  format(form.watch('minEndDate'), 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch('minEndDate')}
                onSelect={(date) => date && form.setValue('minEndDate', date)}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.minEndDate && (
            <p className="text-sm text-red-500">{form.formState.errors.minEndDate.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Maximum End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !form.watch('maxEndDate') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch('maxEndDate') ? (
                  format(form.watch('maxEndDate'), 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch('maxEndDate')}
                onSelect={(date) => date && form.setValue('maxEndDate', date)}
                disabled={(date) => {
                  const minDate = form.watch('minEndDate');
                  return date < minDate;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.maxEndDate && (
            <p className="text-sm text-red-500">{form.formState.errors.maxEndDate.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={createTask.isPending}>
        {createTask.isPending ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  );
}