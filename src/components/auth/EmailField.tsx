
import React from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="email" className="text-sm font-semibold text-foreground">
        Email address
      </Label>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 h-12 text-base border-border rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};
