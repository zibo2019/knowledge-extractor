import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

interface TextInputProps {
  onSubmit: (text: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const maxChars = 5000;
  const { t } = useTranslation();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content.slice(0, maxChars));
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          className="w-full h-48 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder={t('textInput.placeholder')}
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {t('textInput.charCount', { current: text.length, max: maxChars })}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSubmit}>
          {t('textInput.processButton')}
        </Button>
        
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            {t('textInput.uploadButton')}
          </Button>
        </label>
        
        {text && (
          <Button
            variant="ghost"
            onClick={() => setText('')}
          >
            <X className="w-4 h-4 mr-2" />
            {t('textInput.clearButton')}
          </Button>
        )}
      </div>
    </div>
  );
};