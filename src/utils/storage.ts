
import { Item } from "@/types";

// Local storage keys
const PROTECTED_ITEMS_KEY = "protected_items";
const FOUND_ITEMS_KEY = "found_items";
const LOST_ITEMS_KEY = "lost_items";

// Save items to localStorage
export const saveItems = (items: Item[], type: "protected" | "found" | "lost") => {
  const key = type === "protected" 
    ? PROTECTED_ITEMS_KEY 
    : type === "found" 
      ? FOUND_ITEMS_KEY 
      : LOST_ITEMS_KEY;
      
  localStorage.setItem(key, JSON.stringify(items));
};

// Get items from localStorage
export const getItems = (type: "protected" | "found" | "lost"): Item[] => {
  const key = type === "protected" 
    ? PROTECTED_ITEMS_KEY 
    : type === "found" 
      ? FOUND_ITEMS_KEY 
      : LOST_ITEMS_KEY;
      
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

// Add a new item and save to localStorage
export const addItem = (item: Item, type: "protected" | "found" | "lost") => {
  const items = getItems(type);
  const newItems = [...items, item];
  saveItems(newItems, type);
  return newItems;
};

// Get a specific item by ID (check all storage types)
export const getItemById = (id: string): Item | undefined => {
  // Check protected items first
  const protectedItems = getItems("protected");
  let item = protectedItems.find(item => item.id === id);
  if (item) return item;
  
  // Check found items next
  const foundItems = getItems("found");
  item = foundItems.find(item => item.id === id);
  if (item) return item;
  
  // Check lost items last
  const lostItems = getItems("lost");
  return lostItems.find(item => item.id === id);
};

// Clear all stored items
export const clearAllItems = () => {
  localStorage.removeItem(PROTECTED_ITEMS_KEY);
  localStorage.removeItem(FOUND_ITEMS_KEY);
  localStorage.removeItem(LOST_ITEMS_KEY);
};
