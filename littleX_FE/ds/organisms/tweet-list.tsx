import React, { useEffect, useId } from "react";
import { TweetForm } from "./tweet-form";
import { TweetNode as TweetNode } from "@/nodes/tweet-node";
import { SparklesIcon } from "lucide-react";
import { TweetCard } from "./tweet-card";
import { User } from "@/store/tweetSlice";

type TweetListProps = {
  items: TweetNode[];
  isLoading?: boolean;

  profile: User;
};
const TweetList = ({
  items,

  profile,
}: TweetListProps) => {
  const id = useId();
  return (
    <div className="space-y-6">
      <TweetForm />

      {/* AI Generated Summary */}
      <div className="bg-gradient-to-l from-blue-600 to-purple-700 rounded-md flex items-center justify-between p-4">
        <h3 className="text-2xl font-bold">AI-Generated Summary</h3>
        <SparklesIcon />
      </div>

      {/* Load Feeds */}
      <div className="space-y-4">
        {items.map((feed) => (
          <TweetCard
            key={feed.id + id}
            id={feed.id}
            username={feed.username}
            content={feed.content}
            comments={feed.comments}
            likes={feed.likes}
            profile={profile}
          />
        ))}
      </div>
    </div>
  );
};

export default TweetList;
