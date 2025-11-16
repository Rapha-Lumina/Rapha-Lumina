import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock, Star, Search, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import courseImg from "@assets/stock_images/online_course_educat_d7aabae3.jpg";
import awakeningCourseImg from "@assets/generated_images/Awakening_consciousness_spiritual_course_2d85b4fd.png";

import Screenshot_2025_10_30_211849 from "@assets/Screenshot 2025-10-30 211849.png";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  subscriptionTier: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  totalLessons: string;
  level: string;
  price: string;
  thumbnail?: string;
  instructor?: string;
}

interface Enrollment {
  courseId: string;
  status: string;
  progress?: {
    completedLessons: number;
    totalLessons: number;
  };
}

interface UserCourseData {
  enrollment: Enrollment | undefined;
  progressPercent: number;
}

const FALLBACK_COURSES: Course[] = [
  {
    id: "awakening-to-consciousness",
    title: "Awakening to Consciousness",
    description:
      "A foundational 4-week journey exploring the nature of consciousness, self-awareness, and the integration of Eastern and Western philosophical perspectives.",
    duration: "4 weeks",
    totalLessons: "15 lessons",
    level: "Beginner",
    price: "$97",
    instructor: "Rapha Lumina",
    thumbnail: awakeningCourseImg,
  },
  {
    id: "shadow-work-journey",
    title: "The Shadow Work Journey",
    description:
      "Deep dive into Jungian psychology and the integration of shadow aspects. Learn to embrace your whole self through guided inner work and transformative practices.",
    duration: "6 weeks",
    totalLessons: "18 lessons",
    level: "Intermediate",
    price: "$147",
    instructor: "Rapha Lumina",
    thumbnail: courseImg,
  },
  {
    id: "quantum-consciousness",
    title: "Quantum Consciousness & Mysticism",
    description:
      "Explore the intersection of quantum physics and ancient mystical wisdom. Understand reality at the deepest levels through both scientific and spiritual lenses.",
    duration: "8 weeks",
    totalLessons: "24 lessons",
    level: "Advanced",
    price: "$197",
    instructor: "Rapha Lumina",
    thumbnail: courseImg,
  },
];

