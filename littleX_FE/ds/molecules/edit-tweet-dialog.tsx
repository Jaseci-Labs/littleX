import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../atoms/dialog";
import { Button } from "../atoms/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../atoms/form";
import { Textarea } from "../atoms/textarea";
import { useTweetForm } from "@/modules/tweet/hooks/use-create-tweet";
import { Loader2 } from "lucide-react";

interface EditTweetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tweetId: string;
  initialContent: string;
}

export function EditTweetDialog({
  open,
  onOpenChange,
  tweetId,
  initialContent,
}: EditTweetDialogProps) {
  const { form, onSubmit } = useTweetForm({
    onSuccess: () => onOpenChange(false),
    initialContent,
    mode: "edit",
    tweetId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tweet</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
