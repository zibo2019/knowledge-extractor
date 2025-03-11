import React, { useState } from 'react';
import { Download, CheckSquare, Square } from 'lucide-react';
import { KnowledgeCard as Card } from './KnowledgeCard';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export const CardList: React.FC = () => {
  const { cards, removeCard } = useStore();
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  // 处理卡片选择
  const handleCardSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedCardIds(prev => [...prev, id]);
    } else {
      setSelectedCardIds(prev => prev.filter(cardId => cardId !== id));
    }
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedCardIds.length === cards.length) {
      // 如果已经全选，则取消全选
      setSelectedCardIds([]);
    } else {
      // 否则全选
      setSelectedCardIds(cards.map(card => card.id));
    }
  };

  // 处理导出选中的卡片
  const handleExportSelected = async () => {
    if (selectedCardIds.length === 0) {
      toast.error(t('cardList.noCardSelected'));
      return;
    }

    setExporting(true);
    const loadingToast = toast.loading(t('notifications.exportingImages', { current: 0, total: selectedCardIds.length }));
    let successCount = 0;
    let failCount = 0;
    
    // 创建一个zip文件夹
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const imgFolder = zip.folder('知识卡片');
    
    // 处理每个选中的卡片
    for (let i = 0; i < selectedCardIds.length; i++) {
      const cardId = selectedCardIds[i];
      const element = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
      const cardData = cards.find(c => c.id === cardId);
      
      if (!cardData || !element) continue;
      
      // 更新加载提示
      toast.loading(t('notifications.exportingImages', { current: i+1, total: selectedCardIds.length }), { id: loadingToast });
      
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
        const domtoimage = (await import('dom-to-image')).default;
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
    
    setExporting(false);
  };

  const isAllSelected = cards.length > 0 && selectedCardIds.length === cards.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-start gap-2">
        {cards.length > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="flex items-center gap-1"
              title={isAllSelected ? t('cardList.deselectAll') : t('cardList.selectAll')}
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>{isAllSelected ? t('cardList.deselectAll') : t('cardList.selectAll')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSelected}
              disabled={exporting || selectedCardIds.length === 0}
              className="flex items-center gap-1"
              title={t('cardList.exportSelected')}
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? t('cardList.exporting') : t('cardList.exportSelected')}</span>
            </Button>
          </>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.id} className="flex">
            <Card
              card={card}
              onDelete={removeCard}
              isSelected={selectedCardIds.includes(card.id)}
              onSelect={handleCardSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};