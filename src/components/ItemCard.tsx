
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Shield, MapPin, Search } from "lucide-react";
import { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: Item;
  showStatus?: boolean;
  onContactClick?: (itemId: string) => void;
}

const ItemCard = ({ item, showStatus = true, onContactClick }: ItemCardProps) => {
  const { id, name, image, status, location, dateAdded } = item;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const handleContactClick = (e: React.MouseEvent) => {
    if (onContactClick) {
      e.preventDefault(); // Prevent navigation to item detail
      onContactClick(id);
    }
  };

  return (
    <Link to={`/item/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-40 w-full overflow-hidden">
          <img 
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {/* Display QR code icon for protected items */}
            {item.status === "protected" && (
              <div className="bg-found-green rounded-full p-1">
                <Shield size={16} className="text-white" />
              </div>
            )}
            
            {/* Display found icon for found items */}
            {item.status === "found" && (
              <div className="bg-blue-500 rounded-full p-1">
                <Search size={16} className="text-white" />
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base mb-1">{name}</h3>
          {location && (
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <MapPin size={14} className="mr-1" />
              <span>{location}</span>
            </div>
          )}
          <div className="text-xs text-gray-400">
            {formatDate(dateAdded)}
          </div>
        </CardContent>
        {showStatus && (
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <Badge 
              className={cn(
                "text-xs",
                status === "protected" ? "bg-found-green hover:bg-found-green/90" : 
                status === "found" ? "bg-blue-500 hover:bg-blue-600" : 
                "bg-lost-red hover:bg-lost-red/90"
              )}
            >
              {status === "protected" ? "Protected" : 
               status === "found" ? "Found" : "Lost"}
            </Badge>
            
            {item.status === "found" && item.contact && onContactClick && (
              <button 
                onClick={handleContactClick}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                Contact Finder
              </button>
            )}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default ItemCard;
