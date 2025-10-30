import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Mail, User as UserIcon, Calendar, Database, CheckCircle2, CrownIcon, Shield } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User, NewsletterSubscriber, Subscription } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Admin() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [courseSeeded, setCourseSeeded] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("premium");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showTestUsers, setShowTestUsers] = useState(true);
  const [showTestSubscribers, setShowTestSubscribers] = useState(true);
  
  // Check if current user is admin
  const isCurrentUserAdmin = user?.isAdmin === "true";

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const { data: subscribers, isLoading: subscribersLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin/newsletter/subscribers"],
    retry: false,
  });

  // Fetch current user subscription
  const { data: currentSubscription, refetch: refetchSubscription } = useQuery<Subscription>({
    queryKey: ["/api/subscription"],
    retry: false,
  });

  // Check if course already exists
  const { data: courses } = useQuery<any[]>({
    queryKey: ["/api/courses"],
    retry: false,
  });

  const courseExists = courses?.some((c: any) => c.title === "Awakening to Consciousness");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Logging you in...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  useEffect(() => {
    if (error && error instanceof Error && isUnauthorizedError(error)) {
      toast({
        title: "Session Expired",
        description: "Logging you back in...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  // Check if user is admin (403 Forbidden means not admin)
  useEffect(() => {
    if (error && error instanceof Error && error.message.includes("403")) {
      toast({
        title: "Access Denied",
        description: "You do not have admin access to this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, [error, toast]);

  const exportUsersToCSV = () => {
    if (!users || users.length === 0) return;

    const headers = ["Email", "First Name", "Last Name", "Location", "Age", "Is Test User", "Created At"];
    const rows = users.map(user => [
      user.email || "",
      user.firstName || "",
      user.lastName || "",
      user.location || "",
      user.age || "",
      user.isTestUser === "true" ? "Yes" : "No",
      user.createdAt ? new Date(user.createdAt).toISOString() : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapha-lumina-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${users.length} users to CSV`,
    });
  };

  const exportSubscribersToCSV = () => {
    if (!subscribers || subscribers.length === 0) return;

    const headers = ["Email", "First Name", "Last Name", "Location", "Date of Birth", "Is Test User", "Subscribed At"];
    const rows = subscribers.map((sub: any) => [
      sub.email,
      sub.firstName || "",
      sub.lastName || "",
      sub.location || "",
      sub.dateOfBirth || "",
      sub.isTestUser === 'true' ? "Yes" : "No",
      sub.subscribedAt ? new Date(sub.subscribedAt).toISOString() : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapha-lumina-newsletter-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${subscribers.length} newsletter subscribers to CSV`,
    });
  };

  const seedCourseMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/seed-course");
      return await res.json();
    },
    onSuccess: (data: any) => {
      setCourseSeeded(true);
      
      // Invalidate course queries to refresh the data
      import("@/lib/queryClient").then(({ queryClient }) => {
        queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
        queryClient.invalidateQueries({ queryKey: ["/api/my-courses"] });
      });

      toast({
        title: data.alreadyExists ? "Course Already Exists" : "Course Seeded Successfully",
        description: data.alreadyExists 
          ? "Awakening to Consciousness course is already in the database"
          : "Awakening to Consciousness course with 5 modules and 15 lessons has been added to the database",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Seeding Failed",
        description: error.message || "Failed to seed course data",
        variant: "destructive",
      });
    },
  });

  const grantPremiumMutation = useMutation({
    mutationFn: async ({ tier, userId }: { tier: string; userId?: string }) => {
      const res = await apiRequest("POST", "/api/admin/grant-premium", { tier, userId });
      return await res.json();
    },
    onSuccess: (data: any) => {
      refetchSubscription();
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      
      const tierName = data.subscription.tier === "transformation" 
        ? "Transformation Package" 
        : data.subscription.tier.charAt(0).toUpperCase() + data.subscription.tier.slice(1);
      
      toast({
        title: "Subscription Updated",
        description: `Successfully granted ${tierName} access with ${data.subscription.chatLimit} chat limit`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Subscription",
        description: error.message || "Failed to grant premium access",
        variant: "destructive",
      });
    },
  });

  const toggleUserTestStatusMutation = useMutation({
    mutationFn: async ({ userId, isTestUser }: { userId: string; isTestUser: "true" | "false" }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}/test-status`, { isTestUser });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Status Updated",
        description: "User test status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Status",
        description: error.message || "Failed to update user test status",
        variant: "destructive",
      });
    },
  });

  const toggleSubscriberTestStatusMutation = useMutation({
    mutationFn: async ({ subscriberId, isTestUser }: { subscriberId: string; isTestUser: "true" | "false" }) => {
      const res = await apiRequest("PATCH", `/api/admin/subscribers/${subscriberId}/test-status`, { isTestUser });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter/subscribers"] });
      toast({
        title: "Status Updated",
        description: "Subscriber test status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Status",
        description: error.message || "Failed to update subscriber test status",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading || subscribersLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage users, newsletter subscribers, and course data
              </p>
            </div>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Course Database Setup
                  </CardTitle>
                  <CardDescription>
                    Seed the database with Awakening to Consciousness course
                  </CardDescription>
                </div>
                <Button
                  onClick={() => seedCourseMutation.mutate()}
                  disabled={seedCourseMutation.isPending || courseSeeded || courseExists}
                  data-testid="button-seed-course"
                >
                  {seedCourseMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Seeding...
                    </>
                  ) : courseExists || courseSeeded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Course Already Seeded
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Seed Course Data
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Course:</strong> Awakening to Consciousness
                </p>
                <p>
                  <strong className="text-foreground">Content:</strong> 5 modules, 15 lessons
                </p>
                <p>
                  <strong className="text-foreground">Price:</strong> $50 USD / R500 ZAR
                </p>
                <p className="text-xs pt-2">
                  Click the button above to populate the database with the complete course structure including all modules and lessons.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ADMIN ONLY: Premium Access Management */}
          {isCurrentUserAdmin && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" />
                      Grant User Access
                    </CardTitle>
                    <CardDescription>
                      Select a real user and grant them premium or transformation access
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Select User (Real Users Only)
                      </label>
                      <Select
                        value={selectedUserId}
                        onValueChange={setSelectedUserId}
                      >
                        <SelectTrigger data-testid="select-user-email">
                          <SelectValue placeholder="Choose a user..." />
                        </SelectTrigger>
                        <SelectContent>
                          {users?.filter(u => u.isTestUser !== "true").map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Select Tier
                      </label>
                      <Select
                        value={selectedTier}
                        onValueChange={setSelectedTier}
                      >
                        <SelectTrigger data-testid="select-subscription-tier">
                          <SelectValue placeholder="Select a tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free (5 chats)</SelectItem>
                          <SelectItem value="premium">Premium (10 chats - $29/mo)</SelectItem>
                          <SelectItem value="transformation">Transformation (Unlimited - $497)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (!selectedUserId) {
                        toast({
                          title: "No User Selected",
                          description: "Please select a user first",
                          variant: "destructive",
                        });
                        return;
                      }
                      grantPremiumMutation.mutate({ tier: selectedTier, userId: selectedUserId });
                    }}
                    disabled={grantPremiumMutation.isPending || !selectedUserId}
                    className="w-full"
                    data-testid="button-grant-premium"
                  >
                    {grantPremiumMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Grant Access
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                    <strong className="text-foreground">Admin Control:</strong> Select a real user from the dropdown and grant them premium or transformation tier access. This allows you to manually upgrade users for testing or special cases.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>
                  {users?.length || 0} total users ({users?.filter(u => u.isTestUser === "true").length || 0} marked as test users)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTestUsers(!showTestUsers)}
                  data-testid="button-toggle-test-users"
                >
                  {showTestUsers ? "Hide" : "Show"} Test Users
                </Button>
                <Button
                  onClick={exportUsersToCSV}
                  disabled={!users || users.length === 0}
                  data-testid="button-export-users-csv"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Test User</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users
                      .filter(u => showTestUsers || u.isTestUser !== "true")
                      .map((user) => (
                      <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                        <TableCell className="font-mono text-sm">{user.email || "—"}</TableCell>
                        <TableCell>{user.firstName || "—"}</TableCell>
                        <TableCell>{user.lastName || "—"}</TableCell>
                        <TableCell>{user.location || "—"}</TableCell>
                        <TableCell>{user.age || "—"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toggleUserTestStatusMutation.mutate({
                                userId: user.id,
                                isTestUser: user.isTestUser === "true" ? "false" : "true"
                              });
                            }}
                            disabled={toggleUserTestStatusMutation.isPending}
                            className={user.isTestUser === "true" 
                              ? "text-xs px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30" 
                              : "text-xs px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30"
                            }
                            data-testid={`button-toggle-user-status-${user.id}`}
                          >
                            {user.isTestUser === "true" ? "Test User" : "Real User"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>
                  {subscribers?.length || 0} total subscribers ({subscribers?.filter((s: any) => s.isTestUser === 'true').length || 0} marked as test users)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTestSubscribers(!showTestSubscribers)}
                  data-testid="button-toggle-test-subscribers"
                >
                  {showTestSubscribers ? "Hide" : "Show"} Test Users
                </Button>
                <Button
                  onClick={exportSubscribersToCSV}
                  disabled={!subscribers || subscribers.length === 0}
                  data-testid="button-export-subscribers-csv"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Test User</TableHead>
                    <TableHead>Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers && subscribers.length > 0 ? (
                    subscribers
                      .filter(s => showTestSubscribers || s.isTestUser !== "true")
                      .map((subscriber) => (
                      <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id}`}>
                        <TableCell className="font-mono text-sm">{subscriber.email}</TableCell>
                        <TableCell>{subscriber.firstName || "—"}</TableCell>
                        <TableCell>{subscriber.lastName || "—"}</TableCell>
                        <TableCell>{subscriber.location || "—"}</TableCell>
                        <TableCell>{subscriber.dateOfBirth || "—"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toggleSubscriberTestStatusMutation.mutate({
                                subscriberId: subscriber.id,
                                isTestUser: subscriber.isTestUser === "true" ? "false" : "true"
                              });
                            }}
                            disabled={toggleSubscriberTestStatusMutation.isPending}
                            className={subscriber.isTestUser === "true" 
                              ? "text-xs px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30" 
                              : "text-xs px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30"
                            }
                            data-testid={`button-toggle-subscriber-status-${subscriber.id}`}
                          >
                            {subscriber.isTestUser === "true" ? "Test User" : "Real User"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No subscribers yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Privacy Notice</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              This data is collected through Replit Auth (for users) and newsletter signups. Please ensure you
              comply with relevant data protection regulations (GDPR, CCPA, etc.) and have a
              privacy policy that explains how you use this data.
            </p>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
