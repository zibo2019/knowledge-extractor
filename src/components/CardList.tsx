import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { KnowledgeCard as Card } from './KnowledgeCard';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

export const CardList: React.FC = () => {
  const { cards, removeCard } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date');
  const { t } = useTranslation();

  const filteredCards = cards
    .filter((card) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        card.title.toLowerCase().includes(searchLower) ||
        card.content.toLowerCase().includes(searchLower) ||
        card.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.importance - a.importance;
    });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('cardList.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'importance')}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          >
            <option value="date">{t('cardList.sortByDate')}</option>
            <option value="importance">{t('cardList.sortByImportance')}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onDelete={removeCard}
          />
        ))}
      </div>
    </div>
  );
};