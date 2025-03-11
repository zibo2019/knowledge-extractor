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

    const loadingToast = toast.loading(t('notifications.processing'));
    
    // 保存原始背景色
    const originalBgColor = window.getComputedStyle(cardRef.current).backgroundColor;
    
    // 确保背景色不透明
    if (cardRef.current) {
      // 如果背景色是透明的或rgba带透明度，设置为白色或其他不透明颜色
      if (originalBgColor === 'transparent' || originalBgColor.includes('rgba')) {
        cardRef.current.style.backgroundColor = 'white';
      }
    }
    
    // 临时隐藏卡片外部的按钮区域，确保只捕获卡片本身
    const parentElement = cardRef.current.parentElement;
    const buttonContainer = parentElement?.querySelector('.card-buttons');
    let originalButtonDisplay = 'flex';
    
    if (buttonContainer) {
      originalButtonDisplay = window.getComputedStyle(buttonContainer).display;
      (buttonContainer as HTMLElement).style.display = 'none';
    }
    
    domtoimage.toPng(cardRef.current, {
      width: cardRef.current.offsetWidth * 3,
      height: cardRef.current.offsetHeight * 3,
      style: {
        transform: 'scale(3)',
        transformOrigin: 'top left',
        width: `${cardRef.current.offsetWidth}px`,
        height: `${cardRef.current.offsetHeight}px`,
        // 确保背景不透明
        backgroundColor: 'white',
      },
      // 设置背景色为白色
      bgcolor: 'white',
    })
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = `${card.title.replace(/\s+/g, '_')}_card.png`;
      link.href = dataUrl;
      link.click();
      
      // 恢复原始背景色
      if (cardRef.current) {
        cardRef.current.style.backgroundColor = originalBgColor;
      }
      
      // 恢复按钮区域的显示
      if (buttonContainer) {
        (buttonContainer as HTMLElement).style.display = originalButtonDisplay;
      }
      
      toast.dismiss(loadingToast);
      toast.success('图片已生成');
    })
    .catch((err: Error) => {
      console.error('生成图片时出错:', err);
      toast.error('生成图片失败');
      
      // 恢复原始背景色
      if (cardRef.current) {
        cardRef.current.style.backgroundColor = originalBgColor;
      }
      
      // 恢复按钮区域的显示
      if (buttonContainer) {
        (buttonContainer as HTMLElement).style.display = originalButtonDisplay;
      }
    });
  };

  // 网格纸张效果的CSS样式
  const gridPaperStyle = {
    backgroundImage: `
      linear-gradient(#e9e9e9 1px, transparent 1px),
      linear-gradient(90deg, #e9e9e9 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0',
    position: 'relative',
    overflow: 'hidden',
  } as const;

  // 暗黑模式下的网格纸张效果
  const darkGridPaperStyle = {
    backgroundImage: `
      linear-gradient(#555555 1px, transparent 1px),
      linear-gradient(90deg, #555555 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    backgroundColor: '#2d3748',
    border: '1px solid #4a5568',
  } as const;

  // 自定义字体样式
  const customFontStyle = {
    fontFamily: '"京華老宋体", "SimSun", serif',
  } as const;

  return (
    <div className="flex flex-col">
      {/* 卡片主体 */}
      <div 
        ref={cardRef}
        data-card-id={card.id}
        className="p-6 flex flex-col"
        // 设置固定比例为3:4（宽:高）和网格纸张效果
        style={{ 
          aspectRatio: '3/4',
          ...gridPaperStyle,
          ...(document.documentElement.classList.contains('dark') ? darkGridPaperStyle : {})
        }}
      >
        {/* 卡片内容区域 - 使用flex-grow-1让它占据所有可用空间 */}
        <div className="flex-grow space-y-4">
          <div>
            <h3 
              className="text-xl font-semibold text-gray-800 dark:text-gray-100" 
              style={customFontStyle}
            >
              {card.title}
            </h3>
          </div>

          <p 
            className="text-gray-700 dark:text-gray-300" 
            style={customFontStyle}
          >
            {card.content}
          </p>
        </div>

        {/* 底部区域 */}
        <div className="mt-auto">
          {/* 标签列表 */}
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

          {/* 底部日期和评分 */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(card.createdAt).toLocaleDateString()}
            </span>
            {/* 星星评分 */}
            <div className="flex">
              {stars.map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < card.importance
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 卡片外部的按钮区域 */}
      <div className="flex justify-center gap-4 mt-2 card-buttons">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          title={t('knowledgeCard.exportButton')}
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          <span>{t('knowledgeCard.export')}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(card.id)}
          title={t('knowledgeCard.deleteButton')}
          className="flex items-center gap-1 text-red-500"
        >
          <Trash className="w-4 h-4" />
          <span>{t('knowledgeCard.delete')}</span>
        </Button>
      </div>
    </div>
  );
};