import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ArrowLeft, Camera, Mail, Calendar, Leaf, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setFormData({
            name: session.user.user_metadata?.name || "",
            bio: session.user.user_metadata?.bio || "",
          });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setFormData({
          name: session.user.user_metadata?.name || "",
          bio: session.user.user_metadata?.bio || "",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          bio: formData.bio,
        },
      });
      
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mb-2">Not logged in</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
          <Link to="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <h1 className="text-xl font-bold text-foreground">My Profile</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Header */}
        <div className="bento-card p-8 mb-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">
                {getInitials(user.email || "U")}
              </span>
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-background border border-border shadow-lg hover:bg-muted/50 transition-colors">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {formData.name || "Plant Lover"}
          </h2>
          <p className="text-muted-foreground">{user.email}</p>
          
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Leaf className="w-4 h-4" />
                <span className="text-xl font-bold">12</span>
              </div>
              <p className="text-xs text-muted-foreground">Plants</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-plant-healthy mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xl font-bold">45</span>
              </div>
              <p className="text-xs text-muted-foreground">Days Active</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bento-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border/30 text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about your plant journey..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bento-card p-6">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-sm">{user.id.substring(0, 12)}...</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-sm">{formatDate(user.created_at)}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Last Sign In</span>
              <span className="text-sm">{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "N/A"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;