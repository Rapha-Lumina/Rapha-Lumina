import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "@/pages/landing";
import About from "@/pages/about";
import Chat from "@/pages/chat";
import Shop from "@/pages/shop";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import LMSDashboard from "@/pages/lms-dashboard";
import Academy from "@/pages/academy";
import EBooks from "@/pages/ebooks";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import Privacy from "@/pages/privacy";
import JoinAwakening from "@/pages/join-awakening";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/chat" component={Chat} />
      <Route path="/shop" component={Shop} />
      <Route path="/courses" component={Courses} />
      <Route path="/course-detail" component={CourseDetail} />
      <Route path="/lms-dashboard" component={LMSDashboard} />
      <Route path="/academy" component={Academy} />
      <Route path="/ebooks" component={EBooks} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/code" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;