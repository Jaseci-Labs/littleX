import {
  EditIcon,
  Heart,
  MessageCircle,
  Trash2Icon,
  Send,
  X,
  MoreVertical,
  Share2,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../atoms/card";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { EditTweetDialog } from "../molecules/edit-tweet-dialog";
import { User } from "@/store/tweetSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../atoms/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../atoms/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../atoms/collapsible";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Textarea } from "../atoms/textarea";
import { JSX, useState } from "react";
import { useAppDispatch } from "@/store/useStore";
import {
  deleteTweetAction,
  likeTweetAction,
  removeLikeAction,
  addCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/modules/tweet";
import { Comment } from "@/nodes/tweet-node";
import { cn } from "@/_core/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../atoms/dropdown-menu";
import { getTimeDifference } from "@/modules/tweet/utils";

// Define interfaces
export interface TweetCardProps {
  id: string;
  username: string;
  content: string;
  likes: string[];
  comments: Comment[];
  profile: User;
  created_at?: string;
}

interface LikesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  likes: string[];
}

interface CommentsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  comments: Comment[];
  loginUsername: string;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (commentId: string) => void;
  commentInputValue: string;
  setCommentInputValue: (value: string) => void;
  handleSubmitComment: () => void;
  editingComment: Comment | null;
  onCancelEdit: () => void;
}

interface ActionDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  menuWidth?: string;
  iconSize?: number;
}

