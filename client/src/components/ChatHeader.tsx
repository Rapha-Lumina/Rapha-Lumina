import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@assets/Rapha Lumina_1761161536763.png";

interface ChatHeaderProps {
  onMenuClick?: () => void;
}

export function ChatHeader({ onMenuClick }: ChatHeaderProps) {
  const { user } = useAuth();

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return "User";
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              data-testid="button-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <img src={logo} alt="Rapha Lumina" className="h-10 w-10" />
          <h1 className="font-display text-2xl md:text-3xl font-light text-foreground">
            Rapha Lumina
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={getUserDisplayName()} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{getUserDisplayName()}</span>
                    {user.email && (
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="cursor-pointer" data-testid="button-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
