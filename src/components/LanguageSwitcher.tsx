import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from './ui/Button';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  // 切换语言函数
  const toggleLanguage = () => {
    // 如果当前是英文，切换到中文；如果是中文，切换到英文
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={i18n.language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Globe className="w-5 h-5" />
      <span className="ml-1 text-xs">{i18n.language === 'zh' ? 'EN' : '中'}</span>
    </Button>
  );
}; 