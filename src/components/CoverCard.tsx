import React, { useRef } from 'react';
import { Download, Book, Edit, RefreshCw, Hash, Star, Tag } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';
import { useStore } from '../store';

interface CoverCardProps {
  title?: string;
  subtitle?: string;
  onEdit?: () => void;
  onRefresh?: () => void;
}

/**
 * 知识卡片封面组件
 * 作为知识卡片集合的第一张卡片，提供美观的封面展示
 */
export const CoverCard: React.FC<CoverCardProps> = ({ 
  title = '21天打造超强记忆力',
  subtitle = '高效提取关键知识，构建个人专属知识体系',
  onEdit,
  onRefresh
}) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const { cards } = useStore();
  
  // 计算统计信息
  const totalCards = cards.length;
  const averageImportance = totalCards > 0 
    ? Math.round((cards.reduce((sum, card) => sum + card.importance, 0) / totalCards) * 10) / 10
    : 0;
  
  // 统计所有标签
  const tagStats = cards.reduce((stats: { [key: string]: number }, card) => {
    card.tags.forEach(tag => {
      stats[tag] = (stats[tag] || 0) + 1;
    });
    return stats;
  }, {});
  
  // 获取出现次数最多的前3个标签
  const topTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);
  
  // 导出封面为PNG图片
  const handleDownload = () => {
    if (!cardRef.current) return;

    const loadingToast = toast.loading(t('notifications.processing'));
    
    // 保存原始背景色
    const originalBgColor = window.getComputedStyle(cardRef.current).backgroundColor;
    
    // 确保背景色不透明
    if (cardRef.current) {
      if (originalBgColor === 'transparent' || originalBgColor.includes('rgba')) {
        cardRef.current.style.backgroundColor = 'white';
      }
    }
    
    // 临时隐藏卡片外部的按钮区域
    const parentElement = cardRef.current.parentElement;
    const buttonContainer = parentElement?.querySelector('.cover-buttons');
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
        backgroundColor: 'white',
      },
      bgcolor: 'white',
    })
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = `知识卡片封面.png`;
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
      toast.success('封面已导出');
    })
    .catch((err: Error) => {
      console.error('生成封面图片时出错:', err);
      toast.error('生成封面图片失败');
      
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

  // 封面样式 - 渐变背景
  const coverStyle = {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // 暗色模式下的封面样式
  const darkCoverStyle = {
    background: 'linear-gradient(135deg, #312e81 0%, #5b21b6 100%)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
  };

  return (
    <div className="flex flex-col">
      {/* 卡片主体 */}
      <div 
        ref={cardRef}
        data-card-id="cover"
        className="p-6 flex flex-col"
        style={{ 
          aspectRatio: '3/4',
          ...coverStyle,
          ...(document.documentElement.classList.contains('dark') ? darkCoverStyle : {})
        }}
      >
        {/* 装饰元素 - 右上角图案 */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.3,81.4,26.6,73.6,38.6C65.8,50.5,55.9,61.1,43.7,70.5C31.6,79.9,17.3,88.1,1.6,85.8C-14.1,83.5,-30.1,70.7,-41.2,58.4C-52.2,46.1,-58.1,34.4,-65.8,21.1C-73.5,7.9,-82.9,-6.9,-81.6,-20.7C-80.3,-34.5,-68.3,-47.3,-55,-57.4C-41.7,-67.5,-27.1,-74.9,-11.9,-76.8C3.3,-78.7,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {/* 封面内容 */}
        <div className="flex flex-col justify-between h-full z-10">
          {/* 顶部区域 - 标题和图标 */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <Book className="w-16 h-16" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words hyphens-auto px-2">
              {title}
            </h1>
            <p className="text-base md:text-lg opacity-80 break-words hyphens-auto px-4">
              {subtitle}
            </p>
          </div>
          
          {/* 中间区域 - 统计信息 */}
          <div className="flex-grow flex flex-col justify-center items-center text-center space-y-8">
            {/* 装饰线 */}
            <div className="w-16 h-1 bg-white opacity-50"></div>
            
            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-4 w-full px-4">
              <div className="flex flex-col items-center">
                <Hash className="w-5 h-5 mb-1 opacity-70" />
                <div className="text-xl font-bold">{totalCards}</div>
                <div className="text-xs opacity-70">知识卡片</div>
              </div>
              <div className="flex flex-col items-center">
                <Star className="w-5 h-5 mb-1 opacity-70" />
                <div className="text-xl font-bold">{averageImportance}</div>
                <div className="text-xs opacity-70">平均重要性</div>
              </div>
              <div className="flex flex-col items-center">
                <Tag className="w-5 h-5 mb-1 opacity-70" />
                <div className="text-xl font-bold">{Object.keys(tagStats).length}</div>
                <div className="text-xs opacity-70">知识标签</div>
              </div>
            </div>
            
            {/* 热门标签 */}
            {topTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 px-4">
                {topTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* 底部区域 - 日期 */}
          <div className="text-center opacity-70">
            <p>创建于 {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      {/* 卡片外部的按钮区域 */}
      <div className="flex justify-center gap-4 mt-2 cover-buttons">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          title={t('coverCard.exportButton', '导出封面')}
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          <span>{t('coverCard.export', '导出')}</span>
        </Button>
        
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            title={t('coverCard.editButton', '编辑封面')}
            className="flex items-center gap-1 text-blue-500"
          >
            <Edit className="w-4 h-4" />
            <span>{t('coverCard.edit', '编辑')}</span>
          </Button>
        )}
        
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            title={t('coverCard.refreshButton', '刷新封面')}
            className="flex items-center gap-1 text-green-500"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('coverCard.refresh', '刷新')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};