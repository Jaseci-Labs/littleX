import { createSlice } from "@reduxjs/toolkit";
import { TweetNode } from "@/nodes/tweet-node";
import {
  addCommentAction,
  createTweetAction,
  deleteCommentAction,
  deleteTweetAction,
  fetchTweetsAction,
  followRequestAction,
  getUserProfileAction,
  likeTweetAction,
  loadUserProfilesAction,
  removeLikeAction,
  searchTweetAction,
  unFollowRequestAction,
  updateCommentAction,
  updateTweetAction,
  updateUserProfileAction,
} from "@/modules/tweet";
import { cosineSimilarity } from "@/modules/tweet/utils";
import { toast, useToast } from "@/ds/atoms/hooks/use-toast";
export type User = {
  id: string;
  username: string;
  avatar?: string;
};
export type UserProfile = {
  user: User;
  following: User[];
};
// export interface UserProfiles {
//   id: string;
//   username: string;
// }
interface TweetState {
  items: TweetNode[];
  userProfiles: User[];
  profile: UserProfile;
  searchResult: TweetNode[];

  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

const initialState: TweetState = {
  items: [],
  userProfiles: [],
  profile: {
    user: {
      id: "",
      username: "",
    },
    following: [],
  },
  searchResult: [],

  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTweetsAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(fetchTweetsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Tweets fetched successfully";
      state.items = action.payload;
    });
    builder.addCase(fetchTweetsAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    builder.addCase(loadUserProfilesAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.userProfiles = action.payload; // Already filtered in service
      state.successMessage = "User profiles fetched successfully";
    });
    builder.addCase(loadUserProfilesAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(loadUserProfilesAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    builder.addCase(createTweetAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Tweet created successfully";
      state.items = [
        { ...action.payload, username: state.profile.user.username },
        ...state.items,
      ];
      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });
    builder.addCase(createTweetAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(createTweetAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    // Search
    builder.addCase(searchTweetAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Search completed successfully";

      if (action.payload?.embedding) {
        // Calculate similarity scores and filter/sort tweets
        const matchingTweets = state.items
          .map((tweet) => ({
            ...tweet,
            similarity: cosineSimilarity(
              action.payload.embedding,
              tweet.embedding
            ),
          }))
          .filter((tweet) => tweet.similarity > 0.4)
          .sort((a, b) => b.similarity - a.similarity);

        state.searchResult = matchingTweets;
      } else {
        state.searchResult = [];
      }
    });
    builder.addCase(searchTweetAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(searchTweetAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    builder.addCase(updateTweetAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Tweet updated successfully";
      state.items = state.items.map((tweet) =>
        tweet.id === action.payload.id ? { ...tweet, ...action.payload } : tweet
      );
      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });

    builder.addCase(updateTweetAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(updateTweetAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    builder.addCase(deleteTweetAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Tweet deleted successfully";
      state.items = state.items.filter((item) => item.id !== action.payload);
      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });
    builder.addCase(deleteTweetAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(deleteTweetAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    builder.addCase(likeTweetAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Tweet liked successfully";
      state.items = state.items.map((tweet) =>
        tweet.id === action.payload.id
          ? { ...tweet, likes: [...tweet.likes, action.payload.username] }
          : tweet
      );

      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });
    builder.addCase(likeTweetAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(likeTweetAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(removeLikeAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Tweet removed from likes successfully";
      state.items = state.items.map((tweet) =>
        tweet.id === action.payload.id
          ? {
              ...tweet,
              likes: tweet.likes.filter(
                (like) => like !== action.payload.username
              ),
            }
          : tweet
      );
      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });

    builder.addCase(removeLikeAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(removeLikeAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    builder.addCase(getUserProfileAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.success = true;
      state.successMessage = "Profile updated";
    });
    builder.addCase(getUserProfileAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    builder.addCase(updateUserProfileAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(updateUserProfileAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile.user = action.payload;
      state.success = true;
      state.successMessage = "Profile updated";
    });
    builder.addCase(updateUserProfileAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
      toast({
        title: "Error!",
        description: action.payload as string,
        variant: "destructive",
        duration: 5000,
      });
    });
    // follow
    builder.addCase(followRequestAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(followRequestAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = {
        ...state.profile,
        following: [...state.profile.following, action.payload],
      };
      state.userProfiles = state.userProfiles.filter(
        (item) => item.id !== action.payload.id
      );
      state.success = true;
      state.successMessage = `You're following ${action.payload.username}`;

      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });
    builder.addCase(followRequestAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    // unfollow
    builder.addCase(unFollowRequestAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(unFollowRequestAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = {
        ...state.profile,
        following: state.profile.following.filter(
          (follower) => follower.id !== action.payload.id
        ),
      };
      state.userProfiles = [...state.userProfiles, action.payload];
      state.success = true;
      state.successMessage = `You're unfollowing ${action.payload.username}`;

      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });
    builder.addCase(unFollowRequestAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // addComment
    builder.addCase(addCommentAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.items = state.items.map((tweet) =>
        tweet.id === action.payload.tweetId
          ? {
              ...tweet,
              comments: [
                ...(tweet.comments || []),
                {
                  ...action.payload.comment,
                  comment: action.payload.comment ?? action.payload.comment,
                  tweetId: action.payload.tweetId,
                },
              ],
            }
          : tweet
      );
      const tweetData = state.items.find(
        (item) => item.id === action.payload.tweetId
      );

      state.successMessage = `You Comment on ${tweetData?.username}'s post`;

      toast({
        title: "Success!",
        description: state.successMessage,
        duration: 5000,
      });
    });
    builder.addCase(addCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(addCommentAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    // updateComment
    builder.addCase(updateCommentAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = `You Updated the Comment on ${action.payload.comment.username} post`;
      state.items = state.items.map((tweet) =>
        tweet.id === action.payload.tweetId
          ? {
              ...tweet,
              comments: (tweet.comments || []).map((comment) =>
                comment.id === action.payload.comment.id
                  ? { ...comment, ...action.payload.comment }
                  : comment
              ),
            }
          : tweet
      );
    });
    builder.addCase(updateCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(updateCommentAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });

    // deleteComment
    builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = `You deleted Comment`;
      state.items = state.items.map((tweet) =>
        action.payload && tweet.id === action.payload.tweetId
          ? {
              ...tweet,
              comments: (tweet.comments || []).filter(
                (comment) => comment.id !== action.payload?.id
              ),
            }
          : tweet
      );
    });
    builder.addCase(deleteCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
    builder.addCase(deleteCommentAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
  },
});

export const {} = tweetSlice.actions;
export default tweetSlice.reducer;
