"use client";

import React, { JSX, useState } from "react";
import { Search, LogOutIcon } from "lucide-react";
import { Baumans } from "next/font/google";
import { cn } from "@/_core/utils";
import AppLogo from "../atoms/app-logo";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { useAppDispatch } from "@/store/useStore";
import { searchTweetAction } from "@/modules/tweet";
import useAppNavigation from "@/_core/hooks/useAppNavigation";

const banumas = Baumans({
  weight: "400",
  subsets: ["latin"],
  style: "normal",
});

// Better type definition for navigation menu
type NavMenu = {
  id: number;
  name: string;
  icon: JSX.Element;
  route: string; // Changed from 'param' to 'route' for clarity
  count?: number; // Made optional since not all menu items need counts
  isActive?: boolean; // Add active state
};

interface LeftTweetSidebarProps {
  userData: {
    username: string;
    email: string;
  };
  navMenu: NavMenu[];
  logout: () => void;
  currentRoute?: string; // Add current route to determine active state
}

const LeftTweetSidebar = ({
  userData,
  navMenu,
  logout,
  currentRoute = "",
}: LeftTweetSidebarProps) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchTweetAction(searchQuery));
      navigation.navigate("/?tab=search");
    }
  };

  // Better navigation handler
  const handleNavigation = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <AppLogo width={32} height={32} />
          <span
            className={cn(
              "font-bold text-[28px] text-sidebar-foreground mt-1",
              banumas.className
            )}
          >
            LITTLE X
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search Tweets"
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-transparent text-sm text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navMenu.map((menu) => {
            const isActive = currentRoute === menu.route || menu.isActive;

            return (
              <li key={menu.id}>
                <button
                  onClick={() => handleNavigation(menu.route)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sidebar-foreground rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group transition-colors",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={cn(
                        "w-5 h-5 text-muted-foreground group-hover:text-sidebar-accent-foreground transition-colors",
                        isActive && "text-sidebar-accent-foreground"
                      )}
                    >
                      {menu.icon}
                    </span>
                    <span className="text-sm font-medium">{menu.name}</span>
                  </div>
                  {menu.count !== undefined && menu.count > 0 && (
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      {menu.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
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
              <p className="text-sm font-medium text-sidebar-foreground max-w-[160px]  truncate overflow-hidden text-ellipsis">
                {userData?.username.toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground max-w-[130px] truncate overflow-hidden text-ellipsis">
                {userData.email}
              </p>
            </div>
          </div>
          <Button variant="ghost" className="px-3" onClick={logout}>
            <LogOutIcon className="size-4 text-muted-foreground cursor-pointer" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeftTweetSidebar;
