import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  User, BookOpen, Play, Brain, Music, Headphones, Edit, Save, X,
  CheckCircle2, Circle, Award, TrendingUp, Clock, Target,
  ChevronRight, Volume2, Pause, SkipBack, SkipForward
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { User as UserType, Course, Flashcard, MeditationTrack, MusicTrack, Enrollment, StudentProgress } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Academy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    age: "",
    profileImageUrl: "",
  });
  const [selectedCourseForFlashcards, setSelectedCourseForFlashcards] = useState<string>("");
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MeditationTrack | MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ["/api/auth/user"],
  });

  // Fetch enrolled courses
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: ["/api/my-courses"],
    enabled: !!user,
  });

  // Fetch all courses
  const { data: allCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Fetch meditation tracks
  const { data: meditationTracks = [] } = useQuery<MeditationTrack[]>({
    queryKey: ["/api/meditation"],
    enabled: !!user,
  });

  // Fetch music tracks
  const { data: musicTracks = [] } = useQuery<MusicTrack[]>({
    queryKey: ["/api/music"],
    enabled: !!user,
  });

  // Fetch flashcards for selected course
  const { data: flashcards = [] } = useQuery<Flashcard[]>({
    queryKey: [`/api/flashcards/course/${selectedCourseForFlashcards}`],
    enabled: !!selectedCourseForFlashcards,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: typeof profileData) => {
      let finalImageUrl = data.profileImageUrl;
      
      // If there's an image file, convert to base64 for storage
      // In production, you would upload to Replit Object Storage, S3, or Cloudinary
      if (imageFile) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
        finalImageUrl = base64;
      }
      
      return await apiRequest(`/api/profile`, "PUT", {
        ...data,
        profileImageUrl: finalImageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setEditingProfile(false);
      setImageFile(null);
      setImagePreview("");
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Derive enrolled courses from data (must be before early returns)
  const enrolledCourses = allCourses?.filter(course =>
    enrollments?.some(e => e.courseId === course.id)
  ) || [];

  // Initialize profile data when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        location: user.location || "",
        age: user.age || "",
        profileImageUrl: user.profileImageUrl || "",
      });
      setImagePreview(user.profileImageUrl || "");
    }
  }, [user]);

  // Initialize flashcards with first enrolled course
  useEffect(() => {
    if (enrolledCourses.length > 0 && !selectedCourseForFlashcards) {
      setSelectedCourseForFlashcards(enrolledCourses[0].id);
    }
  }, [enrolledCourses, selectedCourseForFlashcards]);

  // Audio player controls
  const playTrack = (track: MeditationTrack | MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-muted-foreground">Loading Academy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Welcome to Rapha Lumina Academy</CardTitle>
              <CardDescription>Please log in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/")}>Go to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 to-purple-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-4xl mb-2">
                Welcome back, {user.firstName || 'Student'}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Continue your journey of spiritual awakening and transformation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px]" data-testid="tabs-academy">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="flashcards" data-testid="tab-flashcards">
              <Brain className="h-4 w-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="meditation" data-testid="tab-meditation">
              <Headphones className="h-4 w-4 mr-2" />
              Meditation
            </TabsTrigger>
            <TabsTrigger value="music" data-testid="tab-music">
              <Music className="h-4 w-4 mr-2" />
              Music
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card data-testid="card-enrolled-courses">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display">{enrolledCourses.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {enrolledCourses.length === 1 ? 'course' : 'courses'} in progress
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-meditation-sessions">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meditation Library</CardTitle>
                  <Headphones className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display">{meditationTracks.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    guided meditations available
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-music-tracks">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Music Collection</CardTitle>
                  <Music className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display">{musicTracks.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ambient tracks for focus
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access - My Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  My Courses
                </CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                    <Button onClick={() => setActiveTab("courses")} data-testid="button-browse-courses">
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                      onClick={() => setLocation(`/lms-dashboard?courseId=${course.id}`)}
                      data-testid={`course-card-${course.id}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {course.thumbnail && (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{course.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {course.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                  {!editingProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProfile(true)}
                      data-testid="button-edit-profile"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={imagePreview || user.profileImageUrl || undefined} />
                    <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                  </Avatar>
                  {editingProfile && (
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                        <Input
                          id="profileImageUrl"
                          placeholder="https://..."
                          value={profileData.profileImageUrl}
                          onChange={(e) =>
                            setProfileData({ ...profileData, profileImageUrl: e.target.value })
                          }
                          data-testid="input-profile-image-url"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profileImageFile">Or Upload Image</Label>
                        <Input
                          id="profileImageFile"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          data-testid="input-profile-image-file"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {editingProfile ? (
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, firstName: e.target.value })
                        }
                        data-testid="input-first-name"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.firstName || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {editingProfile ? (
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, lastName: e.target.value })
                        }
                        data-testid="input-last-name"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.lastName || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {editingProfile ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({ ...profileData, location: e.target.value })
                        }
                        data-testid="input-location"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.location || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    {editingProfile ? (
                      <Input
                        id="age"
                        value={profileData.age}
                        onChange={(e) =>
                          setProfileData({ ...profileData, age: e.target.value })
                        }
                        data-testid="input-age"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.age || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-sm py-2">{user.email}</p>
                  </div>
                </div>

                {editingProfile && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateProfile.mutate(profileData)}
                      disabled={updateProfile.isPending}
                      data-testid="button-save-profile"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileData({
                          firstName: user.firstName || "",
                          lastName: user.lastName || "",
                          location: user.location || "",
                          age: user.age || "",
                          profileImageUrl: user.profileImageUrl || "",
                        });
                      }}
                      data-testid="button-cancel-edit"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses?.map((course) => {
                const isEnrolled = enrollments?.some(e => e.courseId === course.id);
                return (
                  <Card key={course.id} className="overflow-hidden" data-testid={`course-${course.id}`}>
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        {isEnrolled && (
                          <Badge variant="secondary" data-testid={`badge-enrolled-${course.id}`}>
                            Enrolled
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.totalLessons}
                        </span>
                      </div>
                      <Button
                        className="w-full"
                        variant={isEnrolled ? "default" : "outline"}
                        onClick={() =>
                          isEnrolled
                            ? setLocation(`/lms-dashboard?courseId=${course.id}`)
                            : setLocation(`/course-detail?id=${course.id}`)
                        }
                        data-testid={`button-course-${course.id}`}
                      >
                        {isEnrolled ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </>
                        ) : (
                          "View Details"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Flashcards
                </CardTitle>
                <CardDescription>
                  Master key concepts with interactive flashcards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      Flashcards will be available once you enroll in a course
                    </p>
                    <Button onClick={() => setActiveTab("courses")} data-testid="button-view-courses-flashcards">
                      View Courses
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Course Selector */}
                    <div>
                      <Label htmlFor="flashcard-course">Select Course</Label>
                      <select
                        id="flashcard-course"
                        className="w-full mt-2 px-3 py-2 border rounded-md bg-background"
                        value={selectedCourseForFlashcards}
                        onChange={(e) => {
                          setSelectedCourseForFlashcards(e.target.value);
                          setCurrentFlashcardIndex(0);
                          setShowFlashcardAnswer(false);
                        }}
                        data-testid="select-flashcard-course"
                      >
                        {enrolledCourses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Flashcard Display */}
                    {flashcards.length === 0 ? (
                      <div className="text-center py-12">
                        <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          No flashcards available for this course yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center text-sm text-muted-foreground">
                          Flashcard {currentFlashcardIndex + 1} of {flashcards.length}
                        </div>

                        {/* Flashcard */}
                        <Card
                          className="cursor-pointer hover-elevate active-elevate-2 min-h-[300px] flex items-center justify-center"
                          onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                          data-testid="flashcard-card"
                        >
                          <CardContent className="p-12 text-center">
                            {!showFlashcardAnswer ? (
                              <div className="space-y-4">
                                <Badge variant="secondary">Question</Badge>
                                <p className="text-xl font-semibold">
                                  {flashcards[currentFlashcardIndex].question}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Click to reveal answer
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Badge variant="default">Answer</Badge>
                                <p className="text-xl">
                                  {flashcards[currentFlashcardIndex].answer}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Click to hide answer
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Navigation */}
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            disabled={currentFlashcardIndex === 0}
                            onClick={() => {
                              setCurrentFlashcardIndex(currentFlashcardIndex - 1);
                              setShowFlashcardAnswer(false);
                            }}
                            data-testid="button-flashcard-prev"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCurrentFlashcardIndex(0);
                              setShowFlashcardAnswer(false);
                            }}
                            data-testid="button-flashcard-shuffle"
                          >
                            Reset
                          </Button>
                          <Button
                            variant="outline"
                            disabled={currentFlashcardIndex === flashcards.length - 1}
                            onClick={() => {
                              setCurrentFlashcardIndex(currentFlashcardIndex + 1);
                              setShowFlashcardAnswer(false);
                            }}
                            data-testid="button-flashcard-next"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Guided Meditation
                </CardTitle>
                <CardDescription>
                  Find peace and clarity with our curated meditation library
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meditationTracks.length === 0 ? (
                  <div className="text-center py-12">
                    <Headphones className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      Meditation tracks will be available soon
                    </p>
                  </div>
                ) : (
                  meditationTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                      onClick={() => playTrack(track)}
                      data-testid={`meditation-track-${track.id}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {track.thumbnail && (
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">{track.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{track.category}</Badge>
                            <span className="text-xs text-muted-foreground">{track.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Focus Music
                </CardTitle>
                <CardDescription>
                  Enhance your study and meditation with ambient soundscapes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {musicTracks.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      Music tracks will be available soon
                    </p>
                  </div>
                ) : (
                  musicTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                      onClick={() => playTrack(track)}
                      data-testid={`music-track-${track.id}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {track.thumbnail && (
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{track.title}</h3>
                          {track.artist && (
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{track.category}</Badge>
                            <span className="text-xs text-muted-foreground">{track.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Audio Player */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-lg">
            <div className="container mx-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {currentTrack.thumbnail && (
                    <img
                      src={currentTrack.thumbnail}
                      alt={currentTrack.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{currentTrack.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {"artist" in currentTrack ? currentTrack.artist : currentTrack.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" data-testid="button-skip-back">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={togglePlay} data-testid="button-play-pause">
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button size="icon" variant="ghost" data-testid="button-skip-forward">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCurrentTrack(null)}
                    data-testid="button-close-player"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </div>
    </div>
  );
}
