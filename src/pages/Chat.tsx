
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { mockChats } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container max-w-4xl mx-auto">
      <Routes>
        <Route index element={
          <>
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            <ChatList 
              chats={mockChats}
              activeChat={activeChat} 
              onSelectChat={handleChatSelect}
              userId={user.id}
            />
          </>
        } />
        <Route path=":chatId" element={
          <ChatWindow 
            userId={user.id}
            onBack={() => navigate("/chat")}
          />
        } />
      </Routes>
      
      <Outlet />
    </div>
  );
};

export default ChatPage;
