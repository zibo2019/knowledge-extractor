import React from 'react';
import { useStore } from '../store';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

export const ApiConfig: React.FC = () => {
  const { apiConfig, updateApiConfig, isConnected, setConnected } = useStore();
  const { t } = useTranslation();

  const testConnection = async () => {
    try {
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnected(true);
    } catch {
      setConnected(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t('apiConfig.title')}
        </h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm">
            {isConnected ? t('apiConfig.connected') : t('apiConfig.disconnected')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">{t('apiConfig.apiKey')}</label>
          <input
            type="password"
            value={apiConfig.apiKey}
            onChange={(e) => updateApiConfig({ apiKey: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('apiConfig.baseUrl')}</label>
          <input
            type="text"
            value={apiConfig.baseUrl}
            onChange={(e) => updateApiConfig({ baseUrl: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('apiConfig.timeout')}
          </label>
          <input
            type="number"
            value={apiConfig.timeout}
            onChange={(e) => updateApiConfig({ timeout: Number(e.target.value) })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>

        <Button
          onClick={testConnection}
          className="w-full"
        >
          {t('apiConfig.testButton')}
        </Button>
      </div>
    </div>
  );
};