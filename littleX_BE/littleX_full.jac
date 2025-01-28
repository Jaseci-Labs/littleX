import:py datetime;
import:py from jac_cloud.core.architype { NodeAnchor }
import:py logging;
import:py from mtllm.llms {Ollama}
import:py numpy;
import:py from sentence_transformers { SentenceTransformer }
import:py from sklearn.metrics.pairwise { cosine_similarity }

glob logger = logging.getLogger("littleX");
glob llm = Ollama(host="http://127.0.0.1:11434", model_name="llama3.2:1b");
glob model = SentenceTransformer('all-MiniLM-L6-v2');

can 'Extract and summarize trending themes, major highlights, and key interactions from recent tweets in one concise sentence.'
summarise_tweets(tweets: list[str]) -> 'Summarisation': str by llm();

can search_tweets(query: str, tweets: list, tweet_embeddings: any, similarity_threshold: float=0.25) -> list {
    query_embedding = model.encode([query]);
    similarities = cosine_similarity(query_embedding, tweet_embeddings)[0];
    results = [{**tweets[i], "similarity": similarities[i]} for i in range(len(similarities)) if similarities[i] >= similarity_threshold]
    ;
    return results;
}

node profile {
    has username: str = "";
    has count_tag: dict = {};
    has followees: list = [];

    can update with update_profile entry{
        logger.info("Updating profile");
        self.username = here.new_username;
        report self;
    }

    can get with get_profile entry{
        logger.info(f"profile info: {self}");
        report self;
    }

    can follow with follow_request entry{
        self.followees.append(here.profile_id);
        logger.info(f"New followee addded: {here.profile_id}");
        self +:follow():+> &here.profile_id;
        report self;
    }

    can un_follow with un_follow_request entry{
        self.followees.append(here.profile_id);
        logger.info(f"New followee addded: {here.profile_id}");
        self del-:follow:-> &here.profile_id;
        report self;
    }

    can like_tweet with like_tweet entry{
        tweet_node = &here.tweet_id;
        tweet_node +:like():+> self;
        logger.info(f"liked to a tweet: {tweet_node}");
        report tweet_node;
    }

    can remove_like with remove_like entry {
        tweet_node = &here.tweet_id;
        tweet_node del-:like:-> self;
        logger.info(f"Reomve liked to a tweet: {tweet_node}");
        report tweet_node;
    }
}

node tweet {
    has content: str;
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");
    has tweet_info: dict = {};

    can update with update_tweet exit{
        self.content = here.updated_content;
        logger.info(f"Tweet updated: {self}");
        report self;
    }

    can delete with remove_tweet exit{
        logger.info(f"Tweet deleted: {self}");
        del self;
    }

    can load with load_tweets entry{
        logger.info(f"Tweet loaded: {here}");  
        self.tweet_info = {
            "content":self.content,
            "likes": [i.username for i in [self -:like:->]], 
            "comments":[i.content for i in [self -->(`?comment)]]
            }; 
    }
}

node comment {
    has content: str;
}

edge follow {}

edge like {}

edge post {}

walker visit_profile {
    can visit_profile with `root entry {
        visit [-->(`?profile)] else {
            logger.info("Creating new profile");
            new_profile = here ++> profile();
            Jac.unrestrict(new_profile[0], level="CONNECT");
            visit new_profile;
        }
    }
}

walker update_profile { #spawn profile
    has new_username: str;
}

walker get_profile{} #spawn profile

walker load_user_profiles {
    obj __specs__ {
        static has auth: bool = False;
    }
    can load_profiles with `root entry {
        self.profiles: list = [];
        
        for user in NodeAnchor.Collection.find({"name": "profile"}) {
            user_node = user.architype;
            self.profiles.append(
                {"name": user_node.username, "id": jid(user_node)}
            );
        }
        report self.profiles;
    }
}

walker follow_request  { #spawn profile
    has profile_id: str;
}

walker un_follow_request { #spawn profile
    has profile_id: str;
}

walker create_tweet { #spawn at profile
    has content: str;

    can tweet with profile entry {
        tweet_node = here +:post:+> tweet(content=self.content);
        logger.info(f"Creating new tweet: {self.content}");
        Jac.unrestrict(tweet_node[0], level="CONNECT");
        report tweet_node;
    }
}

walker update_tweet { #spawn at tweet
    has updated_content: str;
}

walker remove_tweet { } #spawn at tweet

walker like_tweet { #spawn profile
    has tweet_id: str;
}

walker remove_like { #spawn profile
    has tweet_id: str;
}

walker comment_tweet { #spawn at profile
    has tweet_id: str;
    has content: str;

    can add_comment with profile entry {
        comment_node = here ++> comment(content=self.content);
        tweet_node = &self.tweet_id;
        tweet_node ++> comment_node[0];
        logger.info(f"comment added: {comment_node[0]}");
        report comment_node[0];
    }
}

walker load_tweets{ #spawn at profile
    has if_report: bool = False;
    has tweets: list = [];

    can go_to_tweet with profile entry {
        visit [-->](`?tweet);
    }

    can add with tweet entry{
        self.tweets.append(here.tweet_info);
        if self.if_report {
            report self.tweets;
        }
    }
}

walker load_feed  { #spawn at profile
    has search_query: str = "";

    can load with profile entry {
        self.feeds: list = [];
        user_tweets = here spawn load_tweets();
        self.feeds.extend(user_tweets.tweets);
        
        for user in here.followees {
            user_node = &user;
            user_tweets = user_node spawn load_tweets();
            self.feeds.extend(user_tweets.tweets);
        }
        tweets = [feed.get("content") for feed in self.feeds];
        self.summary: str = summarise_tweets(tweets);

        # Filter tweets based on search query
        if (self.search_query) {
            tweet_embeddings = model.encode(tweets);
            filtered_results = search_tweets(
                self.search_query,
                self.feeds,
                tweet_embeddings
            );
            report {"feeds": filtered_results, "summary": self.summary};
        } else {
            report {"feeds": self.feeds, "summary": self.summary};
        }
    }
}
