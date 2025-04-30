
import { Link, useLocation } from "react-router-dom";
import { Home, Box, List, MessageCircle, Settings, Globe } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Box, label: "My Items", path: "/my-items" },
    { icon: List, label: "Listed Items", path: "/listed-items" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLanguageChange = () => {
    // Language change functionality would go here
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-found-green">
            <Box size={18} className="text-white" />
          </div>
          <span className="font-semibold text-lg">Lost & Found</span>
        </div>
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild active={location.pathname === item.path}>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={handleLanguageChange}
          >
            <Globe size={18} />
            <span>Language</span>
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start gap-2"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
