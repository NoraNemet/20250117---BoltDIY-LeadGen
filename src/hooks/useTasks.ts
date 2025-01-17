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

    // Initial fetch
    fetchTasks();

    // Set up real-time subscription
    const subscription = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(current => [...current, payload.new as Task]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(current =>
              current.map(task =>
                task.id === payload.new.id ? { ...task, ...payload.new } : task
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setTasks(current =>
              current.filter(task => task.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskInput: TaskInput) => {
    if (!user) throw new Error('User must be authenticated');

    try {
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

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskInput>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete task');
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refresh: fetchTasks,
  };
}