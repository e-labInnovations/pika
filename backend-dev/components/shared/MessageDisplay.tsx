import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

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
    <div className={`p-4 rounded-md border ${
      isSuccess
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mr-3 mt-0.5 ${
          isSuccess ? 'text-green-500' : 'text-red-500'
        }`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message.text}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 p-1 rounded-md hover:bg-opacity-20 ${
              isSuccess ? 'hover:bg-green-500' : 'hover:bg-red-500'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay;
