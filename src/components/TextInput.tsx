import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

interface TextInputProps {
  onSubmit: (text: string, cardCount: number) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [cardCount, setCardCount] = useState(1);
  const maxChars = 5000;
  const { t } = useTranslation();
  const { showNumbering, toggleNumbering } = useStore();

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text, cardCount);
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
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <label htmlFor="cardCount" className="mr-2 text-sm font-medium">
            {t('textInput.cardCount')}
          </label>
          <input
            id="cardCount"
            type="number"
            min="1"
            max="10"
            value={cardCount}
            onChange={(e) => setCardCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="w-16 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="addNumbering"
            type="checkbox"
            checked={showNumbering}
            onChange={toggleNumbering}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="addNumbering" className="text-sm font-medium">
            {t('textInput.addNumbering', '添加序号 (1. 2. 3.)')}
          </label>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button onClick={handleSubmit}>
            {t('textInput.processButton')}
          </Button>
          
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
    </div>
  );
};