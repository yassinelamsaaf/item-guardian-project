
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, PlusCircle } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getItems, saveItems } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Example items for the home page - only found items can appear here
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
  },
  {
    id: "example-item-4",
    name: "Smartphone with QR Code",
    description: "Found iPhone with a QR code protection sticker on it",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=3280&auto=format&fit=crop",
    status: "found",
    isFound: true,
    qrCode: "QR456123",
    dateAdded: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    userId: "exampleUser4",
    location: "Public Library",
    contact: {
      name: "Emma Wilson",
      phone: "678-901-2345",
      email: "emma@example.com"
    }
  },
  {
    id: "example-item-5",
    name: "Bike",
    description: "Red mountain bike with black mudguards",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=3270&auto=format&fit=crop",
    status: "found",
    isFound: true,
    dateAdded: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    userId: "exampleUser5",
    location: "City Park",
    contact: {
      name: "David Brown",
      phone: "567-890-1234",
      email: "david@example.com"
    }
  },
  {
    id: "example-item-6",
    name: "Headphones with QR Code",
    description: "Sony WH-1000XM4 headphones with QR protection sticker",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3270&auto=format&fit=crop",
    status: "found",
    isFound: true,
    qrCode: "QR789012",
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    userId: "exampleUser6",
    location: "University Cafeteria",
    contact: {
      name: "Sarah Johnson",
      phone: "789-012-3456",
      email: "sarah@example.com"
    }
  }
];

const Home = () => {
  const [protectedFoundItems, setProtectedFoundItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Add example items if none exist and ensure they're always included
  useEffect(() => {
    // Get all items - only found items should appear on Home
    let allFoundItems = getItems("found");
    
    // If no found items, add example found items
    if (allFoundItems.length === 0) {
      // Filter examples to found items only
      saveItems(exampleItems, "found");
      allFoundItems = exampleItems;
    } else {
      // Make sure examples are always included in the stored items
      let updatedFoundItems = [...allFoundItems];
      
      // Check if example items exist, add them if they don't
      exampleItems.forEach(example => {
        if (!allFoundItems.some(item => item.id === example.id)) {
          updatedFoundItems.push(example);
        }
      });
      
      // Save updated found items if we added any examples
      if (updatedFoundItems.length > allFoundItems.length) {
        saveItems(updatedFoundItems, "found");
        allFoundItems = updatedFoundItems;
      }
    }

    // Filter items for display on home page
    if (user) {
      // Filter out user's own items - items with the current user's ID shouldn't appear
      const otherUserFoundItems = allFoundItems.filter(item => item.userId !== user.id);
      
      // Separate found items based on whether they have QR code
      const protectedAndFound = otherUserFoundItems.filter(item => item.qrCode);
      const regularFound = otherUserFoundItems.filter(item => !item.qrCode);
      
      setProtectedFoundItems(protectedAndFound);
      setFoundItems(regularFound);
    } else {
      // If no user is logged in, just show all example items
      const protectedExamples = exampleItems.filter(item => item.qrCode);
      const regularExamples = exampleItems.filter(item => !item.qrCode);
      
      setProtectedFoundItems(protectedExamples);
      setFoundItems(regularExamples);
    }
  }, [user]);

  // Filter items based on search term
  const filteredProtectedItems = protectedFoundItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFoundItems = foundItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContactClick = (itemId: string) => {
    // Get item details
    const item = foundItems.find(i => i.id === itemId) || 
                 protectedFoundItems.find(i => i.id === itemId);
    
    if (item && item.userId) {
      // Navigate to chat with the finder
      navigate(`/chat/${item.userId}?itemId=${itemId}`);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <Link to="/my-items">
          <Button className="bg-found-green hover:bg-found-green/90">
            <PlusCircle className="mr-2" size={16} />
            Report Item
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input 
          placeholder="Search items..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          {filteredProtectedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProtectedItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onContactClick={handleContactClick}
                />
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
          {filteredFoundItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredFoundItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onContactClick={handleContactClick}
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
