import React, { useState } from "react";
import {
  Menu,
  X,
  Search,
  Home,
  Bird,
  Settings,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { cn } from "@/_core/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { useAppDispatch } from "@/store/useStore";
import { searchTweetAction } from "@/modules/tweet";
import useAppNavigation from "@/_core/hooks/useAppNavigation";
import AppLogo from "../atoms/app-logo";
import { Baumans } from "next/font/google";
import { User } from "@/store/tweetSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../atoms/sheet";
import { useAppTheme } from "../use-app-theme";

const banumas = Baumans({
  weight: "400",
  subsets: ["latin"],
  style: "normal",
});

// Mobile Nav Bar component for the top of the screen
export const MobileNavBar = ({
  userData,
  onSearchSubmit,
}: {
  userData: { username: string; email: string };
  onSearchSubmit: (query: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setShowSearch(false);
    }
  };

  const handleCloseSearch = () => {
    // Submit valid search when closing the search box
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
    setShowSearch(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background md:hidden">
      <div className="flex items-center space-x-2">
        <AppLogo width={24} height={24} />
        <span
          className={cn(
            "font-bold text-xl hidden sm:block text-sidebar-foreground",
            banumas.className
          )}
        >
          LITTLE X
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex items-center">
            <Input
              type="text"
              placeholder="Search"
              className="w-full h-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="ml-1"
              onClick={handleCloseSearch}
            >
              <X className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
            >
              <Search className="w-4 h-4" />
            </Button>
            <MobileLeftSidebar userData={userData} />
          </>
        )}
      </div>
    </div>
  );
};

// Mobile Left Sidebar as a Sheet component
export const MobileLeftSidebar = ({
  userData,
}: {
  userData: { username: string; email: string };
}) => {
  const navigation = useAppNavigation();

  const navMenu = [
    {
      id: 1,
      name: "Home",
      icon: <Home className="w-5 h-5" />,
      route: "/?tab=home",
    },
    {
      id: 2,
      name: "My Tweets",
      icon: <Bird className="w-5 h-5" />,
      route: "/?tab=profile",
    },
    {
      id: 3,
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      route: "/settings",
    },
  ];

  const handleNavigation = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-4/5 p-0">
        <div className="flex flex-col h-full bg-sidebar-background">
          {/* User Profile at Top */}
          <SheetHeader>
            <SheetTitle>
              <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-x-2">
                  <div className="p-1 rounded-full bg-gradient-to-tr from-blue-600 to-blue-900">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${userData?.username}`}
                        alt="User Avatar"
                      />
                      <AvatarFallback>
                        {userData?.username.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sidebar-foreground">
                      {userData?.username.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-1">
              {navMenu.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => handleNavigation(menu.route)}
                    className="w-full flex items-center justify-between px-3 py-3 text-sidebar-foreground rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 text-muted-foreground group-hover:text-sidebar-accent-foreground transition-colors">
                        {menu.icon}
                      </span>
                      <span className="text-sm font-medium">{menu.name}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Mobile Bottom Navigation Bar
export const MobileBottomNav = () => {
  const navigation = useAppNavigation();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden">
      <div className="flex justify-around py-2">
        <Button
          variant="ghost"
          className="flex flex-col items-center p-2"
          onClick={() => navigation.navigate("/?tab=home")}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center p-2"
          onClick={() => navigation.navigate("/?tab=profile")}
        >
          <Bird className="w-5 h-5" />
          <span className="text-xs mt-1">My Tweets</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center p-2"
          onClick={() => navigation.navigate("/settings")}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1">Settings</span>
        </Button>
      </div>
    </div>
  );
};

// Mobile Right Sidebar as a Sheet component that shows suggested users and following
export const MobileRightSidebar = ({
  userData,
  following,
  suggestions,
  onFollow,
  onUnfollow,
}: {
  userData: { username: string; email: string };
  following: User[];
  suggestions: User[];
  onFollow: (id: string) => void;
  onUnfollow: (id: string) => void;
}) => {
  const { toggleTheme, isDark } = useAppTheme();

  const [activeTab, setActiveTab] = useState<"suggested" | "following">(
    "suggested"
  );

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-16 right-4 w-12 h-12 rounded-full shadow-lg md:hidden"
            aria-label="Show people"
          >
            <Avatar className="w-full h-full">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${userData?.username}`}
                alt="User Avatar"
              />
              <AvatarFallback>{userData?.username.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <div className="flex flex-col h-full bg-sidebar-background">
            {/* Tab Navigation */}
            <SheetHeader>
              <SheetTitle>
                <div className="flex border-b border-sidebar-border">
                  <button
                    className={cn(
                      "flex-1 py-3 text-center text-sm font-medium",
                      activeTab === "suggested"
                        ? "border-b-2 border-blue-500"
                        : ""
                    )}
                    onClick={() => setActiveTab("suggested")}
                  >
                    Suggested For You
                  </button>
                  <button
                    className={cn(
                      "flex-1 py-3 text-center text-sm font-medium",
                      activeTab === "following"
                        ? "border-b-2 border-blue-500"
                        : ""
                    )}
                    onClick={() => setActiveTab("following")}
                  >
                    Following
                  </button>
                </div>
              </SheetTitle>
            </SheetHeader>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "suggested" && (
                <div className="space-y-4">
                  {suggestions.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-x-3">
                        <div className="p-0.5 rounded-full bg-gradient-to-tr from-muted-foreground/50 to-muted-foreground">
                          <Avatar className="w-10">
                            <AvatarImage
                              src={`https://i.pravatar.cc/150?u=${user.username}`}
                            />
                            <AvatarFallback>
                              {user?.username.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-sidebar-foreground">
                            {user.username}
                          </p>
                        </div>
                      </div>
                      <Button className="h-8" onClick={() => onFollow(user.id)}>
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "following" && (
                <div className="space-y-4">
                  {following.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-x-3">
                        <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600">
                          <Avatar className="w-10">
                            <AvatarImage
                              src={`https://i.pravatar.cc/150?u=${user.username}`}
                            />
                            <AvatarFallback>
                              {user?.username.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-sidebar-foreground">
                            {user.username}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="h-8"
                        onClick={() => onUnfollow(user.id)}
                      >
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed bottom-16 left-4 sm:hidden"
      >
        {isDark ? (
          <SunIcon className="size-4 text-muted-foreground" />
        ) : (
          <MoonIcon className="size-4 text-muted-foreground" />
        )}
      </Button>
    </>
  );
};
