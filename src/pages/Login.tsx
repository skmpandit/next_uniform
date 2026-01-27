import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";


const friendlyError  = (code?: string) => {
  switch(code) {
    case "auth/invalid-credentials":
    case "auth/wrowng-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network problem. please try again later.";
    default:
      return "An unknown error occurred. Please try again.";
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if(!email || !password) {
      toast({
        title: "Enter Email or Password",
        variant: "destructive"
      })
    }
    setSubmitting(true);
    toast({
      title: "Signing you in...",
      description: "Please wait a moment."
    })

    try {
      await signIn({ email: email.trim(), password})
      toast({
        title: "Welcome back 👋"
      })
      navigate("/", { replace: true})
    }catch(err: any) {
      toast({
        title: "Sign In Failed",
        description: friendlyError(err.code),
        variant: "destructive",
      })
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
              
              <div className="text-center">
                <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                  Forgot your password?
                </Link>
              </div>
              
              <Separator />
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Don't have an account?</p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;