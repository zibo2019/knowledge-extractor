const zhTranslation = {
  // 应用标题
  appTitle: 'AI日报知识卡片生成器',
  
  // 文本输入组件
  textInput: {
    placeholder: '在此输入或粘贴文本...',
    processButton: '处理文本',
    clearButton: '清除',
    charCount: '{{current}}/{{max}}',
    cardCount: '最大卡片数量:',
    addNumbering: '添加序号 (1. 2. 3.)'
  },
  
  // API配置组件
  apiConfig: {
    title: 'API 配置',
    connected: '已连接',
    disconnected: '未连接',
    apiKey: 'API 密钥',
    baseUrl: '基础 URL',
    timeout: '超时时间 (毫秒)',
    model: '模型',
    maxTokens: '最大令牌数',
    testButton: '测试连接',
    noApiKey: '请先配置 API 密钥',
    testing: '正在测试连接...',
    testSuccess: '连接成功！',
    testFailed: '连接失败',
    unknownError: '未知错误',
    configButton: 'API 配置',
    apiKeyHint: '输入您的 OpenAI API 密钥',
    baseUrlHint: '默认为 OpenAI 官方 API 地址',
    timeoutHint: '请求超时时间，默认为 600000 毫秒',
    modelHint: '设置要使用的AI模型，例如：gpt-4o, gpt-3.5-turbo等',
    maxTokensHint: '设置生成内容的最大令牌数，较大的值可以生成更长的内容'
  },
  
  // 卡片列表组件
  cardList: {
    exportAllImages: '导出所有图片',
    exporting: '正在导出...',
    selectAll: '全选',
    deselectAll: '取消全选',
    exportSelected: '导出选中卡片',
    noCardSelected: '请先选择卡片'
  },
  
  // 知识卡片组件
  knowledgeCard: {
    exportButton: '导出',
    deleteButton: '删除',
    export: '导出',
    delete: '删除',
    exportAll: '导出所有',
    select: '选择'
  },
  
  // 通知消息
  notifications: {
    cardCreated: '知识卡片创建成功！',
    cardsCreated: '{{count}}个知识卡片创建成功！',
    processFailed: '处理文本失败，请重试。',
    notConnected: 'API 未连接，请先配置并测试 API 连接',
    processing: '正在处理文本...',
    exportingImages: '正在导出图片 ({{current}}/{{total}})...',
    exportSuccess: '成功导出 {{count}} 张卡片图片',
    exportFailed: '导出图片失败',
    noCardsToExport: '没有可导出的卡片',
    generatingZip: '正在生成压缩文件...',
    cardOrderUpdated: '卡片顺序已更新'
  }
};

export default zhTranslation; 