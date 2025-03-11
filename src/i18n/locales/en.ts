const enTranslation = {
  // 应用标题
  appTitle: 'Knowledge Card Generator',
  
  // 文本输入组件
  textInput: {
    placeholder: 'Enter or paste text here...',
    processButton: 'Process Text',
    clearButton: 'Clear',
    charCount: '{{current}}/{{max}}',
    cardCount: 'Card Count:'
  },
  
  // API配置组件
  apiConfig: {
    title: 'API Configuration',
    connected: 'Connected',
    disconnected: 'Disconnected',
    apiKey: 'API Key',
    baseUrl: 'Base URL',
    timeout: 'Timeout (ms)',
    testButton: 'Test Connection',
    noApiKey: 'Please configure API key first',
    testing: 'Testing connection...',
    testSuccess: 'Connection successful!',
    testFailed: 'Connection failed',
    unknownError: 'Unknown error',
    configButton: 'API Config',
    apiKeyHint: 'Enter your OpenAI API key',
    baseUrlHint: 'Default is the official OpenAI API URL',
    timeoutHint: 'Request timeout in milliseconds, default is 30000ms'
  },
  
  // 卡片列表组件
  cardList: {
    searchPlaceholder: 'Search cards...',
    sortByDate: 'Sort by date',
    sortByImportance: 'Sort by importance'
  },
  
  // 知识卡片组件
  knowledgeCard: {
    exportButton: 'Export',
    deleteButton: 'Delete',
    export: 'Export',
    delete: 'Delete'
  },
  
  // 通知消息
  notifications: {
    cardCreated: 'Knowledge card created successfully!',
    cardsCreated: '{{count}} knowledge cards created successfully!',
    processFailed: 'Failed to process text, please try again.',
    notConnected: 'API not connected, please configure and test API connection first',
    processing: 'Processing text...'
  }
};

export default enTranslation; 