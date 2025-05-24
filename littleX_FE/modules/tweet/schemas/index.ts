import { z } from "zod";

export const TweetNodeSchema = z.object({
  id: z.string(),
  content: z.string(),
  embedding: z.array(z.number()),
  created_at: z.string(), // Consider using z.coerce.date() if you want Date object
});

export type Tweet = z.infer<typeof TweetNodeSchema>;
