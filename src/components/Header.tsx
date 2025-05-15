
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  const location = useLocation();
  
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
        
        <div className="flex items-center gap-2">
          {/* Right side elements if needed */}
        </div>
      </div>
    </header>
  );
};

export default Header;