function CurrencyToggle({
  currency,
  onChange,
}: {
  currency: "USD" | "ZAR";
  onChange: (c: "USD" | "ZAR") => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-background p-1 shadow-sm">
      {(["USD", "ZAR"] as const).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
            currency === c
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover-elevate"
          }`}
          data-testid={`button-currency-${c.toLowerCase()}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating ${value.toFixed(1)} of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground"
            }`}
          />
        );
      })}
    </div>
  );
}

function CourseCard({
  course,
  currency,
  userCourseData,
}: {
  course: Course;
  currency: "USD" | "ZAR";
  userCourseData: UserCourseData;
}) {
  const [, setLocation] = useLocation();
  const { enrollment, progressPercent } = userCourseData;
  const isEnrolled = enrollment?.status === "active";

  const priceMatch = course.price.match(/\$(\d+)/);
  const usdPrice = priceMatch ? parseInt(priceMatch[1]) : 97;
  const zarPrice = Math.round(usdPrice * 10);
  const displayPrice = currency === "USD" ? `$${usdPrice}` : `R${zarPrice}`;

  return (
    <Card
      className="hover-elevate overflow-hidden flex flex-col"
      data-testid={`card-course-${course.id}`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={Screenshot_2025_10_30_211849}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* overlay texture */}
        <img
          src="/attached_assets/Screenshot 2025-10-30 211849_1761882366912.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary">{course.level}</Badge>
          {isEnrolled && (
            <Badge className="bg-green-600 hover:bg-green-700">Enrolled</Badge>
          )}
        </div>
      </div>
      <CardHeader className="flex-1">
        <CardTitle className="text-xl font-serif line-clamp-2">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.totalLessons}
          </div>
        </div>

        {isEnrolled && progressPercent > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <StarRating value={4.8} />
            <span className="text-xs text-muted-foreground">
              2,340 enrolled
            </span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{displayPrice}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          className="flex-1"
          onClick={() => {
            if (isEnrolled) {
              setLocation(`/lms-dashboard?courseId=${course.id}`);
            } else {
              setLocation(`/course-detail?id=${course.id}`);
            }
          }}
          data-testid={`button-${isEnrolled ? "continue" : "view"}-course-${course.id}`}
        >
          {isEnrolled
            ? progressPercent > 0
              ? "Continue Learning"
              : "Start Course"
            : "View Course"}
        </Button>
        {!isEnrolled && (
          <Button
            variant="outline"
            onClick={() => setLocation(`/course-detail?id=${course.id}`)}
            data-testid={`button-details-${course.id}`}
          >
            Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function Courses() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [currency, setCurrency] = useState<"USD" | "ZAR">("USD");

  const { data: user } = useQuery<User>({ queryKey: ["/api/auth/user"] });
  const { data: coursesData, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });
  const { data: enrollmentsData } = useQuery<Enrollment[]>({
    queryKey: ["/api/my-courses"],
  });

  const ADMIN_EMAIL = "leratom2012@gmail.com";
  const hasAcademyAccess =
    !!user &&
    (user.email === ADMIN_EMAIL ||
      user.subscriptionTier === "premium" ||
      user.subscriptionTier === "transformation");

  const displayCourses = coursesData || FALLBACK_COURSES;

  const levels = useMemo(() => {
    const uniqueLevels = Array.from(
      new Set(displayCourses.map((c) => c.level)),
    );
    return ["all", ...uniqueLevels];
  }, [displayCourses]);

  const filteredCourses = useMemo(() => {
    let result = [...displayCourses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    if (selectedLevel !== "all") {
      result = result.filter((c) => c.level === selectedLevel);
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const aP = parseInt(a.price.match(/\d+/)?.[0] || "0");
        const bP = parseInt(b.price.match(/\d+/)?.[0] || "0");
        return aP - bP;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const aP = parseInt(a.price.match(/\d+/)?.[0] || "0");
        const bP = parseInt(b.price.match(/\d+/)?.[0] || "0");
        return bP - aP;
      });
    }

    return result;
  }, [displayCourses, searchQuery, selectedLevel, sortBy]);

  const userCourseDataMap = useMemo(() => {
    const map = new Map<string, UserCourseData>();
    displayCourses.forEach((course) => {
      const enrollment = enrollmentsData?.find((e) => e.courseId === course.id);
      const progressPercent = enrollment?.progress
        ? Math.round(
            (enrollment.progress.completedLessons /
              enrollment.progress.totalLessons) *
              100,
          )
        : 0;
      map.set(course.id, { enrollment, progressPercent });
    });
    return map;
  }, [displayCourses, enrollmentsData]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-primary/10 to-background py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/attached_assets/image_1761840836558.png"
              alt="Hands reaching toward divine light"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl mb-3">
                  Rapha Lumina Academy
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Transformative courses integrating ancient wisdom with modern
                  understanding. Each journey facilitates genuine awakening.
                </p>
              </div>
              <CurrencyToggle currency={currency} onChange={setCurrency} />
            </div>
          </div>
        </div>

        {/* Academy Access CTA */}
        {hasAcademyAccess && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Welcome to Your Learning Journey
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Access your personalized Academy dashboard with courses,
                        meditation, and progress tracking
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setLocation("/academy")}
                    className="whitespace-nowrap"
                    data-testid="button-go-to-academy"
                  >
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Go to Rapha Lumina Academy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-courses"
              />
            </div>
            <Select
              value={selectedLevel}
              onValueChange={(value) => setSelectedLevel(value)}
            >
              <SelectTrigger
                className="w-full md:w-[200px]"
                data-testid="select-level"
              >
                <SelectValue placeholder="Filter by level">
                  {selectedLevel === "all" ? "All Levels" : selectedLevel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger
                className="w-full md:w-[200px]"
                data-testid="select-sort"
              >
                <SelectValue placeholder="Sort by">
                  {sortBy === "popularity" && "Most Popular"}
                  {sortBy === "price-asc" && "Price: Low to High"}
                  {sortBy === "price-desc" && "Price: High to Low"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {coursesLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          )}

          {/* Grid */}
          {!coursesLoading && filteredCourses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  currency={currency}
                  userCourseData={
                    userCourseDataMap.get(course.id) || {
                      enrollment: undefined,
                      progressPercent: 0,
                    }
                  }
                />
              ))}
            </div>
          )}

          {/* No results */}
          {!coursesLoading && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No courses found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl mb-4">
              All Courses Included in Transformation Package
            </h2>
            <p className="text-muted-foreground mb-6">
              Get lifetime access to all current and future courses with the
              Transformation Package, plus unlimited chat access and
              personalized coaching.
            </p>
            <Button
              size="lg"
              onClick={() => setLocation("/shop")}
              data-testid="link-view-packages"
            >
              View Subscription Tiers
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Rapha Lumina. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
