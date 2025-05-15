
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Shield, MessageSquare, Truck } from "lucide-react";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from "@/components/QRCode";
import ItemCard from "@/components/ItemCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getItemById, getItems } from "@/utils/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isOwner = item?.userId === user?.id;
  const isProtected = item?.status === "protected";
  
  useEffect(() => {
    if (id) {
      // Find the item by ID using the utility function
      const foundItem = getItemById(id);
      
      // Also check in our example items for persistent items
      if (!foundItem) {
        // Import example items from Home.tsx
        const exampleItems = [
          {
            id: "example-item-1",
            name: "Apple MacBook Pro",
            description: "Silver MacBook Pro found in the university library, 13-inch model",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=3270&auto=format&fit=crop",
            status: "found" as const,
            isFound: true,
            dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
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
            status: "protected" as const,
            isFound: true,
            dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(),
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
            status: "found" as const,
            isFound: true,
            dateAdded: new Date(Date.now() - 86400000).toISOString(),
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
            name: "Headphones",
            description: "Wireless noise-cancelling headphones, black color",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3270&auto=format&fit=crop",
            status: "lost" as const,
            isFound: false,
            dateAdded: new Date(Date.now() - 86400000 * 5).toISOString(),
            userId: "exampleUser4",
            location: "Downtown Bus",
            contact: {
              name: "Emma Wilson",
              phone: "456-789-0123",
              email: "emma@example.com"
            }
          },
          {
            id: "example-item-5",
            name: "Bike",
            description: "Red mountain bike with black mudguards",
            category: "Sports",
            image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=3270&auto=format&fit=crop",
            status: "found" as const,
            isFound: true,
            dateAdded: new Date(Date.now() - 86400000 * 4).toISOString(),
            userId: "exampleUser5",
            location: "City Park",
            contact: {
              name: "David Brown",
              phone: "567-890-1234",
              email: "david@example.com"
            }
          }
        ];
        
        const exampleItem = exampleItems.find(item => item.id === id);
        setItem(exampleItem || null);
      } else {
        setItem(foundItem);
      }
      
      // Find similar items (same category, excluding current)
      if (foundItem) {
        // Combine all items from all storage types
        const protectedItems = getItems("protected");
        const foundItems = getItems("found");
        const lostItems = getItems("lost");
        const allItems = [...protectedItems, ...foundItems, ...lostItems];
        
        const similar = allItems.filter(i => 
          i.id !== id && 
          i.category === foundItem.category
        );
        setSimilarItems(similar.slice(0, 3)); // Limit to 3 similar items
      }
    }
  }, [id]);
  
  const handleContactOwner = () => {
    if (item) {
      // Navigate to chat with the item owner
      navigate(`/chat/${item.userId}?itemId=${item.id}`);
      
      toast({
        title: "Contact initiated",
        description: "A chat has been created with this item's finder.",
      });
    }
  };
  
  const handleDeliveryRequest = () => {
    setShowDeliveryDialog(true);
  };
  
  if (!item) {
    return (
      <div className="container max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <p className="text-gray-500">The requested item could not be found.</p>
        <Button 
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Return to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <Badge 
            className={cn(
              "text-sm",
              isProtected ? "bg-found-green hover:bg-found-green/90" : 
              item.status === "found" ? "bg-blue-500 hover:bg-blue-600" : 
              "bg-lost-red hover:bg-lost-red/90"
            )}
          >
            {isProtected ? "Protected" : 
             item.status === "found" ? "Found" : "Lost"}
          </Badge>
        </div>
        
        {item.category && (
          <p className="text-gray-500">{item.category}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-lg overflow-hidden h-[300px]">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-4">About this item</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Description</h3>
              <p>{item.description || "No description provided."}</p>
            </div>
            
            {item.location && (
              <div>
                <h3 className="font-medium text-sm text-gray-500">Location</h3>
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-1" />
                  <span>{item.location}</span>
                </div>
              </div>
            )}
            
            {item.status === "found" && item.contact && (
              <div>
                <h3 className="font-medium text-sm text-gray-500">Contact</h3>
                {item.contact.name && (
                  <p className="mb-1">{item.contact.name}</p>
                )}
                <div className="space-y-2">
                  {item.contact.phone && (
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <a href={`tel:${item.contact.phone}`} className="text-blue-600 hover:underline">
                        {item.contact.phone}
                      </a>
                    </div>
                  )}
                  {item.contact.email && (
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <a href={`mailto:${item.contact.email}`} className="text-blue-600 hover:underline">
                        {item.contact.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {item.status === "found" && !isOwner && (
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleContactOwner}
                  className="w-full bg-found-green hover:bg-found-green/90"
                >
                  <MessageSquare size={16} className="mr-2" />
                  Contact Finder
                </Button>
                
                <Button 
                  onClick={handleDeliveryRequest}
                  className="w-full"
                  variant="outline"
                >
                  <Truck size={16} className="mr-2" />
                  Request Delivery
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {isProtected && isOwner && (
        <div className="mb-8">
          <QRCode value={`lost-and-found-item-${item.id}`} />
        </div>
      )}
      
      {similarItems.length > 0 && (
        <div className="mt-8">
          <Separator className="mb-6" />
          <h2 className="font-semibold text-lg mb-4">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {similarItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Delivery Service</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Please contact our delivery partner to arrange pickup and delivery of this item:
            </p>
            <div className="flex items-center bg-gray-100 p-4 rounded-md">
              <Phone size={20} className="text-found-green mr-3" />
              <div>
                <p className="font-medium">Delivery Service</p>
                <a href="tel:+1234567890" className="text-blue-600 text-lg font-bold">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Mention the item ID: <span className="font-medium">{item.id}</span>
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowDeliveryDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemDetail;
