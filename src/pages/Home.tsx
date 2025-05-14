
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
  const [protectedFoundItems, setProtectedFoundItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load all found items
      const allFoundItems = getItems("found");
      
      // Split into protected and non-protected found items (excluding the user's own items)
      const otherUserFoundItems = allFoundItems.filter(item => item.userId !== user.id);
      
      // Get protected items with QR codes that are also found (belongings of others that were found)
      const protectedItems = getItems("protected");
      const protectedAndFound = protectedItems.filter(item => 
        item.status === "protected" && 
        item.userId !== user.id && 
        allFoundItems.some(foundItem => foundItem.id === item.id)
      );
      
      setProtectedFoundItems(protectedAndFound);
      setFoundItems(otherUserFoundItems.filter(item => 
        !protectedAndFound.some(pItem => pItem.id === item.id)
      ));
    } else {
      // If no user is logged in, just show some example items
      setProtectedFoundItems([]);
      setFoundItems([]);
    }
  }, [user]);

  // Add some example items if there are none (just for demonstration)
  useEffect(() => {
    if (foundItems.length === 0 && protectedFoundItems.length === 0) {
      // This is just for demonstration purposes - examples will show up
      // We'll fetch from mockData instead of creating new ones to avoid duplications
      const allFoundItems = getItems("found");
      if (allFoundItems.length > 0) {
        // Use some existing found items as examples
        setFoundItems(allFoundItems.slice(0, 3));
      }
    }
  }, [foundItems, protectedFoundItems]);

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
            <span>Protected &amp; Found</span>
          </TabsTrigger>
          <TabsTrigger value="not-protected">Found Items</TabsTrigger>
        </TabsList>

        <TabsContent value="protected">
          {protectedFoundItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {protectedFoundItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No protected found items</h3>
              <p className="text-gray-500 mb-4">Items with QR codes that have been found will appear here.</p>
              <Link to="/found-items">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Browse Found Items
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="not-protected">
          {foundItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {foundItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No found items</h3>
              <p className="text-gray-500">Found items reported by other users will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
