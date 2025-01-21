import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';

type Notification = {
  id: string;
  title: string;
  content: string;
  type: string;
  read: boolean;
  created_at: string;
};

export default function NotificationCenter() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const unreadCount = notifications?.filter((n: Notification) => !n.read).length ?? 0;

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-80 bg-white rounded-lg shadow-lg p-4"
          sideOffset={5}
        >
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications?.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {format(new Date(notification.created_at), 'p')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{notification.content}</p>
              </div>
            ))}
            {(!notifications || notifications.length === 0) && (
              <p className="text-center text-gray-500">No notifications</p>
            )}
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
