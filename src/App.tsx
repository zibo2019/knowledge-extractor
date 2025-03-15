import { TextInput } from './components/TextInput';
import { ApiConfig } from './components/ApiConfig';
import { CardList } from './components/CardList';
import { useStore } from './store';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { generateKnowledgeCard, generateCoverInfo } from './lib/api';

function App() {
  const { darkMode, addCard, apiConfig, isConnected, showNumbering, setCoverInfo } = useStore();
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
      
      // 自动生成封面（异步进行，不阻塞卡片生成流程）
      generateCoverForCards(cardsData);
      
    } catch (error: Error | unknown) {
      // 显示错误消息
      const errorMessage = error instanceof Error ? error.message : t('notifications.processFailed');
      toast.error(errorMessage);
    }
  };
  
  // 根据生成的卡片自动生成封面
  const generateCoverForCards = async (cardsData: any[]) => {
    if (!isConnected || cardsData.length === 0) return;
    
    try {
      // 准备卡片数据用于生成封面
      const cards = cardsData.map(card => ({
        title: card.title,
        originalTitle: card.title,
        content: card.content,
        tags: card.tags
      }));
      
      // 调用API生成封面内容
      const coverInfo = await generateCoverInfo(cards, apiConfig);
      
      // 更新封面信息
      setCoverInfo(coverInfo);
      
      // 显示成功提示（可选，因为卡片生成已经有提示了）
      // toast.success(t('notifications.coverGenerated', '封面已自动生成'));
    } catch (error) {
      console.error('自动生成封面时出错:', error);
      // 不显示错误提示，避免过多的提示干扰用户
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