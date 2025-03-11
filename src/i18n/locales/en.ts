const enTranslation = {
  // 应用标题
  appTitle: 'Knowledge Card Generator',
  
  // 文本输入组件
  textInput: {
    placeholder: 'Enter or paste text here...',
    processButton: 'Process Text',
    clearButton: 'Clear',
    charCount: '{{current}}/{{max}}',
    cardCount: 'Max Card Count:'
  },
  
  // API配置组件
  apiConfig: {
    title: 'API Configuration',
    connected: 'Connected',
    disconnected: 'Disconnected',
    apiKey: 'API Key',
    baseUrl: 'Base URL',
    timeout: 'Timeout (ms)',
    model: 'Model',
    maxTokens: 'Max Tokens',
    testButton: 'Test Connection',
    noApiKey: 'Please configure API key first',
    testing: 'Testing connection...',
    testSuccess: 'Connection successful!',
    testFailed: 'Connection failed',
    unknownError: 'Unknown error',
    configButton: 'API Config',
    apiKeyHint: 'Enter your OpenAI API key',
    baseUrlHint: 'Default is the official OpenAI API URL',
    timeoutHint: 'Request timeout in milliseconds, default is 600000ms',
    modelHint: 'Set the AI model to use, e.g.: gpt-4o, gpt-3.5-turbo, etc.',
    maxTokensHint: 'Set the maximum number of tokens for generated content, larger values can generate longer content'
  },
  
  // 卡片列表组件
  cardList: {
    searchPlaceholder: 'Search cards...',
    sortByDate: 'Sort by date',
    sortByImportance: 'Sort by importance',
    exportAllImages: 'Export All Images',
    exporting: 'Exporting...'
  },
  
  // 知识卡片组件
  knowledgeCard: {
    exportButton: 'Export',
    deleteButton: 'Delete',
    export: 'Export',
    delete: 'Delete',
    exportAll: 'Export All'
  },
  
  // 通知消息
  notifications: {
    cardCreated: 'Knowledge card created successfully!',
    cardsCreated: '{{count}} knowledge cards created successfully!',
    processFailed: 'Failed to process text, please try again.',
    notConnected: 'API not connected, please configure and test API connection first',
    processing: 'Processing text...',
    exportingImages: 'Exporting images ({{current}}/{{total}})...',
    exportSuccess: 'Successfully exported {{count}} card images',
    exportFailed: 'Failed to export images',
    noCardsToExport: 'No cards to export',
    generatingZip: 'Generating zip file...'
  }
};

export default enTranslation; 