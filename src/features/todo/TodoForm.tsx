'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


import { TodoFormData, todoSchema } from './todo.schema';
import { useCreateTodo } from '@/src/hooks/useTodos';

interface TodoFormProps {
  onSuccess?: () => void;
}

export function TodoForm({ onSuccess }: TodoFormProps) {
  const createTodo = useCreateTodo();

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      notes: '',
    },
  });

  const onSubmit = async (data: TodoFormData) => {
    await createTodo.mutateAsync(data);
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter todo title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add some notes..." 
                  className="resize-none" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={createTodo.isPending}>
          {createTodo.isPending ? 'Creating...' : 'Create Todo'}
        </Button>
      </form>
    </Form>
  );
}