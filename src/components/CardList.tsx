import React, { useState, useEffect } from 'react';
import { Download, CheckSquare, Square, Trash, Book, RefreshCw } from 'lucide-react';
import { KnowledgeCard as Card } from './KnowledgeCard';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KnowledgeCard as IKnowledgeCard } from '../types';
import { EditCardModal } from './EditCardModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { CoverCard } from './CoverCard';
import { generateCoverInfo } from '../lib/api';

// 可排序卡片组件的属性接口
interface SortableCardProps {
  card: IKnowledgeCard;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (card: IKnowledgeCard) => void;
}

// 可排序的卡片组件
const SortableCard: React.FC<SortableCardProps> = ({ card, onDelete, isSelected, onSelect, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex"
      {...attributes}
      {...listeners}
    >
      <Card
        card={card}
        onDelete={onDelete}
        isSelected={isSelected}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    </div>
  );
};

// 封面编辑模态框组件
interface EditCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  coverInfo: {
    title: string;
    subtitle: string;
    quote: string;
  };
  onSave: (updatedCover: { title: string; subtitle: string; quote: string }) => void;
}

const EditCoverModal: React.FC<EditCoverModalProps> = ({ isOpen, onClose, coverInfo, onSave }) => {
  const [title, setTitle] = useState(coverInfo.title);
  const [subtitle, setSubtitle] = useState(coverInfo.subtitle);
  const [quote, setQuote] = useState(coverInfo.quote);
  const { t } = useTranslation();

  // 当coverInfo变化时更新状态
  useEffect(() => {
    setTitle(coverInfo.title);
    setSubtitle(coverInfo.subtitle);
    setQuote(coverInfo.quote);
  }, [coverInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, subtitle, quote });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {t('coverModal.title', '编辑封面')}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('coverModal.titleLabel', '标题')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                maxLength={15}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('coverModal.titleHint', '最多15个字符，建议使用吸引人的爆款标题')} ({title.length}/15)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('coverModal.subtitleLabel', '副标题')}
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                maxLength={25}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('coverModal.subtitleHint', '最多25个字符')} ({subtitle.length}/25)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('coverModal.quoteLabel', '引用语')}
              </label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                maxLength={20}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('coverModal.quoteHint', '最多20个字符')} ({quote.length}/20)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {t('coverModal.cancel', '取消')}
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              {t('coverModal.save', '保存')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CardList: React.FC = () => {
  const { cards, removeCard, updateCardOrder, updateCardTitles, updateCard, apiConfig, isConnected, coverInfo, setCoverInfo } = useStore();
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const [editingCard, setEditingCard] = useState<IKnowledgeCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCover, setShowCover] = useState(true); // 控制是否显示封面
  const [generatingCover, setGeneratingCover] = useState(false);
  const [isEditCoverModalOpen, setIsEditCoverModalOpen] = useState(false);

  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要拖动8px才会激活拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 确保组件挂载时更新卡片标题
  useEffect(() => {
    updateCardTitles();
  }, []);

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

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // 如果没有目标或者拖拽到了原位置，不做任何处理
    if (!over || active.id === over.id) {
      return;
    }

    // 找到源和目标索引
    const oldIndex = cards.findIndex(card => card.id === active.id);
    const newIndex = cards.findIndex(card => card.id === over.id);
    
    // 调用store中的方法更新卡片顺序
    updateCardOrder(oldIndex, newIndex);
    
    // 更新卡片标题中的序号
    updateCardTitles();
    
    // 显示成功提示
    toast.success(t('notifications.cardOrderUpdated'));
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

  // 处理导出所有卡片（包括封面）
  const handleExportAll = async () => {
    if (cards.length === 0 && !showCover) {
      toast.error(t('cardList.noCardsToExport', '没有卡片可导出'));
      return;
    }

    setExporting(true);
    // 计算总导出数量（卡片数量 + 封面）
    const totalExportCount = cards.length + (showCover ? 1 : 0);
    const loadingToast = toast.loading(t('notifications.exportingImages', { current: 0, total: totalExportCount }));
    let successCount = 0;
    
    // 创建一个zip文件夹
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const imgFolder = zip.folder('知识卡片');
    
    // 首先导出封面（如果显示）
    if (showCover) {
      const coverElement = document.querySelector('[data-card-id="cover"]') as HTMLElement;
      if (coverElement) {
        // 更新加载提示
        toast.loading(t('notifications.exportingImages', { current: 1, total: totalExportCount }), { id: loadingToast });
        
        // 保存原始背景色
        const originalBgColor = window.getComputedStyle(coverElement).backgroundColor;
        
        // 临时隐藏卡片外部的按钮区域
        const parentElement = coverElement.parentElement;
        const buttonContainer = parentElement?.querySelector('.cover-buttons');
        let originalButtonDisplay = 'flex';
        
        if (buttonContainer) {
          originalButtonDisplay = window.getComputedStyle(buttonContainer).display;
          (buttonContainer as HTMLElement).style.display = 'none';
        }
        
        try {
          const domtoimage = (await import('dom-to-image')).default;
          const dataUrl = await domtoimage.toPng(coverElement, {
            width: coverElement.offsetWidth * 3,
            height: coverElement.offsetHeight * 3,
            style: {
              transform: 'scale(3)',
              transformOrigin: 'top left',
              width: `${coverElement.offsetWidth}px`,
              height: `${coverElement.offsetHeight}px`,
            },
          });
          
          // 将封面图片添加到zip文件
          if (imgFolder) {
            const base64Data = dataUrl.replace('data:image/png;base64,', '');
            imgFolder.file(`00_知识卡片封面.png`, base64Data, { base64: true });
            successCount++;
          }
        } catch (err) {
          console.error('生成封面图片时出错:', err);
        } finally {
          // 恢复原始背景色
          coverElement.style.backgroundColor = originalBgColor;
          
          // 恢复按钮区域的显示
          if (buttonContainer) {
            (buttonContainer as HTMLElement).style.display = originalButtonDisplay;
          }
        }
      }
    }
    
    // 然后导出所有卡片
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const element = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLElement;
      
      if (!element) continue;
      
      // 更新加载提示
      toast.loading(t('notifications.exportingImages', { current: i + 1 + (showCover ? 1 : 0), total: totalExportCount }), { id: loadingToast });
      
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
          // 使用序号前缀确保排序正确
          const filePrefix = (i + 1).toString().padStart(2, '0');
          const base64Data = dataUrl.replace('data:image/png;base64,', '');
          imgFolder.file(`${filePrefix}_${card.title.replace(/\s+/g, '_')}_card.png`, base64Data, { base64: true });
          successCount++;
        }
      } catch (err) {
        console.error('生成图片时出错:', err);
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

  // 处理编辑卡片
  const handleEditCard = (card: IKnowledgeCard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  // 处理保存编辑后的卡片
  const handleSaveCard = (updatedCard: IKnowledgeCard) => {
    updateCard(updatedCard);
    updateCardTitles(); // 更新卡片标题中的序号
    toast.success(t('notifications.cardUpdated', '卡片已更新'));
  };

  // 处理删除选中的卡片
  const handleDeleteSelected = () => {
    if (selectedCardIds.length === 0) {
      toast.error(t('cardList.noCardSelected'));
      return;
    }

    // 打开确认删除模态框
    setIsDeleteModalOpen(true);
  };

  // 确认删除选中的卡片
  const confirmDeleteSelected = () => {
    // 保存选中卡片数量用于显示成功消息
    const count = selectedCardIds.length;
    
    // 删除选中的卡片
    selectedCardIds.forEach(id => {
      removeCard(id);
    });
    
    // 清空选中状态
    setSelectedCardIds([]);
    
    // 更新卡片标题中的序号
    updateCardTitles();
    
    // 显示成功提示
    toast.success(t('notifications.deleteSuccess', { count }));
  };

  // 切换封面显示状态
  const toggleCover = () => {
    setShowCover(prev => !prev);
  };

  // 生成封面内容
  const handleGenerateCover = async () => {
    // 检查 API 连接状态
    if (!isConnected) {
      toast.error(t('notifications.notConnected', 'API未连接'));
      return;
    }

    // 检查是否有卡片
    if (cards.length === 0) {
      toast.error(t('cardList.noCardsForCover', '没有卡片内容，无法生成封面'));
      return;
    }

    setGeneratingCover(true);
    const loadingToast = toast.loading(t('notifications.generatingCover', '正在生成封面...'));

    try {
      // 调用API生成封面内容
      const newCoverInfo = await generateCoverInfo(cards, apiConfig);
      setCoverInfo(newCoverInfo);
      
      toast.dismiss(loadingToast);
      toast.success(t('notifications.coverGenerated', '封面已生成'));
    } catch (error) {
      console.error('生成封面时出错:', error);
      toast.dismiss(loadingToast);
      toast.error(t('notifications.coverGenerationFailed', '封面生成失败'));
    } finally {
      setGeneratingCover(false);
    }
  };

  // 处理编辑封面
  const handleEditCover = () => {
    setIsEditCoverModalOpen(true);
  };

  // 处理保存封面信息
  const handleSaveCoverInfo = (updatedCover: { title: string; subtitle: string; quote: string }) => {
    setCoverInfo(updatedCover);
    toast.success(t('notifications.coverUpdated', '封面已更新'));
  };

  const isAllSelected = cards.length > 0 && selectedCardIds.length === cards.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-start gap-2 flex-wrap">
        {/* 封面控制按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleCover}
          className="flex items-center gap-1"
          title={showCover ? t('cardList.hideCover', '隐藏封面') : t('cardList.showCover', '显示封面')}
        >
          <Book className="w-4 h-4" />
          <span>{showCover ? t('cardList.hideCover', '隐藏封面') : t('cardList.showCover', '显示封面')}</span>
        </Button>

        {/* 生成封面按钮 */}
        {showCover && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateCover}
              disabled={generatingCover || cards.length === 0 || !isConnected}
              className="flex items-center gap-1"
              title={t('cardList.generateCover', '生成封面')}
            >
              <RefreshCw className={`w-4 h-4 ${generatingCover ? 'animate-spin' : ''}`} />
              <span>{generatingCover ? t('cardList.generatingCover', '生成中...') : t('cardList.generateCover', '生成封面')}</span>
            </Button>
          </>
        )}

        {/* 导出全部按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportAll}
          disabled={exporting || (cards.length === 0 && !showCover)}
          className="flex items-center gap-1"
          title={t('cardList.exportAll', '导出全部')}
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? t('cardList.exporting') : t('cardList.exportAll', '导出全部')}</span>
        </Button>

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
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={selectedCardIds.length === 0}
              className="flex items-center gap-1"
              title={t('cardList.deleteSelected')}
            >
              <Trash className="w-4 h-4" />
              <span>{t('cardList.deleteSelected')}</span>
            </Button>
          </>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* 显示封面卡片 */}
        {showCover && (
          <div className="flex">
            <CoverCard 
              title={coverInfo.title}
              subtitle={coverInfo.subtitle}
              quote={coverInfo.quote}
              onEdit={handleEditCover}
              onRefresh={handleGenerateCover}
            />
          </div>
        )}

        {/* 显示知识卡片列表 */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={cards.map(card => card.id)}
            strategy={rectSortingStrategy}
          >
            {cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                onDelete={removeCard}
                isSelected={selectedCardIds.includes(card.id)}
                onSelect={handleCardSelect}
                onEdit={handleEditCard}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* 编辑卡片模态框 */}
      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        card={editingCard}
        onSave={handleSaveCard}
      />

      {/* 确认删除模态框 */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSelected}
        count={selectedCardIds.length}
      />

      {/* 编辑封面模态框 */}
      <EditCoverModal
        isOpen={isEditCoverModalOpen}
        onClose={() => setIsEditCoverModalOpen(false)}
        coverInfo={coverInfo}
        onSave={handleSaveCoverInfo}
      />
    </div>
  );
};