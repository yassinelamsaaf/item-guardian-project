
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { mockChats } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [activeChat, setActiveChat] = useState<string | null>(chatId || null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Update active chat when URL param changes
  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
    }
  }, [chatId]);
  
  // Filter chats for current user
  const userChats = user 
    ? mockChats.filter(chat => chat.participants.includes(user.id))
    : [];
  
  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
  };
  
  const handleBackToList = () => {
    setActiveChat(null);
    navigate("/chat");
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Conversations</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${activeChat && 'hidden lg:block'}`}>
          <ChatList 
            chats={userChats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            userId={user?.id || ''}
          />
        </div>
        
        <div className={`lg:col-span-2 ${!activeChat && 'hidden lg:flex lg:items-center lg:justify-center'}`}>
          {activeChat ? (
            <ChatWindow 
              userId={user?.id || ''}
              onBack={handleBackToList}
            />
          ) : (
            <div className="text-center text-gray-500">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
