
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DownloadIcon, CopyIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode = ({ value, size = 200 }: QRCodeProps) => {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  
  // This is a mock QR code for demonstration
  // In a real app, we'd use a QR code generation library
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  
  const downloadQRCode = () => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'lost-and-found-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code downloaded",
      description: "The QR code has been saved to your device.",
    });
  };
  
  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && qrCodeUrl) {
        // In a real app, we might want to copy a URL or text value
        await navigator.clipboard.writeText(value);
        toast({
          title: "Copied to clipboard",
          description: "The item identifier has been copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="p-6 flex flex-col items-center">
      <div className="mb-4 text-center">
        <h3 className="font-semibold text-lg mb-1">Item QR Code</h3>
        <p className="text-sm text-gray-500">
          Use this QR code to help identify your item if lost
        </p>
      </div>
      
      <div 
        ref={qrRef} 
        className="my-4 bg-white p-2 rounded-lg shadow-sm border"
      >
        <img 
          src={qrCodeUrl} 
          alt="QR Code for item" 
          width={size} 
          height={size}
        />
      </div>
      
      <div className="flex gap-2 mt-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={downloadQRCode}
        >
          <DownloadIcon size={16} />
          <span>Download</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={copyToClipboard}
        >
          <CopyIcon size={16} />
          <span>Copy ID</span>
        </Button>
      </div>
    </Card>
  );
};

export default QRCode;
