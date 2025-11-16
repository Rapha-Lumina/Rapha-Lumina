
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, ChevronRight, Download, Award, Play, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: string;
  order: string;
}

interface Module {
  id: string;
  moduleNumber: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

interface Progress {
  lessonId: string;
  completed: string;
  lastWatchedPosition: string;
}

export default function LMSDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const courseId = new URLSearchParams(window.location.search).get("courseId");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [videoPosition, setVideoPosition] = useState(0);

  // Fetch course details
  const { data: courseData, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  // Fetch user's progress
  const { data: progressData } = useQuery<Progress[]>({
    queryKey: [`/api/progress/${courseId}`],
    enabled: !!courseId,
  });

  // Update progress mutation
  const updateProgress = useMutation({
    mutationFn: async ({ lessonId, completed }: { lessonId: string; completed: boolean }) => {
      const response = await fetch(`/api/progress/${lessonId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed, lastWatchedPosition: videoPosition }),
      });
      if (!response.ok) throw new Error("Failed to update progress");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${courseId}`] });
      toast({
        title: "Progress updated",
        description: "Your lesson progress has been saved.",
      });
    },
  });

  // Auto-select first lesson
  useEffect(() => {
    if (courseData && !selectedLesson) {
      const firstLesson = courseData.modules[0]?.lessons[0];
      if (firstLesson) {
        setSelectedLesson(firstLesson);
      }
    }
  }, [courseData, selectedLesson]);

  if (!courseId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Course Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Please select a course to continue.</p>
              <Button onClick={() => setLocation("/courses")}>Browse Courses</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Course Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">The requested course could not be found.</p>
              <Button onClick={() => setLocation("/courses")}>Browse Courses</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalLessons = courseData.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = progressData?.filter(p => p.completed === "true").length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isLessonCompleted = (lessonId: string) => progressData?.find(p => p.lessonId === lessonId)?.completed === "true";
  const allLessonsCompleted = completedLessons === totalLessons && totalLessons > 0;

  const handleMarkComplete = () => {
    if (selectedLesson) {
      updateProgress.mutate({ lessonId: selectedLesson.id, completed: true });
    }
  };

  const getNextLesson = () => {
    if (!selectedLesson) return null;
    
    for (const module of courseData.modules) {
      const currentIndex = module.lessons.findIndex(l => l.id === selectedLesson.id);
      if (currentIndex !== -1) {
        if (currentIndex < module.lessons.length - 1) {
          return module.lessons[currentIndex + 1];
        }
        // Move to next module
        const moduleIndex = courseData.modules.findIndex(m => m.id === module.id);
        if (moduleIndex < courseData.modules.length - 1) {
          return courseData.modules[moduleIndex + 1].lessons[0];
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-muted/30 overflow-y-auto">
          <div className="p-6">
            <h2 className="font-display text-2xl mb-2">{courseData.title}</h2>
            <div className="space-y-2 mb-6">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>

            <Separator className="my-6" />

            {/* Modules and Lessons */}
            <div className="space-y-6">
              {courseData.modules.map((module, moduleIdx) => (
                <div key={module.id}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-primary">Module {module.moduleNumber}</span>
                    <span>{module.title}</span>
                  </h3>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const completed = isLessonCompleted(lesson.id);
                      const isSelected = selectedLesson?.id === lesson.id;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{lesson.title}</p>
                            <p className="text-xs opacity-70">{lesson.duration}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* Video Player */}
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      {selectedLesson.videoUrl ? (
                        <video
                          controls
                          className="w-full h-full rounded-lg"
                          src={selectedLesson.videoUrl}
                          onTimeUpdate={(e) => setVideoPosition(Math.floor((e.target as HTMLVideoElement).currentTime))}
                        >
                          Your browser does not support video playback.
                        </video>
                      ) : (
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Video coming soon</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Info */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Lesson {selectedLesson.order}
                      </Badge>
                      <h1 className="font-display text-3xl mb-2">{selectedLesson.title}</h1>
                      <p className="text-muted-foreground">{selectedLesson.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!isLessonCompleted(selectedLesson.id) && (
                      <Button onClick={handleMarkComplete} disabled={updateProgress.isPending}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </Button>
                    )}
                    {nextLesson && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedLesson(nextLesson)}
                      >
                        Next Lesson
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Course Materials */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Materials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Workbook PDF
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Lesson Notes
                    </Button>
                  </CardContent>
                </Card>

                {/* Certificate */}
                {allLessonsCompleted && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-primary" />
                        Congratulations! 🎉
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        You've completed all lessons in this course. Download your certificate of completion.
                      </p>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Select a lesson from the sidebar to begin</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
