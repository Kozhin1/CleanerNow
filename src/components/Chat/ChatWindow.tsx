import { QueryClient, useQueryClient } from '@tanstack/react-query';

interface ChatWindowProps {
  bookingId: string;
  receiverId: string;
}

export function ChatWindow({ bookingId, receiverId }: ChatWindowProps) {
  const queryClient = useQueryClient();
  
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex flex-col h-[400px]">
        <div className="flex-1 overflow-y-auto mb-4">
          {/* Chat messages will go here */}
          <div className="text-gray-500 text-center">
            Messages for booking {bookingId} with receiver {receiverId}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
