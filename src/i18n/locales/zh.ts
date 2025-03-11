const zhTranslation = {
  // 应用标题
  appTitle: '知识提取器',
  
  // 文本输入组件
  textInput: {
    placeholder: '在此输入或粘贴文本...',
    processButton: '处理文本',
    uploadButton: '上传文件',
    clearButton: '清除',
    charCount: '{{current}}/{{max}}'
  },
  
  // API配置组件
  apiConfig: {
    title: 'API 配置',
    connected: '已连接',
    disconnected: '未连接',
    apiKey: 'API 密钥',
    baseUrl: '基础 URL',
    timeout: '超时时间 (毫秒)',
    testButton: '测试连接',
    noApiKey: '请先配置 API 密钥',
    testing: '正在测试连接...',
    testSuccess: '连接成功！',
    testFailed: '连接失败',
    unknownError: '未知错误',
    configButton: 'API 配置',
    apiKeyHint: '输入您的 OpenAI API 密钥',
    baseUrlHint: '默认为 OpenAI 官方 API 地址',
    timeoutHint: '请求超时时间，默认为 30000 毫秒'
  },
  
  // 卡片列表组件
  cardList: {
    searchPlaceholder: '搜索卡片...',
    sortByDate: '按日期排序',
    sortByImportance: '按重要性排序'
  },
  
  // 知识卡片组件
  knowledgeCard: {
    exportButton: '导出',
    deleteButton: '删除'
  },
  
  // 通知消息
  notifications: {
    cardCreated: '知识卡片创建成功！',
    processFailed: '处理文本失败，请重试。',
    notConnected: 'API 未连接，请先配置并测试 API 连接',
    processing: '正在处理文本...'
  }
};

export default zhTranslation; 