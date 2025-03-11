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
            content: `你是一个知识提取助手，能够从文本中提取关键知识点并生成结构化的知识卡片。
请以JSON格式返回结果，格式如下：
{
  "title": "知识卡片标题",
  "content": "内容摘要，简明扼要地总结关键信息",
  "tags": ["标签1", "标签2", "标签3"],
  "importance": 数字(1-5，表示重要性)
}
不要返回任何其他格式或额外的解释文本，只返回JSON对象。`
          },
          {
            role: 'user',
            content: `请从以下文本中提取关键知识，并生成一个知识卡片：\n\n${text}`
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
    
    try {
      // 尝试解析 JSON 响应
      // 首先尝试直接解析
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponse);
      } catch {
        // 如果直接解析失败，尝试提取 JSON 部分
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析 AI 返回的 JSON 数据');
        }
      }
      
      // 验证解析后的数据是否包含所需字段
      if (!parsedResponse.title || !parsedResponse.content) {
        throw new Error('AI 返回的数据格式不正确');
      }
      
      return {
        title: parsedResponse.title,
        content: parsedResponse.content,
        tags: Array.isArray(parsedResponse.tags) ? parsedResponse.tags : ['AI生成'],
        importance: typeof parsedResponse.importance === 'number' ? 
          Math.min(Math.max(Math.round(parsedResponse.importance), 1), 5) : 3
      };
    } catch (parseError) {
      console.error('解析 AI 响应失败:', parseError, 'AI 响应:', aiResponse);
      
      // 如果 JSON 解析失败，返回默认值
      return {
        title: '未命名知识卡片',
        content: aiResponse.slice(0, 500),
        tags: ['AI生成'],
        importance: 3
      };
    }
  } catch (error) {
    console.error('生成知识卡片失败:', error);
    throw error;
  }
} 