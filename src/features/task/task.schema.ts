import { z } from 'zod';

const baseTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  type: z.enum(['home', 'work', 'personal', 'other'], {
    required_error: 'Please select a task type',
  }),
  category: z.string().optional(),
  minEndDate: z.date({
    required_error: 'Minimum end date is required',
  }),
  maxEndDate: z.date({
    required_error: 'Maximum end date is required',
  }),
});

export const taskSchema = baseTaskSchema.refine((data) => data.maxEndDate >= data.minEndDate, {
  message: "Maximum end date must be after minimum end date",
  path: ["maxEndDate"],
});

export const updateTaskSchema = baseTaskSchema.partial().refine((data) => {
  if (data.maxEndDate && data.minEndDate) {
    return data.maxEndDate >= data.minEndDate;
  }
  return true;
}, {
  message: "Maximum end date must be after minimum end date",
  path: ["maxEndDate"],
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

export interface Task {
  _id: string;
  title: string;
  type: 'home' | 'work' | 'personal' | 'other';
  category?: string;
  minEndDate: string;
  maxEndDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}