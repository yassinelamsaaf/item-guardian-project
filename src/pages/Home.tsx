
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, PlusCircle } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getItems, saveItems } from "@/utils/storage";

// Example items for the home page
const exampleItems: Item[] = [
  {
    id: "example-item-1",
    name: "Apple MacBook Pro",
    description: "Silver MacBook Pro found in the university library, 13-inch model",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=3270&auto=format&fit=crop",
    status: "found",
    isFound: true,
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    userId: "exampleUser1",
    location: "University Library",
    contact: {
      name: "John Smith",
      phone: "123-456-7890",
      email: "john@example.com"
    }
  },
  {
    id: "example-item-2",
    name: "House Keys",
    description: "Set of house keys with a blue keychain found at Central Park",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1582879304271-6f93bd8e8a12?q=80&w=3270&auto=format&fit=crop",
    status: "protected",
    isFound: true,
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    userId: "exampleUser2",
    location: "Central Park",
    qrCode: "QR123456",
    contact: {
      name: "Alice Johnson",
      phone: "234-567-8901",
      email: "alice@example.com"
    }
  },
  {
    id: "example-item-3",
    name: "Black Wallet",
    description: "Leather wallet with ID cards inside",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=3387&auto=format&fit=crop",
    status: "found",
    isFound: true,
    dateAdded: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userId: "exampleUser3",
    location: "Coffee Shop",
    contact: {
      name: "Robert Davis",
      phone: "345-678-9012",
      email: "robert@example.com"
    }
  }
];

const Home = () => {
  const [protectedFoundItems, setProtectedFoundItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const { user } = useAuth();

  // Add example items if none exist
  useEffect(() => {
    // Get all found items
    let allFoundItems = getItems("found");
    const allProtectedItems = getItems("protected");
    
    // If no found items, add example found items
    if (allFoundItems.length === 0) {
      const itemsToAdd = exampleItems;
      saveItems(itemsToAdd, "found");
      allFoundItems = itemsToAdd;
      
      // Add protected items as well
      const protectedExamples = itemsToAdd.filter(item => item.status === "protected");
      if (protectedExamples.length > 0) {
        saveItems(protectedExamples, "protected");
      }
    }

    if (user) {
      // Filter out user's own items
      const otherUserFoundItems = allFoundItems.filter(item => item.userId !== user.id);
      
      // Get protected items that are also found
      const protectedAndFound = allProtectedItems.filter(item => 
        item.status === "protected" && 
        item.userId !== user.id && 
        (item.isFound || allFoundItems.some(foundItem => foundItem.id === item.id))
      );
      
      setProtectedFoundItems(protectedAndFound);
      setFoundItems(otherUserFoundItems.filter(item => 
        !protectedAndFound.some(pItem => pItem.id === item.id)
      ));
    } else {
      // If no user is logged in, just show example items
      const protectedExamples = allFoundItems.filter(item => item.status === "protected");
      const regularExamples = allFoundItems.filter(item => item.status !== "protected");
      
      setProtectedFoundItems(protectedExamples);
      setFoundItems(regularExamples);
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
