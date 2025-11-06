import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import Landing from "@/pages/landing";
import About from "@/pages/about";
import Chat from "@/pages/chat";
import Shop from "@/pages/shop";
import Signup from "@/pages/signup";
import ConfirmSignup from "@/pages/confirm-signup";
import ThankYou from "@/pages/thank-you";
import JoinAwakening from "@/pages/join-awakening";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import LMSDashboard from "@/pages/lms-dashboard";
import Academy from "@/pages/academy";
import Membership from "@/pages/membership";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import Forum from "@/pages/forum";
import ForumPost from "@/pages/forum-post";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import Privacy from "@/pages/privacy";
import Login from "@/pages/login";
import CreatePassword from "@/pages/create-password";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/chat" component={Chat} />
      <Route path="/shop" component={Shop} />
      <Route path="/signup" component={Signup} />
      <Route path="/confirm-signup" component={ConfirmSignup} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/join-awakening" component={JoinAwakening} />
      <Route path="/login" component={Login} />
      <Route path="/create-password" component={CreatePassword} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/courses" component={Courses} />
      <Route path="/course-detail" component={CourseDetail} />
      <Route path="/lms-dashboard" component={LMSDashboard} />
      <Route path="/academy" component={Academy} />
      <Route path="/membership" component={Membership} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/forum/:id" component={ForumPost} />
      <Route path="/forum" component={Forum} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/privacy" component={Privacy} />
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
          <AddToHomeScreen />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
