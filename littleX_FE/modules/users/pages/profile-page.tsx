"use client";

import type { Metadata } from "next";
import { ProfileSection } from "@/ds/organisms/profile-section";
import { DashboardTemplate } from "@/ds/templates/dashboard-template";
import { TaskHeader } from "@/ds/molecules/task-header";
import { useAuth } from "../hooks/use-auth";
import { useTweets } from "@/modules/tweet";
import { ProtectedRoute } from "@/ds/wrappers/prtoected-auth";
import CheckProfile from "@/ds/molecules/check-profile-dialog";
import { CustomHeaderSidebarMainTemplate } from "@/ds/templates/custom-header-sidebar-template";
import { TweetHeader } from "@/ds/molecules/tweet-header";
import TweetSideBar from "@/ds/molecules/tweet-sidebar";
import { TweetCard } from "@/ds/organisms/tweet-card";
import { useId } from "react";

export const metadata: Metadata = {
  title: "Profile | Little X",
  description: "Manage your Little X profile",
};

export default function ProfilePage() {
  const id = useId();

  const { logout } = useAuth();
  const { isLoading, profile, items } = useTweets();
  const following = profile.following;
  const userData = profile.user;
  const userTweets = items.filter(
    (item) => item.username === userData.username
  );
  console.log(userTweets);
  return (
    <ProtectedRoute>
      {userData.username === "" ? (
        <CheckProfile open={true} isLoading={isLoading} />
      ) : (
        <CustomHeaderSidebarMainTemplate
          header={
            <TweetHeader userData={userData} logout={logout} title="Little-X" />
          }
          sidebar={<TweetSideBar profiles={following} isLoading={isLoading} />}
          main={
            <div className="space-y-4">
              <h1>My Tweets</h1>
              {userTweets.map((feed) => (
                <TweetCard
                  key={feed.id + id}
                  id={feed.id}
                  username={feed.username}
                  content={feed.content}
                  comments={feed.comments}
                  likes={feed.likes}
                  profile={userData}
                />
              ))}
            </div>
          }
          sidebarPosition="right"
          maxWidth={true}
          sidebarWidth="w-72"
        ></CustomHeaderSidebarMainTemplate>
      )}
    </ProtectedRoute>
  );
}
