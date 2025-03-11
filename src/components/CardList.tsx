import React, { useState, useEffect } from 'react';
import { Download, CheckSquare, Square } from 'lucide-react';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KnowledgeCard as IKnowledgeCard } from '../types';
import { EditCardModal } from './EditCardModal';

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

export const CardList: React.FC = () => {
  const { cards, removeCard, updateCardOrder, updateCardTitles, updateCard } = useStore();
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const [editingCard, setEditingCard] = useState<IKnowledgeCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={cards.map(card => card.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          </div>
        </SortableContext>
      </DndContext>

      {/* 编辑卡片模态框 */}
      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        card={editingCard}
        onSave={handleSaveCard}
      />
    </div>
  );
};