import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";

interface HeaderProps {
  taskCount: number;
  completedCount: number;
}

export function Header({ taskCount, completedCount }: HeaderProps) {
  const { user, signOut } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getEmailPrefix = (email: string) => {
    return email.split("@")[0];
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {/* Logo & Greeting */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary shadow-soft flex items-center justify-center animate-float">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground leading-tight">
              {getGreeting()}! 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.email ? getEmailPrefix(user.email) : ""}
            </p>
          </div>
        </div>

        {/* Stats & Logout */}
        <div className="flex items-center gap-3">
          {/* Mini stats */}
          <div className="hidden sm:flex items-center gap-1 bg-secondary rounded-full px-3 py-1.5">
            <span className="text-xs text-muted-foreground">
              {completedCount}/{taskCount} done
            </span>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
