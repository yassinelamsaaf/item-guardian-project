
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Shield, MapPin } from "lucide-react";
import { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: Item;
  showStatus?: boolean;
}

const ItemCard = ({ item, showStatus = true }: ItemCardProps) => {
  const { id, name, image, status, location, dateAdded } = item;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
          {status === "protected" && (
            <div className="absolute top-2 right-2">
              <div className="bg-found-green rounded-full p-1">
                <Shield size={16} className="text-white" />
              </div>
            </div>
          )}
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
          <CardFooter className="p-4 pt-0">
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
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default ItemCard;
