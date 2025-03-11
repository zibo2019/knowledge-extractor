import React, { useRef } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);

  // 下载卡片为PNG图片
  const handleDownload = () => {
    if (!cardRef.current) return;

    // 创建一个新的canvas元素
    const canvas = document.createElement('canvas');
    // 设置固定大小为1440*1080（高*宽）
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('无法获取canvas上下文');
      return;
    }

    // 设置背景色
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 使用html2canvas将DOM元素转换为图像
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(cardRef.current!, {
        backgroundColor: null,
        scale: 2, // 提高清晰度
      }).then(cardCanvas => {
        // 计算居中位置
        const x = (canvas.width - cardCanvas.width) / 2;
        const y = (canvas.height - cardCanvas.height) / 2;
        
        // 将卡片画布绘制到主画布上
        ctx.drawImage(cardCanvas, x, y);
        
        // 转换为图片并下载
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${card.title.replace(/\s+/g, '_')}_card.png`;
        link.href = dataUrl;
        link.click();
      });
    });
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4"
      // 设置固定比例为3:4（宽:高）
      style={{ aspectRatio: '3/4' }}
    >
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

      <div className="flex justify-between items-center pt-4 border-t mt-auto">
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
  );
};