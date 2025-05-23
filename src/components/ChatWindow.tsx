
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Languages } from "lucide-react";
import { mockChats, mockChatMessages } from "@/data/mockData";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface ChatWindowProps {
  userId: string;
  onBack: () => void;
}

const ChatWindow = ({ userId, onBack }: ChatWindowProps) => {
  const { chatId } = useParams<{ chatId: string }>();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [translating, setTranslating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get chat details
  const chat = mockChats.find(chat => chat.id === chatId);
  
  // Get other participant details
  const otherParticipantId = chat?.participants.find(id => id !== userId);
  const otherName = otherParticipantId 
    ? `User ${otherParticipantId.slice(0, 4)}` 
    : "Unknown";
  
  // Load messages when chat changes
  useEffect(() => {
    if (chatId && mockChatMessages[chatId]) {
      setMessages(mockChatMessages[chatId]);
    } else {
      setMessages([]);
    }
  }, [chatId]);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !chatId || !userId) return;
    
    // Create new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      receiverId: otherParticipantId || "",
      message: message.trim(),
      timestamp: new Date().toISOString(),
      itemId,
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMessage]);
    
    // Clear input
    setMessage("");
  };
  
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
  
  const handleTranslate = (language: string) => {
    setTranslating(true);
    
    // Simulate translation (in a real app, this would call a translation API)
    setTimeout(() => {
      toast({
        title: "Messages translated",
        description: `All messages have been translated to ${language}`,
      });
      setTranslating(false);
    }, 1000);
  };
  
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b p-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getNameInitials(otherName)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{otherName}</h2>
            {itemId && <p className="text-xs text-gray-500">About item #{itemId.slice(0, 8)}</p>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map(msg => {
              const isOwnMessage = msg.senderId === userId;
              return (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex",
                    isOwnMessage ? "justify-end" : "justify-start"
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      isOwnMessage 
                        ? "bg-found-green text-white rounded-br-none" 
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    )}
                  >
                    <p>{msg.message}</p>
                    <p className={cn(
                      "text-xs mt-1", 
                      isOwnMessage ? "text-green-50" : "text-gray-500"
                    )}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </CardContent>
      
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(translating && "animate-pulse")}
              >
                <Languages size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleTranslate("English")}>
                Translate to English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate("French")}>
                Translate to French
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate("Arabic")}>
                Translate to Arabic
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTranslate("Spanish")}>
                Translate to Spanish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            type="submit"
            className="bg-found-green hover:bg-found-green/90"
            disabled={!message.trim() || translating}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatWindow;
