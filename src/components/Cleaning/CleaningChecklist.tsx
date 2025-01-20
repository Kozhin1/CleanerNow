import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CheckSquare, Square, Plus, Trash } from 'lucide-react';

type ChecklistProps = {
  bookingId: string;
  isCleaner: boolean;
};

type ChecklistItem = {
  id: string;
  task: string;
  completed: boolean;
};

export default function CleaningChecklist({ bookingId, isCleaner }: ChecklistProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = React.useState('');

  const { data: checklist } = useQuery({
    queryKey: ['checklist', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cleaning_checklists')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (error) throw error;
      return {
        items: data.items as ChecklistItem[],
        completedItems: data.completed_items as ChecklistItem[],
      };
    },
  });

  const updateChecklist = useMutation({
    mutationFn: async (items: ChecklistItem[]) => {
      const { error } = await supabase
        .from('cleaning_checklists')
        .upsert({
          booking_id: bookingId,
          items: items.filter(item => !item.completed),
          completed_items: items.filter(item => item.completed),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist', bookingId] });
    },
  });

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const items = [
      ...(checklist?.items || []),
      {
        id: crypto.randomUUID(),
        task: newTask,
        completed: false,
      },
    ];

    updateChecklist.mutate(items);
    setNewTask('');
  };

  const handleToggleTask = (itemId: string) => {
    const allItems = [...(checklist?.items || []), ...(checklist?.completedItems || [])];
    const updatedItems = allItems.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    updateChecklist.mutate(updatedItems);
  };

  const handleDeleteTask = (itemId: string) => {
    const allItems = [...(checklist?.items || []), ...(checklist?.completedItems || [])];
    const updatedItems = allItems.filter(item => item.id !== itemId);

    updateChecklist.mutate(updatedItems);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Cleaning Checklist</h3>

      {isCleaner && (
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 rounded-md border-gray-300"
            placeholder="Add new task..."
          />
          <button
            onClick={handleAddTask}
            className="p-2 bg-primary text-white rounded-md hover:bg-primary-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">To Do</h4>
          {checklist?.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => isCleaner && handleToggleTask(item.id)}
                  disabled={!isCleaner}
                >
                  <Square className="h-5 w-5 text-gray-400" />
                </button>
                <span>{item.task}</span>
              </div>
              {isCleaner && (
                <button
                  onClick={() => handleDeleteTask(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Completed</h4>
          {checklist?.completedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-gray-500">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => isCleaner && handleToggleTask(item.id)}
                  disabled={!isCleaner}
                >
                  <CheckSquare className="h-5 w-5 text-green-500" />
                </button>
                <span className="line-through">{item.task}</span>
              </div>
              {isCleaner && (
                <button
                  onClick={() => handleDeleteTask(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}