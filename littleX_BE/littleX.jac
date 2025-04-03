import:py datetime;
import:py from jac_cloud.core.architype { NodeAnchor }
#import:py from mtllm.llms { Ollama, OpenAI }
import:py numpy;
import:py from sentence_transformers { SentenceTransformer }
import:py from sklearn.metrics.pairwise { cosine_similarity }

# glob llm_open_ai = OpenAI(model_name="gpt-4o");
# glob llm_ollama = Ollama(host="http://127.0.0.1:11434", model_name="llama3.2:1b");
glob sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2');

can search_tweets(query: str, tweet:str) -> int {
    query_embedding = sentence_transformer.encode([query]);
    tweet_embeddings = sentence_transformer.encode([tweet]);
    similarity = cosine_similarity(query_embedding, tweet_embeddings)[0];
    return similarity;
}

# can 'Extract and summarize trending themes, major highlights, and key interactions from recent tweets in one concise sentence.'
# summarize_tweets(tweets: list[str]) -> 'Summarization': str by llm_open_ai();

node Profile {
    has username: str = "";

    can update with update_profile entry {
        self.username = here.new_username;
        report self;
    }

    can get with get_profile entry {
        follwers=[{"id": jid(i), "username": i.username} for i in [self-->(`?Profile)]];
        report {"user": self, "followers": follwers};
    }

    can follow with follow_request entry {
        current_profile = [root-->(`?Profile)];
        current_profile[0] +:Follow():+> self;
        report self;
    }

    can un_follow with un_follow_request entry {
        current_profile = [root-->(`?Profile)];
        follow_edge = [edge current_profile[0] -:Follow:-> self];
        Jac.destroy(follow_edge[0]);
        report self;
    }
}

obj TweetInfo {
    has username: str;
    has id: str;
    has content: str;
    has embedding: list;
    has likes: list;
    has comments: list;
}

node Tweet {
    has content: str;
    has embedding: list;
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");

    can update with update_tweet exit {
        self.content = here.updated_content;
        report self;
    }

    can delete with remove_tweet exit {
        Jac.destroy(self);
    }

    can like_tweet with like_tweet entry {
        current_profile = [root-->(`?Profile)];
        self +:Like():+> current_profile[0];
        report self;
    }

    can remove_like with remove_like entry {
        current_profile = [root-->(`?Profile)];
        like_edge = [edge self -:Like:-> current_profile[0]];
        Jac.destroy(like_edge[0]);
        report self;
    }

    can comment with comment_tweet entry {
        current_profile = [root-->(`?Profile)];
        comment_node = current_profile[0] ++> Comment(content=here.content);
        Jac.unrestrict(comment_node[0], level="CONNECT");
        self ++> comment_node[0];
        report comment_node[0];
    }

    can get_info()-> TweetInfo {
        return TweetInfo(
            username=[self<-:Post:-][0].username,
            id=jid(self),
            content=self.content,
            embedding=self.embedding,
            likes=[i.username for i in [self-:Like:->]],
            comments=[{"username": [i<--(`?Profile)][0].username, "id": jid(i), "content": i.content} for i in [self-->(`?Comment)]]
        );
    }

    can get with load_feed entry {
        tweet_info = self.get_info();
        similarity = search_tweets(here.search_query, tweet_info.content);
        here.results.append({"Tweet_Info": tweet_info, "similarity": similarity});
    }
}

node Comment {
    has content: str;

    can update with update_comment entry {
        self.content = here.updated_content;
        report self;
    }

    can delete with remove_comment entry {
        Jac.destroy(self);
    }
}

edge Follow {}

edge Like {}

edge Post {}

walker visit_profile {
    can visit_profile with `root entry {
        visit [-->(`?Profile)] else {
            new_profile = here ++> Profile();
            Jac.unrestrict(new_profile[0], level="CONNECT");
            visit new_profile;
        }
    }
}

walker update_profile :visit_profile: {
    has new_username: str;
}

walker get_profile :visit_profile: {}

walker load_user_profiles {
    obj __specs__ {
        static has auth: bool = False;
    }
    can load_profiles with `root entry {
        self.profiles: list = [];
        
        for user in NodeAnchor.Collection.find({"name": "Profile"}) {
            user_node = user.architype;
            self.profiles.append(
                {"name": user_node.username, "id": jid(user_node)}
            );
        }
        report self.profiles;
    }
}

walker follow_request {}

walker un_follow_request {}

walker create_tweet :visit_profile: {
    has content: str;

    can tweet with Profile entry {
        embedding = sentence_transformer.encode(self.content).tolist();
        tweet_node = here +:Post:+> Tweet(content=self.content, embedding=embedding);
        Jac.unrestrict(tweet_node[0], level="CONNECT");
        report tweet_node;
    }
}

walker update_tweet {
    has updated_content: str;
}

walker remove_tweet {}

walker like_tweet {}

walker remove_like {}

walker comment_tweet {
    has content: str;
}

walker update_comment {
    has updated_content: str;
}

walker remove_comment {}

walker load_feed :visit_profile: {
    has search_query: str = "";
    has results: list = [];

    can load with Profile entry {
        visit [-->(`?Tweet)];
        for user_node in [-:Follow:->](`?Profile) {
            visit [user_node-->(`?Tweet)];
        }
        report self.results;
    }
}