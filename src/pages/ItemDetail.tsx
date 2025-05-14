
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Shield, MessageSquare } from "lucide-react";
import { Item } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from "@/components/QRCode";
import ItemCard from "@/components/ItemCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getItemById, getItems } from "@/utils/storage";
import { useNavigate } from "react-router-dom";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isOwner = item?.userId === user?.id;
  const isProtected = item?.status === "protected";
  
  useEffect(() => {
    if (id) {
      // Find the item by ID using the utility function
      const foundItem = getItemById(id);
      setItem(foundItem || null);
      
      // Find similar items (same name, excluding current)
      if (foundItem) {
        // Combine all items from all storage types
        const protectedItems = getItems("protected");
        const foundItems = getItems("found");
        const lostItems = getItems("lost");
        const allItems = [...protectedItems, ...foundItems, ...lostItems];
        
        const similar = allItems.filter(i => 
          i.id !== id && 
          i.name.toLowerCase() === foundItem.name.toLowerCase()
        );
        setSimilarItems(similar);
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
  
  if (!item) {
    return (
      <div className="container max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <p className="text-gray-500">The requested item could not be found.</p>
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
              <Button 
                onClick={handleContactOwner}
                className="w-full mt-2 bg-found-green hover:bg-found-green/90"
              >
                <MessageSquare size={16} className="mr-2" />
                Contact Finder
              </Button>
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
            {similarItems.slice(0, 3).map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
