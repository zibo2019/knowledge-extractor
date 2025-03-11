import { APIConfig } from '../types';

/**
 * 调用 OpenAI API 生成知识卡片
 * @param text 用户输入的文本
 * @param apiConfig API 配置信息
 * @returns 生成的知识卡片数据
 */
export async function generateKnowledgeCard(text: string, apiConfig: APIConfig) {
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
        model: 'gpt-3.5-turbo', // 可以根据需要更改模型
        messages: [
          {
            role: 'system',
            content: '你是一个知识提取助手，能够从文本中提取关键知识点并生成结构化的知识卡片。'
          },
          {
            role: 'user',
            content: `请从以下文本中提取关键知识，并生成一个知识卡片，包括标题、内容摘要、相关标签和重要性评分(1-5)：\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
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
    
    // 尝试从 AI 响应中提取结构化数据
    // 这里使用一个简单的解析方法，实际应用中可能需要更复杂的解析逻辑
    const titleMatch = aiResponse.match(/标题[:：]\s*(.+)/i);
    const contentMatch = aiResponse.match(/内容[:：]\s*(.+)/i);
    const tagsMatch = aiResponse.match(/标签[:：]\s*(.+)/i);
    const importanceMatch = aiResponse.match(/重要性[:：]\s*(\d+)/i);

    return {
      title: titleMatch ? titleMatch[1] : '未命名知识卡片',
      content: contentMatch ? contentMatch[1] : aiResponse,
      tags: tagsMatch ? tagsMatch[1].split(/[,，、]/).map(tag => tag.trim()) : ['AI生成'],
      importance: importanceMatch ? parseInt(importanceMatch[1]) : 3
    };
  } catch (error) {
    console.error('生成知识卡片失败:', error);
    throw error;
  }
} 