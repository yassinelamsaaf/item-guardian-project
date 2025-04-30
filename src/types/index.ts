
export interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  status: "protected" | "found" | "lost";
  dateAdded: string;
  userId: string;
  location?: string;
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  itemId?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  itemId?: string;
}
