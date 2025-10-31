import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Home, Info, MessageCircle, ShoppingBag, BookOpen, Book, Newspaper, Mail, Settings, LogOut, User, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@assets/Rapha Lumina_1761161536763.png";

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Load systeme.io popup script for all users
  useEffect(() => {
    const scriptId = "form-script-tag-21189482";
    
    // Check if script is already loaded
    if (document.getElementById(scriptId)) {
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.raphalumina.com/public/remote/page/34463995a1fbb90924e00d56deeefd448b749798.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/shop", label: "Shop", icon: ShoppingBag },
    { path: "/courses", label: "Courses", icon: BookOpen },
    { path: "/ebooks", label: "eBooks", icon: Book },
    { path: "/forum", label: "Forum", icon: Users },
    { path: "/blog", label: "Blog", icon: Newspaper },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 transition-colors cursor-pointer" data-testid="link-home-logo">
              <img src={logo} alt="Rapha Lumina" className="h-10 w-10" />
              <span className="font-display text-xl text-foreground hidden sm:inline">Rapha Lumina</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-8 px-3 py-2 hover-elevate active-elevate-2 cursor-pointer ${
                      location === item.path
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'bg-transparent hover:bg-accent hover:text-accent-foreground'
                    }`}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.path === "/" ? "" : item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Auth Section - Desktop */}
            {!isLoading && (
              <div className="ml-2 pl-2 border-l flex items-center gap-2">
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 hover-elevate" data-testid="button-user-menu">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                          <AvatarFallback>
                            {user.firstName?.[0] || user.email?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden lg:inline">{user.firstName || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                          <AvatarFallback>
                            {user.firstName?.[0] || user.email?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <span className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-admin">
                            <Settings className="w-4 h-4" />
                            Admin Dashboard
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button onClick={handleLogin} variant="ghost" size="default" data-testid="button-login">
                      Log in
                    </Button>
                    <Button 
                      asChild
                      variant="default" 
                      size="default"
                    >
                      <a 
                        href="#" 
                        className="systeme-show-popup-21189482"
                        data-testid="button-signup"
                      >
                        Sign up
                      </a>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-menu-toggle">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Navigation Items */}
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link href={item.path}>
                      <span className="flex items-center gap-2 w-full" data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                
                {/* Auth Section - Mobile */}
                {!isLoading && (
                  <>
                    <DropdownMenuSeparator />
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center gap-2 p-2 mb-1">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                            <AvatarFallback>
                              {user.firstName?.[0] || user.email?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <span className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-mobile-admin">
                              <Settings className="w-4 h-4" />
                              Admin Dashboard
                            </span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} data-testid="button-mobile-logout">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={handleLogin} data-testid="button-mobile-login">
                          <User className="w-4 h-4 mr-2" />
                          Log in
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a 
                            href="#" 
                            className="systeme-show-popup-21189482 flex items-center"
                            data-testid="button-mobile-signup"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Sign up
                          </a>
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
