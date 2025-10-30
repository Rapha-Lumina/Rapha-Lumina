
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, BookOpen, Users, Play, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import courseImg from "@assets/stock_images/online_course_educat_d7aabae3.jpg";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
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
  price: string;
  instructor: string;
  duration: string;
  totalLessons: string;
  level: string;
  thumbnail?: string;
  modules: Module[];
}

interface Enrollment {
  courseId: string;
  status: string;
}

export default function CourseDetail() {
  const [, setLocation] = useLocation();
  const courseId = new URLSearchParams(window.location.search).get("id");

  // Fetch course details
  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  // Fetch user's enrollments
  const { data: enrollments } = useQuery<Enrollment[]>({
    queryKey: ["/api/my-courses"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-4xl mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested course could not be found.</p>
          <Button onClick={() => setLocation("/courses")}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  const isEnrolled = enrollments?.some(e => e.courseId === courseId && e.status === "active");
  const totalDuration = course.modules.reduce((sum, module) => {
    return sum + module.lessons.reduce((lessonSum, lesson) => {
      const minutes = parseInt(lesson.duration) || 0;
      return lessonSum + minutes;
    }, 0);
  }, 0);

  const handleEnroll = () => {
    if (isEnrolled) {
      setLocation(`/lms-dashboard?courseId=${courseId}`);
    } else {
      // Redirect to payment/checkout
      setLocation(`/shop?enroll=${courseId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">{course.level}</Badge>
              <h1 className="font-display text-5xl mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{course.totalLessons}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>By {course.instructor}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">{course.price}</span>
                <Button size="lg" onClick={handleEnroll}>
                  {isEnrolled ? "Continue Learning" : "Enroll Now"}
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={course.thumbnail || courseImg}
                alt={course.title}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Understand the nature of consciousness and self-awareness</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Explore Eastern and Western philosophical perspectives</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Develop a consistent meditation practice</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Integrate consciousness studies into daily life</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Master self-inquiry techniques</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Access transformative states of awareness</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• Open mind and willingness to explore new perspectives</p>
                <p>• No prior meditation or spiritual experience required</p>
                <p>• Commitment to weekly practice and reflection</p>
                <p>• Journal for personal insights and exercises</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            {course.modules.map((module, idx) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Module {module.moduleNumber}: {module.title}</span>
                    <Badge variant="outline">{module.lessons.length} lessons</Badge>
                  </CardTitle>
                  {module.description && (
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.lessons.map((lesson, lessonIdx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isEnrolled || (idx === 0 && lessonIdx < 2) ? (
                            <Play className="w-4 h-4 text-primary" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="instructor">
            <Card>
              <CardHeader>
                <CardTitle>About {course.instructor}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {course.instructor} is a consciousness researcher, meditation teacher, and spiritual guide with over 15 years of experience integrating Eastern and Western wisdom traditions. They have guided thousands of students through transformative journeys of self-discovery and awakening.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Their teaching approach combines rigorous philosophical inquiry with practical meditation techniques, creating a bridge between ancient wisdom and modern understanding. They believe that true transformation comes from direct experience, not just intellectual knowledge.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-12 border-primary">
          <CardContent className="p-8 text-center">
            <h3 className="font-display text-3xl mb-4">Ready to Begin Your Journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of students who have transformed their understanding of consciousness and awakened to their true nature.
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl font-bold">{course.price}</span>
              <Button size="lg" onClick={handleEnroll}>
                {isEnrolled ? "Continue Learning" : "Enroll Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-muted/30 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Rapha Lumina. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
