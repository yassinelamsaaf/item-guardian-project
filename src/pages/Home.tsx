
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, PlusCircle } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getItems } from "@/utils/storage";

const Home = () => {
  const [protectedItems, setProtectedItems] = useState<Item[]>([]);
  const [notProtectedItems, setNotProtectedItems] = useState<Item[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load items from localStorage
    if (user) {
      // Get protected items (with QR codes)
      const allProtectedItems = getItems("protected");
      setProtectedItems(allProtectedItems.filter(item => item.userId === user.id));
      
      // Get found items that are not protected
      const foundItems = getItems("found")
        .filter(item => item.userId !== user.id); // Only show items found by others
      
      setNotProtectedItems(foundItems);
    }
  }, [user]);

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <Link to="/my-items">
          <Button className="bg-found-green hover:bg-found-green/90">
            <PlusCircle className="mr-2" size={16} />
            Add Item
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="protected" className="mb-8">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="protected" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Protected Items</span>
          </TabsTrigger>
          <TabsTrigger value="not-protected">Not Protected</TabsTrigger>
        </TabsList>

        <TabsContent value="protected">
          {protectedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {protectedItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No protected items yet</h3>
              <p className="text-gray-500 mb-4">Add items you want to protect and generate QR codes.</p>
              <Link to="/my-items">
                <Button className="bg-found-green hover:bg-found-green/90">
                  Add Your First Item
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="not-protected">
          {notProtectedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {notProtectedItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No items to show</h3>
              <p className="text-gray-500">There are currently no found items listed by other users.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
