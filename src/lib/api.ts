import { APIConfig } from '../types';

/**
 * 调用 OpenAI API 生成知识卡片
 * @param text 用户输入的文本
 * @param apiConfig API 配置信息
 * @param cardCount 要生成的最大知识卡片数量
 * @returns 生成的知识卡片数据数组
 */
export async function generateKnowledgeCard(text: string, apiConfig: APIConfig, cardCount: number = 1) {
  try {
    // 检查 API 配置是否有效
    if (!apiConfig.apiKey) {
      throw new Error('API 密钥未配置');
    }

    // 构建请求选项
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: apiConfig.model, // 使用配置中的模型
        messages: [
          {
            role: 'system',
            content: `你是一位在人工智能和信息提取领域具有丰富经验的知识整理助手。你的任务是从给定的AI日报文本中提取当日最重要的新闻，并将其转化为结构化的知识卡片。这些卡片应该能够帮助读者快速了解AI领域的最新进展，即使他们对AI领域并不熟悉。

**目标：** 生成的知识卡片应包含足够的信息，使不熟悉该主题的人也能理解其主要内容。优先提取具有突破性、创新性或重大影响的新闻。如果可能，请指出新闻之间的潜在联系或影响。

**输出格式：** 请严格遵循以下JSON格式输出，确保结果是一个数组（即使只有一个知识卡片）：

[
  {
    "title": "1. 知识卡片标题 (简洁但具有描述性，带上序号，不超过20个字)",
    "content": "内容摘要 (详细且全面，包含新闻事件的背景、关键技术或概念、主要观点、影响或结论，以及与其他新闻的关联（如有）。避免使用过于专业的术语，或对专业术语进行简要解释。字数控制在150-200字之间)",
    "tags": ["标签1", "标签2", "标签3"], // 标签应具有代表性，便于检索，最多三个。例如：技术、应用、公司、政策等。
    "importance": 数字 (1-5，表示重要性，1为最低，5为最高。评分标准：5 - 对AI领域有重大影响，可能改变行业格局；4 - 重要的新技术突破或应用；3 - 值得关注的新闻事件；2 - 一般性的行业动态；1 - 信息量较低的新闻。)
  },
  ... // 更多知识卡片
]
`
          },
          {
            role: 'user',
            content: `请从以下文本中提取关键知识，并最多生成${cardCount}个知识卡片：\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: apiConfig.maxTokens // 使用配置中的最大令牌数
      }),
      signal: AbortSignal.timeout(apiConfig.timeout)
    };

    // 发送请求到 OpenAI API
    const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 请求失败: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // 解析 AI 返回的内容
    const aiResponse = data.choices[0].message.content;
    
    try {
      // 尝试解析 JSON 响应
      // 首先尝试直接解析
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponse);
      } catch {
        // 如果直接解析失败，尝试提取 JSON 部分
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析 AI 返回的 JSON 数据');
        }
      }
      
      // 确保解析后的数据是数组
      if (!Array.isArray(parsedResponse)) {
        parsedResponse = [parsedResponse]; // 如果不是数组，将其转换为数组
      }
      
      // 验证并处理每个卡片数据
      return parsedResponse.map(card => ({
        title: card.title || '未命名知识卡片',
        content: card.content || '无内容',
        tags: Array.isArray(card.tags) ? card.tags : ['AI生成'],
        importance: typeof card.importance === 'number' ? 
          Math.min(Math.max(Math.round(card.importance), 1), 5) : 3
      }));
    } catch (parseError) {
      console.error('解析 AI 响应失败:', parseError, 'AI 响应:', aiResponse);
      
      // 如果 JSON 解析失败，返回默认值
      return [{
        title: '未命名知识卡片',
        content: aiResponse.slice(0, 500),
        tags: ['AI生成'],
        importance: 3
      }];
    }
  } catch (error) {
    console.error('生成知识卡片失败:', error);
    throw error;
  }
} 