
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { mockChats, mockChatMessages } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

const Chat = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Effect to load messages when active chat changes
  useEffect(() => {
    if (activeChat && mockChatMessages[activeChat]) {
      setMessages(mockChatMessages[activeChat]);
    } else {
      setMessages([]);
    }
  }, [activeChat]);
  
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !activeChat || !user) return;
    
    // Create new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: mockChats.find(chat => chat.id === activeChat)?.participants.find(id => id !== user.id) || "",
      message: message.trim(),
      timestamp: new Date().toISOString(),
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
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat list */}
        <div className="md:col-span-1">
          <Card className="h-[600px] overflow-hidden">
            <CardHeader className="border-b p-4">
              <h2 className="font-semibold">Conversations</h2>
            </CardHeader>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {mockChats.length > 0 ? (
                <div>
                  {mockChats.map(chat => {
                    // Get the other participant
                    const otherParticipantId = chat.participants.find(id => id !== user.id);
                    // This would normally come from a users database
                    const otherName = otherParticipantId ? `User ${otherParticipantId.slice(0, 4)}` : "Unknown";
                    
                    return (
                      <div 
                        key={chat.id}
                        className={cn(
                          "p-4 cursor-pointer hover:bg-gray-50",
                          activeChat === chat.id && "bg-gray-100"
                        )}
                        onClick={() => setActiveChat(chat.id)}
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
        </div>
        
        {/* Chat messages */}
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            {activeChat ? (
              <>
                <CardHeader className="border-b p-4 flex-shrink-0">
                  <h2 className="font-semibold">
                    {activeChat && mockChats.find(c => c.id === activeChat)?.participants.find(id => id !== user.id) 
                      ? `User ${mockChats.find(c => c.id === activeChat)?.participants.find(id => id !== user.id)?.slice(0, 4)}` 
                      : "Chat"}
                  </h2>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map(msg => {
                        const isOwnMessage = msg.senderId === user.id;
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
                    <Button 
                      type="submit"
                      className="bg-found-green hover:bg-found-green/90"
                      disabled={!message.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
