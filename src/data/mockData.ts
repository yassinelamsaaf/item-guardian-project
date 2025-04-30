
import { Item, Chat, ChatMessage } from "@/types";

// Mock items data
export const mockItems: Item[] = [
  {
    id: "1",
    name: "Wallet",
    description: "Brown leather wallet with initials J.D.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=3387&auto=format&fit=crop",
    category: "Accessories",
    status: "protected",
    dateAdded: "2025-03-15T10:30:00Z",
    userId: "123",
    location: "Home",
  },
  {
    id: "2",
    name: "Smartphone",
    description: "iPhone 15 Pro, space gray, has a crack on the screen",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=3280&auto=format&fit=crop",
    category: "Electronics",
    status: "protected",
    dateAdded: "2025-04-02T14:45:00Z",
    userId: "123",
    location: "Work",
  },
  {
    id: "3",
    name: "Backpack",
    description: "Black Northface backpack with red zipper",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=3387&auto=format&fit=crop",
    category: "Bags",
    status: "found",
    dateAdded: "2025-04-20T09:15:00Z",
    userId: "456",
    location: "Central Park",
    contact: {
      name: "Jane Smith",
      phone: "555-123-4567",
      email: "jane@example.com",
    },
  },
  {
    id: "4",
    name: "Headphones",
    description: "Sony WH-1000XM4 noise-cancelling headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3270&auto=format&fit=crop",
    category: "Electronics",
    status: "found",
    dateAdded: "2025-04-18T16:20:00Z",
    userId: "789",
    location: "Coffee Shop on Main St",
    contact: {
      name: "Mike Johnson",
      phone: "555-987-6543",
      email: "mike@example.com",
    },
  },
  {
    id: "5",
    name: "Glasses",
    description: "Ray-Ban sunglasses in black case",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=3270&auto=format&fit=crop",
    category: "Accessories",
    status: "protected",
    dateAdded: "2025-03-28T11:50:00Z",
    userId: "123",
    location: "Car",
  },
  {
    id: "6",
    name: "Wallet",
    description: "Blue leather wallet found near bus stop",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=3270&auto=format&fit=crop",
    category: "Accessories",
    status: "found",
    dateAdded: "2025-04-15T13:10:00Z",
    userId: "567",
    location: "Bus Stop on 5th Avenue",
    contact: {
      name: "Alex Davis",
      phone: "555-456-7890",
      email: "alex@example.com",
    },
  },
];

// Mock chat data
export const mockChats: Chat[] = [
  {
    id: "chat1",
    participants: ["123", "456"],
    lastMessage: "Hi, I found your wallet at Central Park",
    lastMessageTimestamp: "2025-04-20T10:30:00Z",
    unreadCount: 2,
    itemId: "3",
  },
  {
    id: "chat2",
    participants: ["123", "789"],
    lastMessage: "Are these your headphones?",
    lastMessageTimestamp: "2025-04-19T15:45:00Z",
    unreadCount: 0,
    itemId: "4",
  },
];

// Mock chat messages
export const mockChatMessages: Record<string, ChatMessage[]> = {
  "chat1": [
    {
      id: "msg1",
      senderId: "456",
      receiverId: "123",
      message: "Hi, I found your wallet at Central Park",
      timestamp: "2025-04-20T10:30:00Z",
      itemId: "3",
    },
    {
      id: "msg2",
      senderId: "456",
      receiverId: "123",
      message: "It has initials J.D. on it. Is it yours?",
      timestamp: "2025-04-20T10:31:00Z",
      itemId: "3",
    },
  ],
  "chat2": [
    {
      id: "msg3",
      senderId: "789",
      receiverId: "123",
      message: "Hey, I found these Sony headphones at the coffee shop",
      timestamp: "2025-04-19T15:40:00Z",
      itemId: "4",
    },
    {
      id: "msg4",
      senderId: "123",
      receiverId: "789",
      message: "Yes, those are mine! Thank you for finding them.",
      timestamp: "2025-04-19T15:45:00Z",
      itemId: "4",
    },
  ],
};
