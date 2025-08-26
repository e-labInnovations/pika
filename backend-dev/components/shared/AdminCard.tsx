import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface AdminCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, subtitle, children, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default AdminCard;
