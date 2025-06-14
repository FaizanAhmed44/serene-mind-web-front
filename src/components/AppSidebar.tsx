import { Book, Home, User, Calendar, Search, Heart, UserCog } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/UserAvatar";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My Dashboard",
    url: "/dashboard",
    icon: User,
  },
  {
    title: "Interest",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "Find Experts",
    url: "/experts",
    icon: Search,
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: UserCog,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
              alt="Core Cognitive Logo" 
              className="h-12 w-12 rounded-full border-3 border-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/10"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-sidebar-foreground leading-tight">Core Cognitive</h1>
            <p className="text-sm text-sidebar-foreground/80 font-medium">Mental Wellness Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-sidebar-accent transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
