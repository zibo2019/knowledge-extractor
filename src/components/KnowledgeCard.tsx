import React from 'react';
import { Star, Download, Trash } from 'lucide-react';
import { KnowledgeCard as IKnowledgeCard } from '../types';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

interface Props {
  card: IKnowledgeCard;
  onDelete: (id: string) => void;
}

export const KnowledgeCard: React.FC<Props> = ({ card, onDelete }) => {
  const stars = Array(5).fill(0);
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{card.title}</h3>
        <div className="flex">
          {stars.map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < card.importance
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300">{card.content}</p>

      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-sm text-gray-500">
          {new Date(card.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Implement export */}}
            title={t('knowledgeCard.exportButton')}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(card.id)}
            title={t('knowledgeCard.deleteButton')}
          >
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};