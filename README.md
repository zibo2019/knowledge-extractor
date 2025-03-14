# AI知识提取器

AI知识提取器是一款基于人工智能的桌面应用程序，帮助用户从文本中提取关键知识点并生成结构化的知识卡片。这些卡片可以轻松管理、编辑和导出为各种格式，提高学习和知识组织效率。

## 功能特点

- **智能知识提取**：自动从输入文本中提取关键知识点
- **可自定义知识卡片**：为每张知识卡片添加标题、内容、标签和重要性评级
- **多语言支持**：支持中文和其他语言（通过i18n国际化）
- **暗黑模式**：提供舒适的深色主题界面
- **灵活的导出选项**：导出卡片为图片或PDF文件
- **卡片拖拽排序**：通过拖放重新组织卡片顺序
- **批量操作**：支持批量选择和导出卡片
- **API配置**：支持配置自定义API接口

## 技术栈

- **前端**：React + TypeScript + Tailwind CSS
- **桌面应用**：Tauri（Rust + Web技术）
- **状态管理**：Zustand
- **国际化**：i18next
- **UI组件**：自定义组件 + Lucide图标
- **拖拽功能**：@dnd-kit

## 安装与运行

### 开发环境

1. 确保已安装以下依赖：
   - Node.js (v16+)
   - Rust (用于Tauri)
   - pnpm或npm

2. 克隆项目并安装依赖：
   ```bash
   git clone https://github.com/yourusername/ai-knowledge-extractor.git
   cd ai-knowledge-extractor
   pnpm install  # 或 npm install
   ```

3. 启动开发服务器：
   ```bash
   # 仅启动Web开发服务器
   pnpm dev  # 或 npm run dev
   
   # 启动Tauri应用（同时启动Web服务器和Tauri）
   pnpm tauri:dev  # 或 npm run tauri:dev
   ```

### 构建应用

构建桌面应用程序：
```bash
pnpm tauri:build  # 或 npm run tauri:build
```

构建完成后，可执行文件将位于 `src-tauri/target/release` 目录下。

## 使用指南

1. **配置API**：首次使用时，点击右上角的API配置按钮，设置OpenAI API密钥和模型选项
2. **提交文本**：在文本输入框中粘贴或输入您想要提取知识点的文本
3. **生成卡片**：点击"生成知识卡片"按钮，AI将分析文本并生成知识卡片
4. **管理卡片**：
   - 拖拽卡片调整顺序
   - 点击编辑按钮修改卡片内容
   - 调整星级评分标记重要性
   - 使用标签分类知识点
5. **导出卡片**：
   - 单张导出：点击卡片上的下载按钮导出为图片
   - 批量导出：选择多张卡片后点击批量导出按钮

## 贡献指南

欢迎通过以下方式参与项目贡献：
1. 提交Issue报告问题或建议新功能
2. 提交Pull Request改进代码
3. 改进文档或翻译

## 许可证

本项目采用MIT许可证。详情请参阅LICENSE文件。 