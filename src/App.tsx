import { TextInput } from './components/TextInput';
import { ApiConfig } from './components/ApiConfig';
import { CardList } from './components/CardList';
import { useStore } from './store';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { generateKnowledgeCard } from './lib/api';

function App() {
  const { darkMode, addCard, apiConfig, isConnected, showNumbering } = useStore();
  const { t } = useTranslation();

  const handleTextSubmit = async (text: string, cardCount: number) => {
    try {
      // 检查 API 连接状态
      if (!isConnected) {
        toast.error(t('notifications.notConnected'));
        return;
      }
      
      // 显示加载提示
      const loadingToast = toast.loading(t('notifications.processing'));
      
      // 调用 OpenAI API 生成知识卡片
      const cardsData = await generateKnowledgeCard(text, apiConfig, cardCount);
      
      // 添加所有生成的卡片，根据全局状态决定是否添加序号
      cardsData.forEach((cardData, index) => {
        // 保存原始标题
        const originalTitle = cardData.title;
        
        // 根据showNumbering状态决定是否显示序号
        const title = showNumbering ? `${index + 1}. ${originalTitle}` : originalTitle;
        
        // 创建新卡片
        const newCard = {
          id: crypto.randomUUID(),
          title: title,
          originalTitle: originalTitle, // 保存原始标题
          content: cardData.content,
          tags: cardData.tags,
          importance: cardData.importance,
          createdAt: new Date(),
        };
        
        // 添加卡片到状态
        addCard(newCard);
      });
      
      // 关闭加载提示并显示成功消息
      toast.dismiss(loadingToast);
      toast.success(
        cardsData.length > 1 
          ? t('notifications.cardsCreated', { count: cardsData.length }) 
          : t('notifications.cardCreated')
      );
    } catch (error: Error | unknown) {
      // 显示错误消息
      const errorMessage = error instanceof Error ? error.message : t('notifications.processFailed');
      toast.error(errorMessage);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <header className="border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{t('appTitle')}</h1>
              <div className="flex items-center gap-2">
                <ApiConfig />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-1">
            <div>
              <TextInput onSubmit={handleTextSubmit} />
            </div>
          </div>

          <CardList />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;