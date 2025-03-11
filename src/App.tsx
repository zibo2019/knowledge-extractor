import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { TextInput } from './components/TextInput';
import { ApiConfig } from './components/ApiConfig';
import { CardList } from './components/CardList';
import { useStore } from './store';
import { Button } from './components/ui/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function App() {
  const { darkMode, toggleDarkMode, addCard } = useStore();
  const { t } = useTranslation();

  const handleTextSubmit = async (text: string) => {
    try {
      // Simulate API call to OpenAI
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCard = {
        id: crypto.randomUUID(),
        title: 'Sample Generated Title',
        content: text.slice(0, 200) + '...',
        tags: ['AI', 'Knowledge', 'Sample'],
        importance: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
      };
      
      addCard(newCard);
      toast.success(t('notifications.cardCreated'));
    } catch (error) {
      toast.error(t('notifications.processFailed'));
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
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TextInput onSubmit={handleTextSubmit} />
            </div>
            <div>
              <ApiConfig />
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