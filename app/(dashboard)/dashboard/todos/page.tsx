'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TodoList } from '@/src/features/todo/TodoList';
import { TodoForm } from '@/src/features/todo/TodoForm';
import { useTodos } from '@/src/hooks/useTodos';

export default function TodosPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: todos = [], isLoading } = useTodos();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Todos</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Todo</DialogTitle>
              <DialogDescription>
                Add a new todo item to your list. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <TodoForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No todos yet. Create your first todo!
            </p>
          ) : (
            <TodoList todos={todos} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}