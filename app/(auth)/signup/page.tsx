'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/auth-context';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BookOpen, Briefcase,
    Check,
    Eye, EyeOff, GraduationCap,
    Lock,
    Mail,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'instructor' | 'admin';
  acceptTerms: boolean;
  acceptMarketing: boolean;
  adminCode?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    acceptTerms: false,
    acceptMarketing: false,
    adminCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const passwordStrength = () => {
    const { password } = formData;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthLabel = () => {
    const strength = passwordStrength();
    if (strength === 0) return '';
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    if (formData.role === 'admin' && !formData.adminCode) {
      newErrors.adminCode = 'Admin registration code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      acceptTerms: formData.acceptTerms,
      adminCode: formData.adminCode,
    });
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between text-primary-foreground">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">LearnHub</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Start your learning journey today
          </h1>
          <p className="text-lg opacity-90">
            Join thousands of learners and instructors building skills for the future.
          </p>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary-foreground/20 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Learn from experts</h3>
                <p className="text-sm opacity-80">Access courses created by industry professionals</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary-foreground/20 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Advance your career</h3>
                <p className="text-sm opacity-80">Earn certificates and connect with employers</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary-foreground/20 rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Learn on your schedule</h3>
                <p className="text-sm opacity-80">Study at your own pace, anywhere, anytime</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm opacity-80">
          Join 50,000+ learners across Africa
        </div>
      </div>
      
      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">LearnHub</span>
          </div>
          
          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="px-0 lg:px-6">
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>
                Step {step} of 3: {step === 1 ? 'Your details' : step === 2 ? 'Create password' : 'Choose your path'}
              </CardDescription>
              
              {/* Progress bar */}
              <div className="flex gap-2 pt-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      s <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="px-0 lg:px-6">
              {message.text && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Step 1: Name and Email */}
                {step === 1 && (
                  <div className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Full name</FieldLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="John Mwangi"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            className="pl-10"
                            autoComplete="name"
                          />
                        </div>
                        {errors.name && <FieldError>{errors.name}</FieldError>}
                      </Field>
                      
                      <Field>
                        <FieldLabel>Email address</FieldLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            className="pl-10"
                            autoComplete="email"
                          />
                        </div>
                        {errors.email && <FieldError>{errors.email}</FieldError>}
                      </Field>
                    </FieldGroup>
                    
                    <Button type="button" className="w-full" onClick={handleNext}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Step 2: Password */}
                {step === 2 && (
                  <div className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Password</FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                            className="pl-10 pr-10"
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {formData.password && (
                          <div className="space-y-1 mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Password strength</span>
                              <span className={passwordStrength() >= 75 ? 'text-green-600' : 'text-muted-foreground'}>
                                {getPasswordStrengthLabel()}
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength()}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {errors.password && <FieldError>{errors.password}</FieldError>}
                      </Field>
                      
                      <Field>
                        <FieldLabel>Confirm password</FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                            className="pl-10"
                            autoComplete="new-password"
                          />
                          {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                          )}
                        </div>
                        {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
                      </Field>
                    </FieldGroup>
                    
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" className="flex-1" onClick={handleNext}>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Role selection and terms */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">I want to:</label>
                      <RadioGroup
                        value={formData.role}
                        onValueChange={(value) => updateFormData('role', value)}
                        className="grid gap-3"
                      >
                        <label
                          className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.role === 'student' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                        >
                          <RadioGroupItem value="student" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-primary" />
                              <span className="font-medium">Learn new skills</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Access courses, earn certificates, and advance your career
                            </p>
                          </div>
                        </label>
                        
                        <label
                          className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.role === 'instructor' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                        >
                          <RadioGroupItem value="instructor" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-5 w-5 text-primary" />
                              <span className="font-medium">Teach and earn</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Create courses, share your expertise, and earn income
                            </p>
                          </div>
                        </label>

                        <label
                          className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.role === 'admin' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                        >
                          <RadioGroupItem value="admin" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-primary" />
                              <span className="font-medium">Administer platform</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Manage students, results, and platform settings
                            </p>
                          </div>
                        </label>
                      </RadioGroup>
                    </div>

                    {formData.role === 'admin' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Admin Registration Code</label>
                        <Input
                          type="text"
                          placeholder="Enter admin registration code"
                          value={formData.adminCode}
                          onChange={(e) => updateFormData('adminCode', e.target.value)}
                        />
                        {errors.adminCode && (
                          <p className="text-sm text-destructive">{errors.adminCode}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Contact system administrator to get the registration code
                        </p>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="terms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => updateFormData('acceptTerms', checked as boolean)}
                          className="mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                      {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}
                      
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="marketing"
                          checked={formData.acceptMarketing}
                          onCheckedChange={(checked) => updateFormData('acceptMarketing', checked as boolean)}
                          className="mt-1"
                        />
                        <label htmlFor="marketing" className="text-sm text-muted-foreground cursor-pointer">
                          Send me tips, trends, and special offers (optional)
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                        Create account
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            
            <CardFooter className="px-0 lg:px-6 flex flex-col gap-4">
              <Separator />
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
