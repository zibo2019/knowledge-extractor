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
    testButton: '测试连接'
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
    processFailed: '处理文本失败，请重试。'
  }
};

export default zhTranslation; 