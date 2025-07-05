'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { todoSchema, TodoFormData, Todo } from './todo.schema';
import { useUpdateTodo } from '@/src/hooks/useTodos';

interface TodoEditDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TodoEditDialog({ todo, open, onOpenChange }: TodoEditDialogProps) {
  const updateTodo = useUpdateTodo();

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo?.title || '',
      notes: todo?.notes || '',
    },
  });

  // Reset form when todo changes
  if (todo && form.getValues('title') !== todo.title) {
    form.reset({
      title: todo.title,
      notes: todo.notes || '',
    });
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;
    
    const isValid = await form.trigger();
    if (!isValid) return;
    
    const data = form.getValues();
    await updateTodo.mutateAsync({ id: todo._id, data });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter todo title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...form.register('notes')}
                placeholder="Add some notes..."
                className="resize-none"
                rows={3}
              />
              {form.formState.errors.notes && (
                <p className="text-sm text-red-500">{form.formState.errors.notes.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updateTodo.isPending}>
              {updateTodo.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}