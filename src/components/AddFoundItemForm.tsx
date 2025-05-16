
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AddFoundItemFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddFoundItemForm = ({ onSubmit, onCancel }: AddFoundItemFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    image: null as File | null,
    qrCode: "",
    qrCodeImage: null as File | null,
    contact: {
      name: "",
      phone: "",
      email: "",
    }
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [qrPreviewUrl, setQrPreviewUrl] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const { toast } = useToast();

  // Pre-populate user data when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contact: {
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
        }
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("contact.")) {
      const contactField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQRImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, qrCodeImage: file }));
      setIsProtected(true);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setQrPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, qrCode: value }));
    setIsProtected(!!value.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate mock ID and date for the new item
    const newItem = {
      ...formData,
      id: `item-${Date.now()}`,
      status: isProtected ? "protected" : "found",
      isFound: true,
      dateAdded: new Date().toISOString(),
      image: previewUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=3374&auto=format&fit=crop",
      qrCodeImage: qrPreviewUrl || "",
      // Add the current user ID
      userId: user?.id || "",
    };
    
    try {
      onSubmit(newItem);
      
      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        category: "",
        location: "",
        image: null,
        qrCode: "",
        qrCodeImage: null,
        contact: {
          name: user?.name || "",
          phone: user?.phone || "",
          email: user?.email || "",
        }
      });
      setPreviewUrl("");
      setQrPreviewUrl("");
      setIsProtected(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error adding found item",
        description: "There was a problem reporting this item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto pr-2">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            onValueChange={(value) => handleSelectChange("category", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Bags">Bags</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Documents">Documents</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Color, brand, identifying marks..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Where Found</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location where you found this item"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield size={16} className={isProtected ? "text-found-green" : "text-gray-400"} />
            <Label htmlFor="qrCode">QR Code (if available)</Label>
          </div>
          <Input
            id="qrCode"
            name="qrCode"
            value={formData.qrCode}
            onChange={handleQRChange}
            placeholder="Enter QR code from item"
          />
          {isProtected && (
            <p className="text-xs text-found-green">
              This item will be marked as protected
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="qrCodeImage">QR Code Image (if available)</Label>
          <Input
            id="qrCodeImage"
            type="file"
            accept="image/*"
            onChange={handleQRImageChange}
            className="cursor-pointer"
          />
          
          {qrPreviewUrl && (
            <div className="mt-2">
              <img 
                src={qrPreviewUrl} 
                alt="QR Code Preview" 
                className="max-h-40 rounded-md object-contain"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Contact Information (Automatically filled)</Label>
          <div className="space-y-2">
            <Input
              name="contact.name"
              value={formData.contact.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled
            />
            <Input
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              disabled
            />
            <Input
              name="contact.email"
              value={formData.contact.email}
              onChange={handleChange}
              placeholder="Your email"
              disabled
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Upload Item Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          
          {previewUrl && (
            <div className="mt-2">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-40 rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Report Found Item
        </Button>
      </CardFooter>
    </form>
  );
};

export default AddFoundItemForm;
