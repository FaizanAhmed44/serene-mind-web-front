
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
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};
