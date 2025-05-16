
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Chat } from "@/types";
import { cn } from "@/lib/utils";

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  userId: string;
}

const ChatList = ({ chats, activeChat, onSelectChat, userId }: ChatListProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getNameInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <Card className="h-[600px] overflow-hidden">
      <div className="overflow-y-auto h-full">
        {chats.length > 0 ? (
          <div>
            {chats.map(chat => {
              // Get the other participant
              const otherParticipantId = chat.participants.find(id => id !== userId);
              // This would normally come from a users database
              const otherName = otherParticipantId ? `User ${otherParticipantId.slice(0, 4)}` : "Unknown";
              
              return (
                <div 
                  key={chat.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-gray-50",
                    activeChat === chat.id && "bg-gray-100"
                  )}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getNameInitials(otherName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{otherName}</h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessageTimestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-500">No conversations yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatList;
