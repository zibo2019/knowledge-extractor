const enTranslation = {
  // 应用标题
  appTitle: 'Knowledge Extractor',
  
  // 文本输入组件
  textInput: {
    placeholder: 'Enter or paste text here...',
    processButton: 'Process Text',
    uploadButton: 'Upload File',
    clearButton: 'Clear',
    charCount: '{{current}}/{{max}}'
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
    unknownError: 'Unknown error'
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
    deleteButton: 'Delete'
  },
  
  // 通知消息
  notifications: {
    cardCreated: 'Knowledge card created successfully!',
    processFailed: 'Failed to process text, please try again.',
    notConnected: 'API not connected, please configure and test API connection first',
    processing: 'Processing text...'
  }
};

export default enTranslation; 