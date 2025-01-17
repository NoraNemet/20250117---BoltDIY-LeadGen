import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to: string | null;
  related_to_type: string | null;
  related_to_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  due_date?: string;
  priority: Task['priority'];
  status: Task['status'];
  assigned_to?: string;
  related_to_type?: string;
  related_to_id?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchTasks();

    // Real-time subscription with batching
    const subscription = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        handleRealTimeUpdates
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleRealTimeUpdates = (() => {
    let updateQueue: any[] = [];
    let timeout: NodeJS.Timeout | null = null;

    const processQueue = () => {
      const updates = [...updateQueue];
      updateQueue = [];
      updates.forEach((payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks((current) => [...current, payload.new as Task]);
        } else if (payload.eventType === 'UPDATE') {
          setTasks((current) =>
            current.map((task) =>
              task.id === payload.new.id ? { ...task, ...payload.new } : task
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setTasks((current) => current.filter((task) => task.id !== payload.old.id));
        }
      });
    };

    return (payload: any) => {
      updateQueue.push(payload);
      if (!timeout) {
        timeout = setTimeout(() => {
          processQueue();
          timeout = null;
        }, 500); // Process in batches every 500ms
      }
    };
  })();

  const fetchTasks = async (filters: Partial<TaskInput> = {}) => {
    try {
      setLoading(true);
      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.assigned_to) query = query.eq('assigned_to', filters.assigned_to);

      const { data, error } = await query;
      if (error) throw error;

      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? `Error fetching tasks: ${err.message}` : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskInput: TaskInput) => {
    if (!user) throw new Error('User must be authenticated');

    // Add input validation
    if (!taskInput.title.trim()) {
      throw new Error('Task title is required');
    }

    const tempTask: Task = {
      ...taskInput,
      id: `temp-${Date.now()}`,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Task;

    // Optimistic UI update
    setTasks((current) => [tempTask, ...current]);

    try {
      console.log('Creating task with payload:', {
        ...taskInput,
        created_by: user.id,
      });

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...taskInput,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Task created successfully:', data);
      setTasks((current) => current.map((task) => (task.id === tempTask.id ? data : task)));
      return data;
    } catch (err) {
      console.error('Failed to create task:', err);
      // Rollback optimistic update
      setTasks((current) => current.filter((task) => task.id !== tempTask.id));
      throw err instanceof Error 
        ? new Error(`Error creating task: ${err.message}`) 
        : new Error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskInput>) => {
    try {
      setTasks((current) =>
        current.map((task) =>
          task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
        )
      );

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? new Error(`Error updating task with ID ${id}: ${err.message}`) : new Error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    const tempTasks = tasks;
    setTasks((current) => current.filter((task) => task.id !== id));

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      setTasks(tempTasks);
      throw err instanceof Error ? new Error(`Error deleting task with ID ${id}: ${err.message}`) : new Error('Failed to delete task');
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
}
