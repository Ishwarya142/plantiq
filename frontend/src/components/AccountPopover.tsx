import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Crown, ChevronRight, Mail, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AccountPopover = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    setOpen(false);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatUserId = (id: string) => {
    return `${id.substring(0, 8)}...`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative group">
          <div className="absolute inset-0 gradient-primary rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
          <div className="relative w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <span className="text-sm font-bold text-white">
              {user ? getInitials(user.email || "U") : "?"}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
        align="end"
        sideOffset={12}
      >
        {user ? (
          <div>
            {/* User Info Header */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">
                    {getInitials(user.email || "U")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {user.user_metadata?.name || "Plant Lover"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
              
              {/* User ID */}
              <div className="mt-3 p-2 rounded-lg bg-muted/50 flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">
                  ID: {formatUserId(user.id)}
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    toast.success("User ID copied to clipboard");
                  }}
                  className="ml-auto text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link 
                to="/profile"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">My Profile</p>
                  <p className="text-xs text-muted-foreground">View and edit your profile</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link 
                to="/pro"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">Unlock premium features</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link 
                to="/settings"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-muted">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Settings</p>
                  <p className="text-xs text-muted-foreground">App preferences</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-border/50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-plant-attention/10 transition-colors text-left group"
              >
                <div className="p-2 rounded-lg bg-plant-attention/10">
                  <LogOut className="w-4 h-4 text-plant-attention" />
                </div>
                <span className="text-sm font-medium text-plant-attention">Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Not logged in</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to track your plants and get personalized care tips
            </p>
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In / Sign Up
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AccountPopover;