import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    try {
      authSchema.parse({ email: formData.email, password: formData.password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") newErrors.email = err.message;
          if (err.path[0] === "password") newErrors.password = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
        navigate("/");
      }
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Try logging in.");
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="bento-card p-8 animate-fade-in-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 gradient-primary rounded-2xl blur-lg opacity-50" />
              <div className="relative gradient-primary p-3 rounded-2xl shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
              PlantIQ
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? "Welcome back! Sign in to continue" : "Create your account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border focus:outline-none focus:ring-2 transition-all",
                    errors.email 
                      ? "border-plant-attention focus:border-plant-attention focus:ring-plant-attention/20" 
                      : "border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-plant-attention text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-10 pr-12 py-3 rounded-xl bg-muted/50 border focus:outline-none focus:ring-2 transition-all",
                    errors.password 
                      ? "border-plant-attention focus:border-plant-attention focus:ring-plant-attention/20" 
                      : "border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-plant-attention text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-muted-foreground text-sm mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;