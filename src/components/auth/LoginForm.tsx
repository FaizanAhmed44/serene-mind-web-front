
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <EmailField
          value={email}
          onChange={setEmail}
          disabled={loading}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-input bg-background accent-primary focus:ring-2 focus:ring-ring"
            />
            <Label htmlFor="remember" className="text-sm font-medium">
              Remember me
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm transition-all duration-200 hover:shadow-md" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">New to Core Cognitive?</span>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/signup"
          className="inline-flex items-center justify-center w-full h-12 px-6 text-base font-semibold border border-border rounded-lg bg-background hover:bg-muted/50 text-foreground transition-all duration-200 hover:shadow-sm"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};
