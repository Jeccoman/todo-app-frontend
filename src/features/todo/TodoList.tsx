'use client';

import { useState } from 'react';
import { Check, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToggleTodo, useDeleteTodo } from '@/src/hooks/useTodos';
import { Todo } from './todo.schema';
import { TodoEditDialog } from './TodoEditDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TodoListProps {
  todos: Todo[];
}

export function TodoList({ todos }: TodoListProps) {
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const handleToggle = (id: string) => {
    toggleTodo.mutate(id);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteTodo.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 group"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => handleToggle(todo._id)}
              className="h-5 w-5"
            />
            <div className="flex-1">
              <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h4>
              {todo.notes && (
                <p className="text-sm text-gray-600 mt-1">{todo.notes}</p>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditTodo(todo)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(todo._id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <TodoEditDialog 
        todo={editTodo} 
        open={!!editTodo} 
        onOpenChange={(open) => !open && setEditTodo(null)} 
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this todo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}