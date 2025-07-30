import { Link, useLocation } from "react-router-dom";
import {
  Book,
  Home,
  Calendar,
  Search,
  Heart,
  HelpCircle,
  CalendarCheck,
  GraduationCap,
  LogOut,
} from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: Book,
  },
  {
    title: "My Enrolled Courses",
    url: "/enrolled-courses",
    icon: GraduationCap,
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
    title: "My Booked Sessions",
    url: "/booked-sessions",
    icon: CalendarCheck,
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
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Sidebar className="border-r border-gray-300 bg-white flex flex-col h-full">
     
       <SidebarHeader className="border-b border-gray-300 p-4 lg:p-6">
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
      <SidebarContent className="px-3 py-4 flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-black mb-3 px-3 uppercase tracking-wider font-montserrat">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        rounded-xl transition-all duration-300 h-9 lg:h-10 group
                        ${
                          isActive
                            ? "bg-primary text-white shadow-lg"
                            : "hover:bg-sidebar-accent hover:text-white text-gray-700"
                        }
                      `}
                    >
                      <Link
                        to={item.url}
                        className="flex items-center space-x-3 px-3 py-2"
                      >
                        <item.icon
                          size={16}
                          className={`lg:w-4 lg:h-4 flex-shrink-0 ${
                            isActive ? "text-white" : "hover:text-white"
                          }`}
                        />
                        <span className="font-medium text-xs lg:text-sm font-montserrat truncate">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="ml-auto">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem key="logout">
                <SidebarMenuButton
                  asChild
                  className="rounded-xl transition-all duration-300 h-9 lg:h-10 group hover:bg-sidebar-accent hover:text-white text-gray-700"
                >
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-3 py-2"
                    onClick={handleLogout}
                  >
                    <LogOut
                      size={16}
                      className="lg:w-4 lg:h-4 flex-shrink-0 hover:text-white"
                    />
                    <span className="font-medium text-xs lg:text-sm font-montserrat truncate">
                      Logout
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-300 p-4">
        <Link to="/profile">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-200 transition-colors duration-200 group cursor-pointer">
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-300 group-hover:ring-primary/20 transition-all"
                alt={user.name}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base font-montserrat ring-2 ring-gray-300 group-hover:ring-primary/20 transition-all uppercase">
                {(() => {
                  const words = user?.name?.trim().split(/\s+/);
                  if (words && words.length >= 2) {
                    return words[0][0] + words[1][0];
                  }
                  return words ? words[0][0] : "";
                })()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black font-montserrat truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-black font-sans truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
