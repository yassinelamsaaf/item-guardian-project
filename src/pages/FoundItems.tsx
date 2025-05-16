import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import AddFoundItemForm from "@/components/AddFoundItemForm";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getItems, addItem } from "@/utils/storage";

const FoundItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get found items from localStorage
    const storedItems = getItems("found");
    setItems(storedItems);
  }, []);
  
  const handleAddItem = (newItem: any) => {
    try {
      console.log("Adding new found item:", newItem);
      
      // Add the item to localStorage
      const updatedItems = addItem(newItem, "found");
      
      // If the item has a QR code (is protected), also add to protected items
      if (newItem.qrCode && newItem.status === "protected") {
        addItem(newItem, "protected");
      }
      
      // Update local state
      setItems(updatedItems);
      setIsAddingItem(false);
      
      toast({
        title: "Item added",
        description: "Your found item has been listed successfully.",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error adding item",
        description: "There was a problem adding your item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleContactClick = (itemId: string) => {
    // Navigate to chat with the item owner
    const item = items.find(i => i.id === itemId);
    if (item && item.userId) {
      // Create a chat URL with the user ID and item ID
      navigate(`/chat/${item.userId}?itemId=${itemId}`);
    }
  };
  
  const filteredItems = items.filter(item => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by category
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];
  
  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Found Items</h1>
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => setIsAddingItem(true)}
        >
          <PlusCircle className="mr-2" size={16} />
          Report Found Item
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item}
              onContactClick={handleContactClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search or filters"
              : "No items have been listed yet"}
          </p>
        </div>
      )}
      
      {/* Add Found Item Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="sm:max-w-[500px] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Report Found Item</DialogTitle>
            <DialogDescription>
              Add details about the item you found to help reunite it with its owner.
            </DialogDescription>
          </DialogHeader>
          <AddFoundItemForm 
            onSubmit={handleAddItem} 
            onCancel={() => setIsAddingItem(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoundItems;
