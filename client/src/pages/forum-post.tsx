import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ThumbsUp, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ForumPost, ForumReply } from "@shared/schema";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "meditation", label: "Meditation" },
  { value: "philosophy", label: "Philosophy" },
  { value: "guidance", label: "Spiritual Guidance" },
  { value: "community", label: "Community" },
];

export default function ForumPost() {
  const [, params] = useRoute("/forum/:id");
  const postId = params?.id;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState("");

  const { data: post, isLoading: postLoading } = useQuery<ForumPost>({
    queryKey: ["/api/forum/posts", postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const res = await fetch(`/api/forum/posts/${postId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: !!postId && isAuthenticated,
  });

  const { data: replies, isLoading: repliesLoading } = useQuery<ForumReply[]>({
    queryKey: ["/api/forum/posts", postId, "replies"],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const res = await fetch(`/api/forum/posts/${postId}/replies`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch replies");
      return res.json();
    },
    enabled: !!postId && isAuthenticated,
  });

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!postId) throw new Error("Post ID is required");
      return await apiRequest("POST", `/api/forum/posts/${postId}/replies`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId, "replies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setReplyContent("");
      toast({
        title: "Success",
        description: "Your reply has been posted!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      return await apiRequest("POST", `/api/forum/posts/${postId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
  });

  const likeReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      return await apiRequest("POST", `/api/forum/replies/${replyId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId, "replies"] });
    },
  });

  const handleReply = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to reply to posts",
        variant: "destructive",
      });
      return;
    }
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }
    replyMutation.mutate(replyContent);
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-primary/10 text-primary border-primary/20",
      meditation: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      philosophy: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      guidance: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      community: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    };
    return colors[category] || colors.general;
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Post not found</p>
              <Link href="/forum">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forum
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/forum">
          <Button variant="ghost" className="mb-6" data-testid="button-back-forum">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className={getCategoryBadgeColor(post.category)}>
                {CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
              </Badge>
              {post.isPinned === "true" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Pinned
                </Badge>
              )}
            </div>
            <CardTitle className="text-3xl" data-testid="text-post-title">
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
              <span>
                Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none mb-6" data-testid="text-post-content">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likePostMutation.mutate()}
                disabled={likePostMutation.isPending}
                data-testid="button-like-post"
                className="hover-elevate"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {post.likeCount} likes
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span data-testid="text-reply-count">{post.replyCount} replies</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Add a Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              className="mb-4"
              data-testid="input-reply-content"
            />
            <Button
              onClick={handleReply}
              disabled={replyMutation.isPending}
              data-testid="button-submit-reply"
            >
              {replyMutation.isPending ? "Posting..." : "Post Reply"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Replies ({replies?.length || 0})</h2>
          {repliesLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Loading replies...</p>
              </CardContent>
            </Card>
          ) : replies && replies.length > 0 ? (
            replies.map((reply) => (
              <Card key={reply.id} data-testid={`card-reply-${reply.id}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-2 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </div>
                      <div className="prose dark:prose-invert max-w-none mb-4" data-testid={`text-reply-content-${reply.id}`}>
                        <p className="whitespace-pre-wrap">{reply.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeReplyMutation.mutate(reply.id)}
                        disabled={likeReplyMutation.isPending}
                        data-testid={`button-like-reply-${reply.id}`}
                        className="hover-elevate"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {reply.likeCount} likes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No replies yet. Be the first to share your thoughts!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
