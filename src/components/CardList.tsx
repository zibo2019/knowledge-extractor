import React, { useState } from 'react';
import { Search, SlidersHorizontal, Download } from 'lucide-react';
import { KnowledgeCard as Card } from './KnowledgeCard';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export const CardList: React.FC = () => {
  const { cards, removeCard } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date');
  const [exportingAllImages, setExportingAllImages] = useState(false);
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

  // 处理导出所有图片
  const handleExportAllImages = () => {
    if (cards.length === 0) {
      // 如果没有卡片，显示提示
      toast.error(t('notifications.noCardsToExport'));
      return;
    }
    
    // 设置导出状态为true，触发KnowledgeCard组件中的导出逻辑
    setExportingAllImages(true);
  };

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
        
        {/* 导出所有图片按钮 */}
        {cards.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAllImages}
            disabled={exportingAllImages}
            className="flex items-center gap-1"
            title={t('cardList.exportAllImages')}
          >
            <Download className="w-4 h-4" />
            <span>{exportingAllImages ? t('cardList.exporting') : t('cardList.exportAllImages')}</span>
          </Button>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCards.map((card) => (
          <div key={card.id} className="flex">
            <Card
              card={card}
              onDelete={removeCard}
              exportAllImages={card.id === filteredCards[0]?.id ? exportingAllImages : false}
              onExportComplete={() => setExportingAllImages(false)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};