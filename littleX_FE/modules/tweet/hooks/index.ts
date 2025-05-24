import { useAppDispatch, useAppSelector } from "@/store/useStore";
import {
  createTweetAction,
  deleteTweetAction,
  fetchTweetsAction,
  followRequestAction,
  getUserProfileAction,
  likeTweetAction,
  loadUserProfilesAction,
  removeLikeAction,
  unFollowRequestAction,
  updateTweetAction,
  updateUserProfileAction,
} from "../actions";
import { TweetNode } from "@/nodes/tweet-node";
import { useEffect } from "react";
import { localStorageUtil } from "@/_core/utils";
import { APP_KEYS } from "@/_core/keys";

export const useTweets = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    isLoading,
    error,
    success,
    successMessage,
    userProfiles,
    profile,
    searchResult,
  } = useAppSelector((state) => state.tweet);

  useEffect(() => {
    // Load everything in parallel since service handles dependencies
    dispatch(getUserProfileAction());
    dispatch(loadUserProfilesAction());
    dispatch(fetchTweetsAction());
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const existingMessages =
        localStorageUtil.getItem<
          { content: string; status: "success" | "error"; time: string }[]
        >(APP_KEYS.NOTIFICATIONS) || [];

      const newMessage = successMessage
        ? {
            content: successMessage,
            status: "success",
            time: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              second: undefined,
              hour12: true,
            }),
          }
        : {
            content: error,
            status: "error",
            time: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              second: undefined,
              hour12: true,
            }),
          };

      localStorageUtil.setItem(APP_KEYS.NOTIFICATIONS, [
        newMessage,
        ...existingMessages,
      ]);
    }
  }, [successMessage, error]);

  const loadFeeds = async () => {
    dispatch(fetchTweetsAction());
  };

  const loadUserProfiles = async () => {
    dispatch(loadUserProfilesAction());
  };

  const refresh = async () => {
    dispatch(fetchTweetsAction());
  };
  const likeTweet = (data: { id: string; username: string }) => {
    dispatch(likeTweetAction(data));
  };

  const unlikeTweet = (data: { id: string; username: string }) => {
    dispatch(removeLikeAction(data));
  };

  // const createTweet = (tweet: Pick<TweetNode, "content">) => {
  //   dispatch(createTweetAction(tweet.content));
  // };

  const updateTweet = (tweet: Pick<TweetNode, "content" | "id">) => {
    dispatch(updateTweetAction(tweet));
  };

  const deleteTweet = (tweetId: string) => {
    dispatch(deleteTweetAction(tweetId));
  };

  const updateProfile = (username: string) => {
    dispatch(updateUserProfileAction(username));
  };

  const followRequest = (id: string) => {
    dispatch(followRequestAction(id));
    dispatch(fetchTweetsAction());
  };
  const unFollowRequest = (id: string) => {
    dispatch(unFollowRequestAction(id));
    dispatch(fetchTweetsAction());
  };
  return {
    items,
    isLoading,
    error,
    userProfiles,
    profile,
    loadFeeds,
    searchResult,
    loadUserProfiles,
    updateProfile,
    followRequest,
    unFollowRequest,
    success,
    successMessage,
    likeTweet,
    unlikeTweet,
    // createTweet,
    deleteTweet,
    updateTweet,
  };
};
