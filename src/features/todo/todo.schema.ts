import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  notes: z.string().optional(),
});

export const updateTodoSchema = todoSchema.partial();

export type TodoFormData = z.infer<typeof todoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;

export interface Todo {
  _id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}