'use client';

import { useState } from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskList } from '@/src/features/task/TaskList';
import { TaskForm } from '@/src/features/task/TaskForm';
import { useTasks } from '@/src/hooks/useTasks';

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();

  const { data: tasks = [], isLoading } = useTasks({
    type: typeFilter,
    completed: statusFilter,
  });

  

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={statusFilter === undefined ? 'all' : statusFilter.toString()} 
          onValueChange={(value) => {
            if (value === 'all') setStatusFilter(undefined);
            else setStatusFilter(value === 'true');
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="false">Incomplete</SelectItem>
            <SelectItem value="true">Completed</SelectItem>
          </SelectContent>
        </Select>

        {(typeFilter || statusFilter !== undefined) && (
          <Button
            variant="ghost"
            onClick={() => {
              setTypeFilter(undefined);
              setStatusFilter(undefined);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {typeFilter || statusFilter !== undefined
                ? 'No tasks found with selected filters.'
                : 'No tasks yet. Create your first task!'}
            </p>
          ) : (
            <TaskList tasks={tasks} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}