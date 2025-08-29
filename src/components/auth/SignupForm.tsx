import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="flex items-center space-x-3">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-primary bg-[#FFFFFF] accent-primary focus:ring-2 focus:ring-[#202a42]"
            required
            disabled={loading}
          />
          <Label htmlFor="terms" className="text-sm font-medium text-[#272829]">
            I agree to the{" "}
            <Link to="/terms" className="text-[#184349] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[#184349] hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-[#184349] hover:bg-[#184349]/90 text-[#FFFFFF] rounded-lg shadow-sm transition-all duration-200 hover:shadow-md" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#272829]/30" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#FFFFFF] text-[#272829]/70">Already have an account?</span>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full h-12 px-6 text-base font-semibold border border-[#272829]/30 rounded-lg bg-[#FFFFFF] hover:bg-[#272829]/10 text-[#272829] transition-all duration-200 hover:shadow-sm"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};