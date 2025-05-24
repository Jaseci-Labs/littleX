import React from "react";
import { SunIcon, MoonIcon, BellIcon } from "lucide-react";
import { Button } from "../atoms/button";
import { useAppTheme } from "../use-app-theme";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { User } from "@/store/tweetSlice";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { localStorageUtil } from "@/_core/utils";
import { useAppDispatch } from "@/store/useStore";
import {
  fetchTweetsAction,
  followRequestAction,
  unFollowRequestAction,
} from "@/modules/tweet";

interface RightTweetSidebarProps {
  userData: {
    username: string;
    email: string;
  };
  following: User[];
  suggetions: User[];
}
const RightTweetSidebar = ({
  userData,
  following,
  suggetions,
}: RightTweetSidebarProps) => {
  const dispatch = useAppDispatch();

  const { toggleTheme, isDark } = useAppTheme();
  const notifications =
    localStorageUtil.getItem<
      { content: string; status: "success" | "error"; time: string }[]
    >("NOTIFICATIONS") || [];

  const handleFollow = (id: string) => {
    dispatch(followRequestAction(id));
    dispatch(fetchTweetsAction());
  };

  const handleUnFollow = (id: string) => {
    dispatch(unFollowRequestAction(id));
    dispatch(fetchTweetsAction());
  };

  return (
    <div className=" h-screen w-full overflow-y-auto">
      {/* Header with actions */}
      <div className="flex items-center justify-between p-4 mb-6 border-b border-sidebar-border">
        <div className="flex items-center gap-x-2">
          <div className="p-1  rounded-full bg-gradient-to-tr from-blue-600 to-blue-900">
            <Avatar className=" size-10 ">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${userData?.username}`}
                alt="User Avatar"
              />
              <AvatarFallback>{userData?.username.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground max-w-[130px] truncate overflow-hidden text-ellipsis">
              {userData?.username.toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground max-w-[130px] truncate overflow-hidden text-ellipsis">
              {userData.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="size-4 text-muted-foreground" />
            ) : (
              <MoonIcon className="size-4 text-muted-foreground" />
            )}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle notifications"
              >
                <BellIcon className="size-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="px-0 w-80">
              <h4 className="text-sm font-semibold text-sidebar-foreground mb-2 px-4">
                Notifications
              </h4>
              <ul className="space-y-2 max-h-[12.75rem] overflow-y-auto pl-4 pr-2">
                {notifications.map((item, index) => (
                  <li
                    key={index}
                    className="text-xs text-muted-foreground grid grid-cols-[1fr_3.6rem]"
                  >
                    <span>{item.content}</span>
                    <span className="text-right">{item.time}</span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Suggested For You Section */}
      <div className="mb-8 py-4 pr-1">
        <div className="flex items-center justify-between mb-4 px-4">
          <h3 className="text-lg font-semibold text-sidebar-foreground">
            Suggested For You
          </h3>
          {suggetions.length > 5 && (
            <Button variant="link" className="px-0 h-0">
              See All
            </Button>
          )}
        </div>
        <div className="space-y-3 h-[30.5vh] overflow-y-auto pl-4 pr-2">
          {suggetions.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div className="p-0.5  rounded-full bg-gradient-to-tr from-muted-foreground/50 to-muted-foreground">
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
                  <p className="text-sm font-medium text-sidebar-foreground max-w-[100px] truncate overflow-hidden text-ellipsis">
                    {user.username}
                  </p>
                  {/* <p className="text-xs text-muted-foreground max-w-[100px] truncate overflow-hidden text-ellipsis">
                    @{user.username}
                  </p> */}
                </div>
              </div>
              <Button className="h-8" onClick={() => handleFollow(user.id)}>
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Artists Section */}
      <div className="mb-8 py-4 pr-1">
        <div className="flex items-center justify-between mb-4 px-4">
          <h3 className="text-lg font-semibold text-sidebar-foreground">
            Following
          </h3>
          {following && following.length > 5 && (
            <Button variant="link" className="px-0 h-0">
              See All
            </Button>
          )}
        </div>
        <div className="space-y-3 h-[30.5vh] overflow-y-auto pl-4 pr-2">
          {following &&
            following.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <div className="p-0.5  rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600">
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
                    <p className="text-sm font-medium text-sidebar-foreground max-w-[100px] truncate overflow-hidden text-ellipsis">
                      {user.username}
                    </p>
                    {/* <p className="text-xs text-muted-foreground max-w-[100px] truncate overflow-hidden text-ellipsis">
                    @{user.username}
                  </p> */}
                  </div>
                </div>
                <Button className="h-8" onClick={() => handleUnFollow(user.id)}>
                  Unfollow
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightTweetSidebar;
