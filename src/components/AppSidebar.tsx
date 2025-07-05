
import { Book, Home, User, Calendar, Search, Heart, UserCog, HelpCircle } from "lucide-react";
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

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: User,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: Book,
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
    title: "Training Sessions",
    url: "/training-sessions",
    icon: Calendar,
  },
  {
    title: "FAQ & Help",
    url: "/faq",
    icon: HelpCircle,
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: UserCog,
  },
];

export function AppSidebar() {
  const location = useLocation();

  // Dummy logout handler, replace with real logic as needed
  const handleLogout = () => {
    // For example, clear tokens, redirect, etc.
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-white shadow-lg border-gray-200 flex flex-col h-full">
      <SidebarHeader className="p-6 pb-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
              alt="Core Cognitive Logo" 
              className="h-10 w-10 rounded-full border-3 border-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-[18px] font-bold text-primary leading-tight">Core Cognitive</h1>
            <p className="text-sm text-gray-500">Success is a formula</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 flex flex-col">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-secondary transition-colors text-gray-600 py-5 px-3"
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
        {/* Spacer to push logout button to bottom */}
        <div className="flex-1" />
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center text-sm justify-center gap-2 px-6 py-2 rounded-md bg-white border-primary border-2 text-primary hover:text-white font-semibold hover:bg-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
