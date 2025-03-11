import React, { useRef, useEffect } from 'react';
import { Star, Download, Trash, Images } from 'lucide-react';
import { KnowledgeCard as IKnowledgeCard } from '../types';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';
import { useStore } from '../store';

interface Props {
  card: IKnowledgeCard;
  onDelete: (id: string) => void;
  exportAllImages?: boolean;
  onExportComplete?: () => void;
}

export const KnowledgeCard: React.FC<Props> = ({ 
  card, 
  onDelete, 
  exportAllImages = false,
  onExportComplete
}) => {
  const stars = Array(5).fill(0);
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const { cards } = useStore();

  // 导出单个卡片为PNG图片
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

  // 导出所有卡片为PNG图片
  const handleExportAllImages = async () => {
    // 获取所有卡片元素
    const cardElements = document.querySelectorAll('[data-card-id]');
    
    if (cardElements.length === 0) {
      toast.error(t('notifications.noCardsToExport'));
      return;
    }
    
    const loadingToast = toast.loading(t('notifications.exportingImages', { current: 0, total: cardElements.length }));
    let successCount = 0;
    let failCount = 0;
    
    // 创建一个zip文件夹
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const imgFolder = zip.folder('知识卡片');
    
    // 处理每个卡片
    for (let i = 0; i < cardElements.length; i++) {
      const element = cardElements[i] as HTMLElement;
      const cardId = element.getAttribute('data-card-id');
      const cardData = cards.find(c => c.id === cardId);
      
      if (!cardData) continue;
      
      // 更新加载提示
      toast.loading(t('notifications.exportingImages', { current: i+1, total: cardElements.length }), { id: loadingToast });
      
      // 保存原始背景色
      const originalBgColor = window.getComputedStyle(element).backgroundColor;
      
      // 确保背景色不透明
      if (originalBgColor === 'transparent' || originalBgColor.includes('rgba')) {
        element.style.backgroundColor = 'white';
      }
      
      // 临时隐藏卡片外部的按钮区域
      const parentElement = element.parentElement;
      const buttonContainer = parentElement?.querySelector('.card-buttons');
      let originalButtonDisplay = 'flex';
      
      if (buttonContainer) {
        originalButtonDisplay = window.getComputedStyle(buttonContainer).display;
        (buttonContainer as HTMLElement).style.display = 'none';
      }
      
      try {
        const dataUrl = await domtoimage.toPng(element, {
          width: element.offsetWidth * 3,
          height: element.offsetHeight * 3,
          style: {
            transform: 'scale(3)',
            transformOrigin: 'top left',
            width: `${element.offsetWidth}px`,
            height: `${element.offsetHeight}px`,
            backgroundColor: 'white',
          },
          bgcolor: 'white',
        });
        
        // 将图片添加到zip文件
        if (imgFolder) {
          const base64Data = dataUrl.replace('data:image/png;base64,', '');
          imgFolder.file(`${cardData.title.replace(/\s+/g, '_')}_card.png`, base64Data, { base64: true });
          successCount++;
        }
      } catch (err) {
        console.error('生成图片时出错:', err);
        failCount++;
      } finally {
        // 恢复原始背景色
        element.style.backgroundColor = originalBgColor;
        
        // 恢复按钮区域的显示
        if (buttonContainer) {
          (buttonContainer as HTMLElement).style.display = originalButtonDisplay;
        }
      }
    }
    
    // 生成并下载zip文件
    if (successCount > 0) {
      try {
        toast.loading(t('notifications.generatingZip'), { id: loadingToast });
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = '知识卡片集合.zip';
        link.click();
        
        toast.dismiss(loadingToast);
        toast.success(t('notifications.exportSuccess', { count: successCount }));
      } catch (err) {
        console.error('生成zip文件时出错:', err);
        toast.dismiss(loadingToast);
        toast.error(t('notifications.exportFailed'));
      }
    } else {
      toast.dismiss(loadingToast);
      toast.error(t('notifications.exportFailed'));
    }
    
    // 调用导出完成回调
    if (onExportComplete) {
      onExportComplete();
    }
  };

  // 监听exportAllImages属性变化，当为true时自动导出所有图片
  useEffect(() => {
    if (exportAllImages) {
      handleExportAllImages();
    }
  }, [exportAllImages]);

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