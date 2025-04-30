
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/my-items":
        return "My Items";
      case "/listed-items":
        return "Listed Items";
      case "/chat":
        return "Messages";
      case "/settings":
        return "Settings";
      default:
        if (location.pathname.startsWith("/item/")) {
          return "Item Details";
        }
        return "";
    }
  };

  return (
    <header className="border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu size={20} />
            </Button>
          </SidebarTrigger>
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>
        
        {isHome && (
          <div className="relative hidden md:block max-w-md w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Right side elements if needed */}
        </div>
      </div>
      
      {isHome && (
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
