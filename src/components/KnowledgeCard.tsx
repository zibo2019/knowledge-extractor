import React, { useRef } from 'react';
import { Star, Download, Trash } from 'lucide-react';
import { KnowledgeCard as IKnowledgeCard } from '../types';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';

interface Props {
  card: IKnowledgeCard;
  onDelete: (id: string) => void;
}

export const KnowledgeCard: React.FC<Props> = ({ card, onDelete }) => {
  const stars = Array(5).fill(0);
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  // 下载卡片为PNG图片
  const handleDownload = () => {
    if (!cardRef.current) return;

    const loadingToast = toast.loading('正在生成图片...');
    
    domtoimage.toPng(cardRef.current, {
      width: 1080,
      height: 1440,
      style: {
        transform: 'scale(3)',
        transformOrigin: 'top left',
        width: `${cardRef.current.offsetWidth}px`,
        height: `${cardRef.current.offsetHeight}px`,
      },
    })
    .then(dataUrl => {
      const link = document.createElement('a');
      link.download = `${card.title.replace(/\s+/g, '_')}_card.png`;
      link.href = dataUrl;
      link.click();
      
      toast.dismiss(loadingToast);
      toast.success('图片已生成');
    })
    .catch(err => {
      console.error('生成图片时出错:', err);
      toast.error('生成图片失败');
    });
  };

  return (
    <div 
      ref={cardRef}
      data-card-id={card.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col"
      // 设置固定比例为3:4（宽:高）
      style={{ aspectRatio: '3/4' }}
    >
      {/* 卡片内容区域 - 使用flex-grow-1让它占据所有可用空间 */}
      <div className="flex-grow space-y-4">
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
      </div>

      {/* 底部区域 */}
      <div className="mt-auto">
        {/* 标签列表 - 放在底部横线上方 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部横线和按钮 */}
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-500">
            {new Date(card.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
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
    </div>
  );
};