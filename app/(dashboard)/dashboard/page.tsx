'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodos } from '@/src/hooks/useTodos';
import { useTasks } from '@/src/hooks/useTasks';
import { CheckCircle, Circle, ListTodo, Target } from 'lucide-react';

export default function DashboardPage() {
  const { data: todos = [], isLoading: todosLoading } = useTodos();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();

  const completedTodos = todos.filter(todo => todo.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Todos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTodos}</div>
            <p className="text-xs text-muted-foreground">
              {todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

           {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Todos</CardTitle>
          </CardHeader>
          <CardContent>
            {todosLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : todos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No todos yet</p>
            ) : (
              <ul className="space-y-2">
                {todos.slice(0, 5).map((todo) => (
                  <li key={todo._id} className="flex items-center space-x-2">
                    {todo.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet</p>
            ) : (
              <ul className="space-y-2">
                {tasks
                  .filter(task => !task.completed)
                  .slice(0, 5)
                  .map((task) => (
                    <li key={task._id} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{task.title}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {task.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.maxEndDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}