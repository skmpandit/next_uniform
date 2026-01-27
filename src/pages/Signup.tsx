import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const frindlyError = (code?: string) => {
  switch (code) {
    case "auth/email-aleady-in-use": 
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter valid email address.";
    case "auth/weak-password":
      return "Password is too weak ( Min 6 Characters).";
    case "auth/network-request-failed":
      return "Network problem. Please try again.";
    default : 
      return "Please try again";
  }
}

const Signup = () => {

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(!formData.agreeToTerms) {
      toast({ 
        title: "Please accept the Terms and Privacy Policy",
        variant: "destructive",
      })
      return;
    }
    if(formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      })
      return;
    }
    if(formData.password.length < 6) {
      toast({
        title: "Password should be at least 6 characters long",
        variant: "destructive",
      })
      return;
    }
    setSubmitting(true);
    toast({
      title: "Creating your account...",
      description: "Please wait a moment",
    })

    try {
      await signUp({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
      toast({
        title: "Account created 🎉",
        description: `Welcome, ${formData.firstName || "there"}!`
      })
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        title: "SingUp Failed",
        description: frindlyError(err?.code),
        variant: "destructive",
      })
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join Next Uniform Today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <Link to="/terms" className="underline">Terms of Service</Link> and{" "}
                    <Link to="/privacy" className="underline">Privacy Policy</Link>
                  </Label>
                </div>
                
                <Button type="submit" className="w-full" disabled={!formData.agreeToTerms}>
                  Create Account
                </Button>
              </form>
              
              <Separator />
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Already have an account?</p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Sign In</Link>
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

export default Signup;