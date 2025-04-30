
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import AddItemForm from "@/components/AddItemForm";
import { mockItems } from "@/data/mockData";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const MyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Filter for the current user's protected items
    if (user) {
      const userItems = mockItems.filter(item => item.userId === user.id && item.status === "protected");
      setItems(userItems);
    }
  }, [user]);

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
      title: "Item added",
      description: "Your item has been protected successfully.",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Protected Items</h1>
        <Button 
          className="bg-found-green hover:bg-found-green/90"
          onClick={() => setIsAddingItem(true)}
        >
          <PlusCircle className="mr-2" size={16} />
          Add Item
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center border border-dashed rounded-lg p-8">
          <h3 className="text-lg font-medium mb-2">No protected items</h3>
          <p className="text-gray-500 mb-6">Protect your valuables by adding them to your account</p>
          <Button 
            className="bg-found-green hover:bg-found-green/90"
            onClick={() => setIsAddingItem(true)}
          >
            <PlusCircle className="mr-2" size={16} />
            Add Your First Item
          </Button>
        </div>
      )}

      {/* Add Item Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Protected Item</DialogTitle>
          </DialogHeader>
          <AddItemForm 
            onSubmit={handleAddItem} 
            onCancel={() => setIsAddingItem(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyItems;
