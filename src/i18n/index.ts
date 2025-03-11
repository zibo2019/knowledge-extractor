import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import enTranslation from './locales/en';
import zhTranslation from './locales/zh';

// 初始化i18next
i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    // 默认语言
    fallbackLng: 'zh',
    // 调试模式
    debug: false,
    // 翻译资源
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    // 检测语言选项
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    // 插值选项
    interpolation: {
      escapeValue: false // 不转义HTML
    }
  });

// 强制设置初始语言为中文
i18n.changeLanguage('zh');

export default i18n; 