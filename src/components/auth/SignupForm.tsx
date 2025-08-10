
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { NameFields } from './NameFields';
import { SignUpFormData } from '@/data/types/auth';

interface SignupFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<void>;
  loading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <NameFields
            firstName={formData.firstName}
            lastName={formData.lastName}
            onFirstNameChange={(value) => handleInputChange('firstName', value)}
            onLastNameChange={(value) => handleInputChange('lastName', value)}
            disabled={loading}
          />

          <EmailField
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            disabled={loading}
          />

          <PasswordField
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            disabled={loading}
          />

          <PasswordField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            disabled={loading}
          />

          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-primary"
              required
              disabled={loading}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
