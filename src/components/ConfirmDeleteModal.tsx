import React from 'react';
import { Trash, AlertTriangle } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('deleteModal.title', '确认删除')}
      className="max-w-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-amber-500">
          <AlertTriangle className="w-10 h-10" />
          <p className="text-lg font-medium">
            {t('cardList.confirmDeleteSelected', { count })}
          </p>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t('deleteModal.warning', '此操作无法撤销，删除后数据将无法恢复。')}
        </p>
        
        <div className="flex justify-end gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            {t('common.cancel', '取消')}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash className="w-4 h-4 mr-2" />
            {t('deleteModal.confirm', '确认删除')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}; 