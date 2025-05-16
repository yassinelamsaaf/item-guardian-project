
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface AddItemFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddItemForm = ({ onSubmit, onCancel }: AddItemFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      status: "protected" as const,
      dateAdded: new Date().toISOString(),
      image: previewUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=3374&auto=format&fit=crop",
    };
    
    try {
      onSubmit(newItem);
      
      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        category: "",
        location: "",
        image: null
      });
      setPreviewUrl("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error adding item",
        description: "There was a problem adding your item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
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
            <Label htmlFor="location">Storage Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where you typically keep this item"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
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
          <Button type="submit" className="bg-found-green hover:bg-found-green/90">
            Add Item
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddItemForm;
