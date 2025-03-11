import React, { useState, useEffect } from 'react';
import { Star, X, Plus } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { KnowledgeCard as IKnowledgeCard } from '../types';
import { useTranslation } from 'react-i18next';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: IKnowledgeCard | null;
  onSave: (updatedCard: IKnowledgeCard) => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onClose,
  card,
  onSave,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [importance, setImportance] = useState(1);

  // 当卡片数据变化时更新表单
  useEffect(() => {
    if (card) {
      // 如果标题有序号，去掉序号
      const titleWithoutNumber = card.originalTitle || card.title.replace(/^\d+\.\s/, '');
      setTitle(titleWithoutNumber);
      setContent(card.content);
      setTags([...card.tags]);
      setImportance(card.importance);
    }
  }, [card]);

  // 处理保存
  const handleSave = () => {
    if (!card) return;
    
    // 保存更新后的卡片
    onSave({
      ...card,
      title: title.trim(), // 标题会由store处理序号
      originalTitle: title.trim(),
      content: content.trim(),
      tags: [...tags],
      importance,
    });
    
    onClose();
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 处理按回车添加标签
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!card) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('editCard.title', '编辑知识卡片')}>
      <div className="space-y-4">
        {/* 标题输入 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            {t('editCard.titleLabel', '标题')}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            placeholder={t('editCard.titlePlaceholder', '输入卡片标题')}
          />
        </div>

        {/* 内容输入 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            {t('editCard.contentLabel', '内容')}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md h-32 resize-none dark:bg-gray-700 dark:text-white"
            placeholder={t('editCard.contentPlaceholder', '输入卡片内容')}
          />
        </div>

        {/* 标签输入 */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            {t('editCard.tagsLabel', '标签')}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              id="tags"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-grow p-2 border rounded-l-md dark:bg-gray-700 dark:text-white"
              placeholder={t('editCard.tagPlaceholder', '添加标签')}
            />
            <Button
              onClick={handleAddTag}
              className="rounded-l-none"
              disabled={!newTag.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 重要性评分 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('editCard.importanceLabel', '重要性')}
          </label>
          <div className="flex">
            {Array(5).fill(0).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setImportance(index + 1)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    index < importance
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 按钮区域 */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel', '取消')}
          </Button>
          <Button onClick={handleSave}>
            {t('common.save', '保存')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}; 