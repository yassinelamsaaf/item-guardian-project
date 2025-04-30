
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import AddFoundItemForm from "@/components/AddFoundItemForm";
import { mockItems } from "@/data/mockData";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const FoundItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show only found items
    const foundItems = mockItems.filter(item => item.status === "found");
    setItems(foundItems);
  }, []);
  
  const filteredItems = items.filter(item => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by category
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];
  
  const handleAddItem = (newItem: any) => {
    // Add user ID to the new item
    const itemWithUserId = {
      ...newItem,
      userId: user?.id || "",
    };
    
    // Add the new item to the list
    setItems(prevItems => [...prevItems, itemWithUserId]);
    setIsAddingItem(false);
    
    toast({
      title: "Found item reported",
      description: "Thank you for reporting this found item.",
    });
  };
  
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
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory
              ? "Try adjusting your search or filters"
              : "No found items have been reported yet"}
          </p>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 mt-4"
            onClick={() => setIsAddingItem(true)}
          >
            <PlusCircle className="mr-2" size={16} />
            Report a Found Item
          </Button>
        </div>
      )}

      {/* Add Found Item Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report a Found Item</DialogTitle>
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
