"use client";

import { useState } from "react";
import { Button } from "@/ds/atoms/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/ds/atoms/form";

import { Textarea } from "@/ds/atoms/textarea";

import { useTweetForm } from "@/modules/tweet/hooks/use-create-tweet";
import { Loader2, Smile, PaperclipIcon, SendHorizonalIcon } from "lucide-react";

interface TweetFormProps {
  onSuccess?: () => void;
}

export function TweetForm({ onSuccess }: TweetFormProps) {
  const { form, onSubmit } = useTweetForm({ onSuccess });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="w-full border-b pb-4 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-3 w-full"
        >
          {/* Paperclip icon */}
          <PaperclipIcon className="mt-4 text-card-foreground" size={16} />

          {/* Main form content */}
          <div className="flex-1 relative">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind right now?"
                      className="w-full !min-h-11 bg-transparent border-0 px-0 py-3 text-base placeholder:text-card-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action buttons row */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 w-10 -ml-9 rounded-full p-0 text-muted-foreground hover:text-foreground"
                onClick={toggleEmojiPicker}
              >
                <Smile size={20} />
              </Button>

              {/* Post button */}
              <Button
                type="submit"
                className="rounded-full px-4 font-bold text-sm"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 size={20} className="animate-spin mr-2" />
                ) : null}
                <span className="-mb-1">Post</span>
                <SendHorizonalIcon size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
