import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  // 阻止点击内容区域时关闭对话框
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto ${className}`}
        onClick={handleContentClick}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}; 