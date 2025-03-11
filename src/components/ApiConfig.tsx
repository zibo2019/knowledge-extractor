import React from 'react';
import { useStore } from '../store';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export const ApiConfig: React.FC = () => {
  const { apiConfig, updateApiConfig, isConnected, setConnected } = useStore();
  const { t } = useTranslation();

  const testConnection = async () => {
    try {
      // 检查 API 密钥是否已配置
      if (!apiConfig.apiKey) {
        toast.error(t('apiConfig.noApiKey'));
        setConnected(false);
        return;
      }

      // 显示加载提示
      const loadingToast = toast.loading(t('apiConfig.testing'));

      // 构建请求选项
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`
        },
        signal: AbortSignal.timeout(apiConfig.timeout)
      };

      // 发送请求到 OpenAI API 的模型列表接口（这是一个轻量级的 API 调用）
      const response = await fetch(`${apiConfig.baseUrl}/models`, requestOptions);
      
      // 关闭加载提示
      toast.dismiss(loadingToast);
      
      if (response.ok) {
        setConnected(true);
        toast.success(t('apiConfig.testSuccess'));
      } else {
        const errorData = await response.json();
        setConnected(false);
        toast.error(`${t('apiConfig.testFailed')}: ${errorData.error?.message || response.statusText}`);
      }
    } catch (error: Error | unknown) {
      setConnected(false);
      const errorMessage = error instanceof Error ? error.message : t('apiConfig.unknownError');
      toast.error(`${t('apiConfig.testFailed')}: ${errorMessage}`);
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