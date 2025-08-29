
import React from 'react';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  disabled?: boolean;
}

export const NameFields: React.FC<NameFieldsProps> = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  disabled
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName" className='text-sm font-semibold text-primary'>First Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="firstName"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="pl-10"
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName" className='text-sm font-semibold text-primary'>Last Name</Label>
        <Input
          id="lastName"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};
