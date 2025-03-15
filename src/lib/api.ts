import { APIConfig, KnowledgeCard } from '../types';

/**
 * 调用 OpenAI API 生成知识卡片
 * @param text 用户输入的文本
 * @param apiConfig API 配置信息
 * @param cardCount 要生成的最大知识卡片数量
 * @param addNumbering 是否在标题前添加序号（此参数将在前端处理，不影响API调用）
 * @returns 生成的知识卡片数据数组
 */
export async function generateKnowledgeCard(text: string, apiConfig: APIConfig, cardCount: number = 1, addNumbering: boolean = true) {
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
            content: `你是一位经验丰富的知识整理助手，专长于信息提取和摘要。你的任务是从用户提供的文本中提取关键信息，并将其转化为结构化的知识卡片。这些卡片旨在帮助读者快速掌握文本的核心内容，即使他们对相关领域并不熟悉。

**目标：**

*   从提供的文本中提取关键信息。
*   生成的知识卡片应包含足够的信息，使不熟悉该主题的人也能理解其主要内容。
*   优先提取具有重要性、新颖性或影响力的信息。
*   如果可能，请指出信息之间的潜在联系或影响。

**输出格式：**

请严格遵循以下JSON格式输出，确保结果是一个数组（即使只有一个知识卡片）：
[
  {
    "title": "知识卡片标题 (简洁但具有描述性，不超过30个字)",
    "content": "内容摘要 (详细且全面，包含事件的背景、关键概念、主要观点、影响或结论，以及与其他信息的关联（如有）。尽量使用通俗易懂的语言，避免使用过于专业的术语，或对专业术语进行简要解释。字数控制在150-200字之间)",
    "tags": ["标签1", "标签2", "标签3"], // 标签应具有代表性，便于检索，最多三个。
    "importance": 数字 (1-5，表示重要性，1为最低，5为最高。评分标准应根据具体文本内容和应用场景进行调整。)
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

/**
 * 根据知识卡片内容生成封面信息
 * @param cards 知识卡片数组
 * @param apiConfig API 配置信息
 * @returns 生成的封面信息，包括标题、副标题和引用语
 */
export async function generateCoverInfo(cards: KnowledgeCard[], apiConfig: APIConfig) {
  try {
    // 检查 API 配置是否有效
    if (!apiConfig.apiKey) {
      throw new Error('API 密钥未配置');
    }

    // 如果没有卡片，返回默认值
    if (cards.length === 0) {
      return {
        title: '知识精华集锦',
        subtitle: '高效提取关键知识，构建个人专属知识体系',
        quote: '知识是人类进步的阶梯'
      };
    }

    // 提取所有卡片的标题和内容
    const cardsContent = cards.map(card => ({
      title: card.originalTitle || card.title.replace(/^\d+\.\s/, ''),
      content: card.content,
      tags: card.tags
    }));

    // 构建请求选项
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          {
            role: 'system',
            content: `你是一位专业的知识整理助手，擅长提炼主题和总结内容。你的任务是分析一组知识卡片的内容，并为这些卡片生成一个吸引人的封面信息。

封面信息应包括：
1. 标题：创造一个能够准确反映卡片内容主题的标题，应当简洁有力且与内容高度相关（不超过15个字，最好不是10个字）。避免使用"XX天"这类老套的时间限定词，而是直接突出内容的核心价值或主题。例如："思维模型指南"、"记忆力突破法则"、"高效学习规范"等。
2. 副标题：对主题的进一步阐述，提供更多上下文和价值承诺（不超过25个字）
3. 引用语：一句与主题相关的名言或格言，能够激发读者的思考（不超过20个字）

请确保生成的内容与卡片主题高度相关，标题应当准确反映卡片集合的实际内容和核心价值，而不是使用通用模板。
注意：请不要在回复中使用任何Markdown格式（如**加粗**、*斜体*等），只需提供纯文本内容。`
          },
          {
            role: 'user',
            content: `请根据以下知识卡片内容，生成一个吸引人的封面信息：\n\n${JSON.stringify(cardsContent, null, 2)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
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
      // 尝试从文本中提取标题、副标题和引用语
      const titleMatch = aiResponse.match(/标题[：:]\s*(.+?)(?:\n|$)/);
      const subtitleMatch = aiResponse.match(/副标题[：:]\s*(.+?)(?:\n|$)/);
      const quoteMatch = aiResponse.match(/引用语[：:]\s*(.+?)(?:\n|$)/);
      
      // 移除可能的Markdown标记
      const cleanMarkdown = (text: string) => {
        if (!text) return text;
        // 移除加粗标记
        return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/_/g, '');
      };
      
      return {
        title: cleanMarkdown(titleMatch ? titleMatch[1].trim() : '知识精华集锦'),
        subtitle: cleanMarkdown(subtitleMatch ? subtitleMatch[1].trim() : '提取关键知识，构建个人知识库'),
        quote: cleanMarkdown(quoteMatch ? quoteMatch[1].trim() : '知识是人类进步的阶梯')
      };
    } catch (parseError) {
      console.error('解析 AI 响应失败:', parseError, 'AI 响应:', aiResponse);
      
      // 如果解析失败，返回默认值
      return {
        title: '知识精华集锦',
        subtitle: '高效提取关键知识，构建个人专属知识体系',
        quote: '知识是人类进步的阶梯'
      };
    }
  } catch (error) {
    console.error('生成封面信息时出错:', error);
    
    // 出错时返回默认值
    return {
      title: '知识精华集锦',
      subtitle: '高效提取关键知识，构建个人专属知识体系',
      quote: '知识是人类进步的阶梯'
    };
  }
} 