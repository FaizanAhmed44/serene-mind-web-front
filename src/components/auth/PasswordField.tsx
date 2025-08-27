
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  disabled 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-3">
      <Label htmlFor={label.toLowerCase().replace(' ', '-')} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id={label.toLowerCase().replace(' ', '-')}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 pr-12 h-12 text-base border-border rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
          required
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};
