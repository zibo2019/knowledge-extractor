import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Dialog } from './ui/Dialog';

export const ApiConfig: React.FC = () => {
  const { apiConfig, updateApiConfig, isConnected, setConnected } = useStore();
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 从 localStorage 加载 API 配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('apiConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        updateApiConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved API config:', error);
      }
    }
  }, [updateApiConfig]);

  // 当 API 配置变更时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('apiConfig', JSON.stringify(apiConfig));
  }, [apiConfig]);

  // 组件加载时自动测试连接状态
  useEffect(() => {
    // 只有当 apiKey 存在时才测试连接
    if (apiConfig.apiKey) {
      testConnection();
    }
  }, []); // 仅在组件挂载时执行一次

  // 打开对话框
  const openDialog = () => setIsDialogOpen(true);
  
  // 关闭对话框
  const closeDialog = () => setIsDialogOpen(false);

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
        // 测试成功后自动关闭对话框
        closeDialog();
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

  // API配置按钮，显示连接状态
  const ApiStatusButton = () => (
    <Button
      onClick={openDialog}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Settings className="w-5 h-5" />
      <span>{t('apiConfig.configButton')}</span>
      {isConnected ? (
        <Wifi className="w-4 h-4 text-green-500" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-500" />
      )}
    </Button>
  );

  // API配置表单内容
  const ApiConfigForm = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">{t('apiConfig.apiKey')}</label>
        <input
          type="password"
          value={apiConfig.apiKey}
          onChange={(e) => updateApiConfig({ apiKey: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('apiConfig.apiKeyHint')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('apiConfig.baseUrl')}</label>
        <input
          type="text"
          value={apiConfig.baseUrl}
          onChange={(e) => updateApiConfig({ baseUrl: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('apiConfig.baseUrlHint')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t('apiConfig.timeout')} (ms)
        </label>
        <input
          type="number"
          value={apiConfig.timeout}
          onChange={(e) => updateApiConfig({ timeout: Number(e.target.value) })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('apiConfig.timeoutHint')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t('apiConfig.model') || '模型'}
        </label>
        <input
          type="text"
          value={apiConfig.model}
          onChange={(e) => updateApiConfig({ model: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('apiConfig.modelHint') || '设置要使用的AI模型，例如：gpt-4o, gpt-3.5-turbo等'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t('apiConfig.maxTokens') || '最大令牌数'}
        </label>
        <input
          type="number"
          value={apiConfig.maxTokens}
          onChange={(e) => updateApiConfig({ maxTokens: Number(e.target.value) })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('apiConfig.maxTokensHint') || '设置生成内容的最大令牌数，较大的值可以生成更长的内容'}
        </p>
      </div>

      <Button
        onClick={testConnection}
        className="w-full"
      >
        {t('apiConfig.testButton')}
      </Button>
    </div>
  );

  return (
    <>
      <ApiStatusButton />
      
      <Dialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={t('apiConfig.title')}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {isConnected ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-green-500">{t('apiConfig.connected')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-500" />
                <span className="text-red-500">{t('apiConfig.disconnected')}</span>
              </>
            )}
          </div>
          
          <ApiConfigForm />
        </div>
      </Dialog>
    </>
  );
};