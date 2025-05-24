import { TweetForm } from "../organisms/tweet-form";
import { TweetNode } from "@/nodes/tweet-node";
import { User } from "@/store/tweetSlice";
import { TweetCard } from "../organisms/tweet-card";
import { useSearchParams } from "next/navigation";

type MainFeedProps = {
  feeds: TweetNode[];
  isLoading?: boolean;
  profile: User;
  userTweets: TweetNode[];
  searchResult: TweetNode[];
};

// Main Social Media Feed Component
const MainFeed = ({
  feeds,
  userTweets,
  searchResult,
  profile,
  isLoading = false,
}: MainFeedProps) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";

  // Determine which data to display based on the URL parameter
  const getActiveData = (): TweetNode[] => {
    switch (activeTab) {
      case "profile":
      case "user":
        return userTweets;
      case "search":
        return searchResult;
      case "home":
      default:
        return feeds;
    }
  };

  const activeData = getActiveData();

  // Get tab title for better UX
  const getTabTitle = (): string => {
    switch (activeTab) {
      case "profile":
      case "user":
        return "Your Tweets";
      case "search":
        return searchResult.length > 0
          ? `Search Results (${searchResult.length})`
          : "Search Results";
      case "home":
      default:
        return "Home Feed";
    }
  };

  const title = getTabTitle();

  // Get empty state message based on current tab
  const getEmptyStateMessage = (): string => {
    switch (activeTab) {
      case "profile":
      case "user":
        return "You haven't posted any tweets yet. Create your first tweet!";
      case "search":
        return "No tweets found. Try searching for something else.";
      case "home":
      default:
        return "No tweets to display. Follow some users or create a tweet!";
    }
  };

  // Show different loading states based on tab

  return (
    <div className="bg-background h-screen text-foreground flex flex-col">
      <div className="max-w-xl lg:max-w-2xl mx-auto w-full flex flex-col h-full">
        {/* Sticky TweetForm at the top - only show on home and profile tabs */}
        {(activeTab === "home" || activeTab === "profile") && (
          <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm sticky top-0 z-10 mb-3">
            <div className="py-3">
              <TweetForm />
            </div>
          </div>
        )}

        {/* Tab title */}
        {activeTab === "search" && (
          <div className="flex-shrink-0 px-4 py-2 border-b border-border mb-3">
            <h2 className="text-xl font-semibold text-center">{title}</h2>
          </div>
        )}

        {/* Scrollable feed area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {activeData.length > 0 ? (
              activeData.map((tweet, index) => (
                <TweetCard
                  key={tweet.id + index}
                  id={tweet.id}
                  username={tweet.username}
                  content={tweet.content}
                  comments={tweet.comments}
                  likes={tweet.likes}
                  created_at={tweet.created_at}
                  profile={profile}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === "search"
                      ? "No results found"
                      : "No tweets yet"}
                  </h3>
                  <p className="text-sm">{getEmptyStateMessage()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeed;
