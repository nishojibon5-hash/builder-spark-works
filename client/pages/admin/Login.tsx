import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  AlertTriangle,
  ArrowRight,
  CreditCard
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    twoFactorCode: ''
  });
  const [step, setStep] = useState(1); // 1: credentials, 2: 2FA
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (formData.email === 'admin@loanbondhu.com' && formData.password === 'admin123') {
        if (step === 1) {
          setStep(2); // Move to 2FA
        } else {
          // Simulate 2FA validation
          if (formData.twoFactorCode === '123456') {
            localStorage.setItem('adminToken', 'mock-admin-token');
            localStorage.setItem('adminUser', JSON.stringify({
              id: 1,
              name: 'Admin User',
              email: 'admin@loanbondhu.com',
              role: 'super_admin',
              permissions: ['all']
            }));
            navigate('/admin/dashboard');
          } else {
            setError('Invalid 2FA code. Please try again.');
          }
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg">
            <CreditCard className="w-8 h-8 text-primary-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">LoanBondhu Management System</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl text-center flex items-center justify-center">
              {step === 1 ? (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Secure Login
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Two-Factor Authentication
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? "Enter your admin credentials to access the system"
                : "Enter the 6-digit code from your authenticator app"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {step === 1 ? (
                <>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@loanbondhu.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Keep me signed in
                    </Label>
                  </div>
                </>
              ) : (
                <>
                  {/* 2FA Code */}
                  <div className="space-y-2">
                    <Label htmlFor="twoFactorCode">Authentication Code</Label>
                    <Input
                      id="twoFactorCode"
                      type="text"
                      placeholder="000000"
                      value={formData.twoFactorCode}
                      onChange={(e) => handleInputChange('twoFactorCode', e.target.value)}
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      required
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Demo code: 123456
                    </p>
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    {step === 1 ? 'Signing In...' : 'Verifying...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {step === 1 ? 'Sign In' : 'Verify Code'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>

              {/* Back Button for 2FA */}
              {step === 2 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={goBack}
                >
                  Back to Login
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-sm">Demo Credentials</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Email: admin@loanbondhu.com</p>
                <p>Password: admin123</p>
                <p>2FA Code: 123456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
