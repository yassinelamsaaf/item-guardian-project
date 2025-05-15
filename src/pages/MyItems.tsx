
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { PlusCircle, Package, QrCode, Trash } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import AddItemForm from "@/components/AddItemForm";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getItems, addItem, saveItems } from "@/utils/storage";

const MyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Get items from localStorage
      const storedItems = getItems("protected");
      // Filter for current user's items
      const userItems = storedItems.filter(item => item.userId === user.id);
      setItems(userItems);
    }
  }, [user]);

  const handleAddItem = (newItem: any) => {
    // Add user ID to the new item
    const itemWithUserId = {
      ...newItem,
      userId: user?.id || "",
    };
    
    // Add the item to localStorage
    const updatedItems = addItem(itemWithUserId, "protected");
    
    // Update local state
    setItems(updatedItems.filter(item => item.userId === user?.id));
    setIsAddingItem(false);
    
    toast({
      title: "Item added",
      description: "Your item has been protected successfully.",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete && user) {
      // Get all protected items
      const allItems = getItems("protected");
      
      // Filter out the item to delete
      const updatedItems = allItems.filter(item => item.id !== itemToDelete);
      
      // Save back to localStorage
      saveItems(updatedItems, "protected");
      
      // Update local state
      setItems(updatedItems.filter(item => item.userId === user.id));
      
      toast({
        title: "Item deleted",
        description: "Your item has been removed successfully.",
      });
      
      // Reset the item to delete
      setItemToDelete(null);
    }
  };

  const handleGetQRStickers = () => {
    setIsQRDialogOpen(true);
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-purple-500" />
          <h1 className="text-2xl font-bold">My Protected Items</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="border-found-green text-found-green hover:bg-found-green/10"
            onClick={handleGetQRStickers}
          >
            <QrCode className="mr-2" size={16} />
            Get QR-Stickers
          </Button>
          <Button 
            className="bg-found-green hover:bg-found-green/90"
            onClick={() => setIsAddingItem(true)}
          >
            <PlusCircle className="mr-2" size={16} />
            Add Item
          </Button>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative">
              <ItemCard item={item} />
              <button 
                className="absolute top-3 left-3 bg-red-500 p-1 rounded-full hover:bg-red-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteItem(item.id);
                }}
              >
                <Trash size={16} className="text-white" />
              </button>
            </div>
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Add New Protected Item</DialogTitle>
            <DialogDescription>
              Add your valuable items to generate QR codes for them.
            </DialogDescription>
          </DialogHeader>
          <AddItemForm 
            onSubmit={handleAddItem} 
            onCancel={() => setIsAddingItem(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Get QR Stickers Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Get QR-Code Stickers</DialogTitle>
            <DialogDescription>
              Purchase a pack of QR code stickers to protect your valuable items.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between border p-4 rounded-lg">
              <div>
                <h3 className="font-medium">Basic Pack</h3>
                <p className="text-sm text-gray-500">10 QR code stickers</p>
              </div>
              <p className="font-bold">$9.99</p>
            </div>
            
            <div className="flex items-center justify-between border p-4 rounded-lg bg-blue-50">
              <div>
                <h3 className="font-medium">Premium Pack</h3>
                <p className="text-sm text-gray-500">25 QR code stickers</p>
                <p className="text-xs text-blue-600 mt-1">Most Popular</p>
              </div>
              <p className="font-bold">$19.99</p>
            </div>
            
            <div className="flex items-center justify-between border p-4 rounded-lg">
              <div>
                <h3 className="font-medium">Family Pack</h3>
                <p className="text-sm text-gray-500">50 QR code stickers</p>
              </div>
              <p className="font-bold">$34.99</p>
            </div>
            
            <Button className="w-full bg-found-green hover:bg-found-green/90 mt-4">
              Proceed to Checkout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your item and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyItems;
