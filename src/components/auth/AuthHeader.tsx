
import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
          alt="Core Cognitive Logo" 
          className="h-16 w-16 rounded-full border-3 border-primary/20 shadow-lg"
        />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};
