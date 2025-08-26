import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface MessageDisplayProps {
  message: Message | null;
  onDismiss?: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  const isSuccess = message.type === 'success';
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <Alert className={isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mr-3 mt-0.5 ${
          isSuccess ? 'text-green-500' : 'text-red-500'
        }`} />
        <AlertDescription className={isSuccess ? 'text-green-800' : 'text-red-800'}>
          {message.text}
        </AlertDescription>
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className={`ml-3 p-1 h-auto ${
              isSuccess ? 'hover:bg-green-500/20' : 'hover:bg-red-500/20'
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default MessageDisplay;