// Extracted dialog components
function LikesDialog({
  isOpen,
  onOpenChange,
  likes,
}: LikesDialogProps): JSX.Element {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Liked by</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {likes.length > 0 ? (
            likes.map((likeUsername, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${likeUsername}`}
                  />
                  <AvatarFallback className="text-xs">
                    {likeUsername[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{likeUsername}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No likes yet
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommentsDialog({
  isOpen,
  onOpenChange,
  comments,
  loginUsername,
  onEditComment,
  onDeleteComment,
  commentInputValue,
  setCommentInputValue,
  handleSubmitComment,
  editingComment,
  onCancelEdit,
}: CommentsDialogProps): JSX.Element {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {comments.length > 0 ? (
            <div className="overflow-y-auto pr-1 max-h-[60vh]">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${comment?.username}`}
                    />
                    <AvatarFallback className="text-xs">
                      {comment.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted/30 rounded-lg px-3 py-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">
                          {comment.username}
                        </span>
                        {comment.username.toLowerCase() ===
                          loginUsername.toLowerCase() && (
                          <ActionDropdown
                            onEdit={() => onEditComment(comment)}
                            onDelete={() => onDeleteComment(comment.id)}
                          />
                        )}
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                    <div className="flex gap-4 mt-1 ml-1">
                      <button className="text-xs text-muted-foreground hover:text-foreground">
                        Like
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-foreground">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        {/* Comment input section */}
        <div className="py-3 border-t border-border">
          {editingComment && (
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Editing comment
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelEdit}
                className="h-6 px-2"
              >
                <X className="size-3" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${loginUsername}`}
              />
              <AvatarFallback>{loginUsername[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              type="text"
              value={commentInputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCommentInputValue(e.target.value)
              }
              placeholder={
                editingComment ? "Edit your comment..." : "Add a comment..."
              }
              className="flex-1 h-9 bg-background text-sm border border-input rounded-full px-3 py-1.5 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              className="rounded-full h-9 px-2.5 text-primary-foreground"
              onClick={handleSubmitComment}
              disabled={!commentInputValue.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ActionDropdown({
  onEdit,
  onDelete,
  menuWidth = "w-20",
  iconSize = 4,
}: ActionDropdownProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className={`text-muted-foreground size-${iconSize}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={menuWidth}>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit}>
            Edit
            <DropdownMenuShortcut>
              <EditIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            Delete
            <DropdownMenuShortcut>
              <Trash2Icon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TweetCard({
  id,
  username,
  content,
  likes,
  comments,
  profile,
  created_at,
}: TweetCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isLikesDialogOpen, setIsLikesDialogOpen] = useState<boolean>(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] =
    useState<boolean>(false);

  // Combined state for both adding and editing comments
  const [commentInputValue, setCommentInputValue] = useState<string>("");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  const loginUsername: string = profile.username;
  const liked: boolean = !!likes.find(
    (person) => person.toLowerCase() === loginUsername.toLowerCase()
  );

  const handleLike = (id: string): void => {
    if (liked) {
      dispatch(removeLikeAction({ id, username: loginUsername }));
    } else {
      dispatch(likeTweetAction({ id, username: loginUsername }));
    }
  };

  const handleSubmitComment = (): void => {
    if (!commentInputValue.trim()) return;

    if (editingComment) {
      // Editing existing comment
      dispatch(
        updateCommentAction({
          tweetId: id,
          id: editingComment.id,
          username: loginUsername,
          content: commentInputValue.trim(),
        })
      );
      setEditingComment(null);
    } else {
      // Adding new comment
      dispatch(
        addCommentAction({
          tweetId: id,
          username: loginUsername,
          content: commentInputValue.trim(),
        })
      );
    }
    setCommentInputValue("");
  };

  const handleDeleteComment = (commentId: string): void => {
    dispatch(deleteCommentAction({ tweetId: id, id: commentId }));
  };

  const openEditComment = (comment: Comment): void => {
    setEditingComment(comment);
    setCommentInputValue(comment.content);
  };

  const cancelEditComment = (): void => {
    setEditingComment(null);
    setCommentInputValue("");
  };
  const timeAgo = created_at
    ? getTimeDifference(created_at)
    : getTimeDifference(new Date().toUTCString());
  return (
    <>
      <Card className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <CardHeader className="p-4 flex flex-row justify-between w-full items-start">
          <div className="flex gap-3">
            <Avatar className="size-8">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${username}`} />
              <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground">{username}</h3>
              <p className="text-sm text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          {username.toLowerCase() === loginUsername.toLowerCase() && (
            <ActionDropdown
              onEdit={() => setIsEditDialogOpen(true)}
              onDelete={() => dispatch(deleteTweetAction(id))}
            />
          )}
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <p className="text-card-foreground mb-2 whitespace-pre-wrap wrap">
            {content}
          </p>
          {/* <div className="flex flex-wrap gap-1.5 mb-3">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <span
                  key={index}
                  className="text-primary hover:underline cursor-pointer text-sm"
                >
                  #tag
                </span>
              ))}
          </div> */}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch p-0">
          <div className="border-t border-border px-4 py-3 ">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Heart
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleLike(id);
                  }}
                  size={18}
                  fill={liked ? "hsl(22, 89%, 52%)" : "none"}
                  className="mr-1"
                />
                <button
                  onClick={() => setIsLikesDialogOpen(true)}
                  className={`hover:text-foreground text-nowrap ${
                    liked ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {likes.length} Likes
                </button>
              </div>

              <button
                onClick={() => setIsCommentsDialogOpen(true)}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <MessageSquare size={18} className="mr-1" />
                <span className="text-nowrap">{comments.length} Comments</span>
              </button>
            </div>
          </div>
          {/* Quick add comment */}
          <div className="px-4 py-3 border-t border-border flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${loginUsername}`}
              />
              <AvatarFallback>{loginUsername[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              type="text"
              value={commentInputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCommentInputValue(e.target.value)
              }
              placeholder="Add a comment..."
              className="flex-1 h-9 bg-background text-sm border border-input rounded-full px-3 py-1.5 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              className="rounded-full h-9 px-2.5 text-primary-foreground"
              onClick={handleSubmitComment}
              disabled={!commentInputValue.trim()}
            >
              <Send className="size-4 " />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialogs */}
      <EditTweetDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        tweetId={id}
        initialContent={content}
      />

      <LikesDialog
        isOpen={isLikesDialogOpen}
        onOpenChange={setIsLikesDialogOpen}
        likes={likes}
      />

      <CommentsDialog
        isOpen={isCommentsDialogOpen}
        onOpenChange={setIsCommentsDialogOpen}
        comments={comments}
        loginUsername={loginUsername}
        onEditComment={openEditComment}
        onDeleteComment={handleDeleteComment}
        commentInputValue={commentInputValue}
        setCommentInputValue={setCommentInputValue}
        handleSubmitComment={handleSubmitComment}
        editingComment={editingComment}
        onCancelEdit={cancelEditComment}
      />
    </>
  );
}
