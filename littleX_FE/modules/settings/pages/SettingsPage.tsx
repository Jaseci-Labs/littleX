"use client";

import React from "react";

import LeftTweetSideBar from "@/ds/molecules/left-tweet-sidebar";
import RightTweetSidebar from "@/ds/molecules/right-tweet-sidebar";
import MainFeed from "@/ds/molecules/tweet-main";
import CheckProfile from "@/ds/molecules/check-profile-dialog";
import { ProtectedRoute } from "@/ds/wrappers/prtoected-auth";
import { useAuth } from "@/modules/users/hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BirdIcon, HomeIcon, SettingsIcon } from "lucide-react";
import {
  MobileNavBar,
  MobileBottomNav,
  MobileRightSidebar,
} from "@/ds/molecules/mobile-components";
import { useAppDispatch } from "@/store/useStore";
import {
  fetchTweetsAction,
  followRequestAction,
  searchTweetAction,
  unFollowRequestAction,
  useTweets,
} from "@/modules/tweet";
import NewDashboardLeftRightSidebar from "@/ds/templates/new-dashboard-left-right-sidebar";
import useAppNavigation from "@/_core/hooks/useAppNavigation";
import { Metadata } from "next";
import { ProfileSection } from "@/ds/organisms/profile-section";

export const metadata: Metadata = {
  title: "Settings | Little X",
  description: "Manage your Little X settings.",
};
const SettingsPage = () => {
  const { profile, userProfiles, items: feeds, isLoading } = useTweets();
  const { data, logout } = useAuth();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const currentTab = navigation.getQueryParams().tab || "home";
  const currentPath = navigation.getCurrentPath();

  const userData = {
    username: profile?.user?.username || "",
    email: data?.email || "",
  };

  const following = profile?.following || [];
  const suggestions = userProfiles;
  const userTweets = feeds.filter(
    (item) => item.username === userData.username
  );

  // Navigation menu for main dashboard
  const navMenu = useMemo(
    () => [
      {
        id: 1,
        name: "Home",
        icon: <HomeIcon />,
        route: "/?tab=home",
        count: feeds.length,
        isActive: currentTab === "home",
      },
      {
        id: 2,
        name: "My Tweets",
        icon: <BirdIcon />,
        route: "/?tab=profile",
        count: userTweets.length,
        isActive: currentTab === "profile",
      },
      {
        id: 3,
        name: "Settings",
        icon: <SettingsIcon />,
        route: "/settings",
        count: 0,
        isActive: currentPath.includes("settings"),
      },
    ],
    [feeds.length, userTweets.length, currentTab, currentPath]
  );

  // Handle search from any component
  const handleSearch = (query: string) => {
    dispatch(searchTweetAction(query));
    navigation.navigate("/?tab=search");
  };

  // Handle follow/unfollow actions
  const handleFollow = (id: string) => {
    dispatch(followRequestAction(id));
    dispatch(fetchTweetsAction());
  };

  const handleUnfollow = (id: string) => {
    dispatch(unFollowRequestAction(id));
    dispatch(fetchTweetsAction());
  };

  // If profile not set up, show dialog
  if (profile?.user?.username === "") {
    return (
      <ProtectedRoute>
        <CheckProfile open={true} isLoading={isLoading} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <NewDashboardLeftRightSidebar
        // Mobile components
        mobileNavBar={
          <MobileNavBar userData={userData} onSearchSubmit={handleSearch} />
        }
        mobileBottomNav={<MobileBottomNav />}
        mobileRightSidebar={
          <MobileRightSidebar
            userData={userData}
            following={following}
            suggestions={suggestions}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
        }
        // Desktop components
        leftSidebar={
          <LeftTweetSideBar
            logout={logout}
            userData={userData}
            navMenu={navMenu}
            currentRoute={`/?tab=${currentTab}`}
          />
        }
        main={
          <div className="my-auto max-w-xl lg:max-w-2xl mx-auto flex flex-col items-center px-4">
            <div className="py-6">
              <h2 className="text-xl font-bold">Settings</h2>
            </div>
            <ProfileSection />
          </div>
        }
        rightSidebar={
          <RightTweetSidebar
            userData={userData}
            following={following}
            suggetions={suggestions}
          />
        }
        sidebarWidth="w-72"
      />
    </ProtectedRoute>
  );
};

export default SettingsPage;
