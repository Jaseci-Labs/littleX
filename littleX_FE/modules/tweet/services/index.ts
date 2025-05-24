import { Comment, TweetNode } from "@/nodes/tweet-node";
import { private_api } from "@/_core/api-client";
import { User, UserProfile } from "@/store/tweetSlice";

export const TweetApi = {
  // Create a new tweet
  getTweets: async () => {
    const res = await private_api.post("/walker/load_feed", {});
    const data = res.data?.reports?.[0] || [];

    return data.map((entry: any) => {
      const tweet = entry?.Tweet_Info?.context;
      return {
        id: tweet?.id,
        username: tweet?.username ?? "",
        content: tweet?.content ?? "",
        embedding: tweet?.embedding ?? [],
        likes: Array.isArray(tweet?.likes) ? tweet.likes : [],
        comments: Array.isArray(tweet?.comments) ? tweet.comments : [],
      } as TweetNode;
    }) as TweetNode[];
  },

  createTweet: async (content: string) => {
    const response = await private_api.post("/walker/create_tweet", {
      content,
    });
    const tweets = response.data?.reports || [];
    const tweet = tweets[0]?.[0] || {};

    const tweetData: TweetNode = {
      comments: [],
      content: tweet?.context?.content || "",
      embedding: tweet?.context?.embedding || [],
      id: tweet?.id || "",
      likes: [],
      username: "",
      created_at: tweet?.context?.created_at || "",
    };

    return tweetData;
  },

  // Update an existing tweet
  updateTweet: async (data: { id: string; content: string }) => {
    const response = await private_api.post(`/walker/update_tweet/${data.id}`, {
      updated_content: data.content,
    });
    const tweet = response.data?.reports?.[0] || {};
    const tweetData: Pick<
      TweetNode,
      "content" | "embedding" | "id" | "created_at"
    > = {
      content: tweet?.context?.content || "",
      embedding: tweet?.context?.embedding || [],
      id: tweet?.id || "",
      created_at: tweet?.context?.created_at || "",
    };
    return tweetData;
  },

  // Delete a tweet
  deleteTweet: async (id: string) => {
    const response = await private_api.post(`/walker/remove_tweet/${id}`, {});
    return response.data.status === 200 ? id : null;
  },
  likeTweet: async (id: string, username: string) => {
    const response = await private_api.post(`/walker/like_tweet/${id}`, {});
    const data = response.data?.reports?.[0] || [];
    return {
      id: data.id,
      username: username,
    };
  },
  removeLike: async (id: string, username: string) => {
    const response = await private_api.post(`/walker/remove_like/${id}`, {});
    const data = response.data?.reports?.[0] || [];
    return {
      id: data.id,
      username: username,
    };
  },

  loadAllTheUserProfiles: async () => {
    // Then get all users
    const response = await private_api.post("/walker/load_user_profiles", {});
    const reports = response.data?.reports;
    const data =
      Array.isArray(reports) && Array.isArray(reports[0]) ? reports[0] : [];

    // Map and filter users that are not already followed
    const users: User[] = data.map((entry: any) => ({
      id: entry?.id,
      username: entry?.name ?? "",
    }));
    return users;
  },

  loadUserProfiles: async () => {
    // First get the current user's profile to get following

    const profile = await TweetApi.getProfile();
    const following = profile.following || [];

    const users = await TweetApi.loadAllTheUserProfiles();
    // Map and filter users that are not already followed
    const filterUsers: User[] = users.filter(
      (user: User) =>
        user.username !== "" &&
        !following.some((follower: User) => follower.id === user.id)
    );

    return filterUsers;
  },

  getProfile: async () => {
    const response = await private_api.post("/walker/get_profile", {});

    const data = response.data?.reports?.[0] || [];
    const profile: UserProfile = {
      following: data.followers,
      user: {
        id: data.user.id,
        username: data.user.context.username,
      },
    };
    return profile;
  },

  updateProfile: async (username: string) => {
    //Get all the profiles
    const allProfiles = await TweetApi.loadAllTheUserProfiles();
    // Check for same username exits or not
    const checkDuplicateUsername = allProfiles.some(
      (item) => item.username.toLowerCase() === username.toLowerCase()
    );
    if (checkDuplicateUsername) {
      // Return an error message if the username exists
      return { error: "Username already exists" };
    }

    const response = await private_api.post("/walker/update_profile", {
      new_username: username,
    });
    const data = response.data?.reports?.[0] || [];
    const profile: User = {
      id: data.id,
      username: data.context.username,
    };
    return profile;
  },

  followRequest: async (id: string) => {
    const response = await private_api.post(`/walker/follow_request/${id}`, {});
    const data = response.data?.reports?.[0] || [];
    const profile: User = {
      id: data.id,
      username: data.context.username,
    };
    return profile;
  },

  unFollowRequest: async (id: string) => {
    const response = await private_api.post(
      `/walker/un_follow_request/${id}`,
      {}
    );
    const data = response.data?.reports?.[0] || [];
    const profile: User = {
      id: data.id,
      username: data.context.username,
    };
    return profile;
  },

  addCommentTweet: async (
    tweetId: string,
    username: string,
    content: string
  ) => {
    const response = await private_api.post(
      `/walker/comment_tweet/${tweetId}`,
      {
        username,
        content,
      }
    );
    const data = response.data?.reports?.[0] || [];

    const comment: Comment = {
      id: data.id,
      content: data.context.content,
      username: username,
    };
    return { comment, tweetId };
  },

  updateCommentTweet: async (
    tweetId: string,
    id: string,
    username: string,
    content: string
  ) => {
    const response = await private_api.post(`/walker/update_comment/${id}`, {
      updated_content: content,
    });
    const data = response.data?.reports?.[0] || [];

    const comment: Comment = {
      id: data.id,
      content: data.context.content,
      username: username,
    };
    return { comment, tweetId };
  },

  deleteCommentTweet: async (tweetId: string, id: string) => {
    const response = await private_api.post(`/walker/remove_comment/${id}`, {});
    return response.data.status === 200 ? { tweetId, id } : null;
  },
};
