import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MessageSquare, ThumbsUp, Plus, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ForumPost, User } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ForumPostWithUser = ForumPost & { user?: User };

const CATEGORIES = [
  { value: "all", label: "All Discussions" },
  { value: "general", label: "General" },
  { value: "meditation", label: "Meditation" },
  { value: "philosophy", label: "Philosophy" },
  { value: "guidance", label: "Spiritual Guidance" },
  { value: "community", label: "Community" },
];

export default function Forum() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
  });

  const { data: posts, isLoading } = useQuery<ForumPostWithUser[]>({
    queryKey: ["/api/forum/posts"],
    enabled: isAuthenticated,
  });

  const createPostMutation = useMutation({
    mutationFn: async (post: { title: string; content: string; category: string }) => {
      return await apiRequest("POST", "/api/forum/posts", post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setIsDialogOpen(false);
      setNewPost({ title: "", content: "", category: "general" });
      toast({
        title: "Success",
        description: "Your post has been created!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredPosts = posts?.filter(
    (post) => selectedCategory === "all" || post.category === selectedCategory
  );

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

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create posts",
        variant: "destructive",
      });
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">Loading forum...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-foreground" data-testid="text-forum-title">
                Community Forum
              </h1>
              <p className="text-muted-foreground">
                Connect, share, and grow with fellow seekers on the path
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-post">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share your thoughts, questions, or insights with the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="What's on your mind?"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      data-testid="input-post-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newPost.category}
                      onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger data-testid="select-post-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.filter((cat) => cat.value !== "all").map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows={6}
                      data-testid="input-post-content"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel-post"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                    data-testid="button-submit-post"
                  >
                    {createPostMutation.isPending ? "Creating..." : "Create Post"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat.value}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover-elevate"
                  }`}
                  onClick={() => setSelectedCategory(cat.value)}
                  data-testid={`badge-category-${cat.value}`}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link key={post.id} href={`/forum/${post.id}`}>
                <Card className="hover-elevate cursor-pointer transition-all" data-testid={`card-post-${post.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getCategoryBadgeColor(post.category)}>
                            {CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
                          </Badge>
                          {post.isPinned === "true" && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl hover:text-primary transition-colors" data-testid={`text-post-title-${post.id}`}>
                          {post.title}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {post.content.substring(0, 200)}
                          {post.content.length > 200 && "..."}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span data-testid={`text-reply-count-${post.id}`}>{post.replyCount} replies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span data-testid={`text-like-count-${post.id}`}>{post.likeCount} likes</span>
                      </div>
                      <div className="ml-auto">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No posts in this category yet. Be the first to start a discussion!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
