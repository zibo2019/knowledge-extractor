# 知识提取器 (Knowledge Extractor)

## 项目简介

知识提取器是一个基于React和OpenAI API的Web应用，旨在帮助用户从文本中自动提取关键知识点并生成结构化的知识卡片。这些卡片可以被组织、编辑和导出，便于学习和知识管理。

## 主要功能

- **文本知识提取**：输入文本，自动提取关键知识点
- **知识卡片生成**：将提取的知识点转化为可视化卡片
- **卡片管理**：拖拽排序、编辑、删除知识卡片
- **标签系统**：为知识卡片添加标签，便于分类和筛选
- **重要性标记**：标记知识点的重要程度
- **导出功能**：支持导出为PDF、图片或ZIP格式
- **暗黑模式**：支持明亮和暗黑两种界面模式
- **多语言支持**：内置国际化功能，支持多语言界面

## 技术栈

- **前端框架**：React 18
- **构建工具**：Vite
- **样式方案**：TailwindCSS
- **状态管理**：Zustand
- **拖拽功能**：@dnd-kit
- **国际化**：i18next
- **类型检查**：TypeScript
- **导出功能**：jspdf、jszip、dom-to-image

## 安装与运行

### 环境要求

- Node.js 16.0+
- npm 或 pnpm

### 安装步骤

1. 克隆项目到本地

```bash
git clone [项目仓库URL]
cd knowledge-extractor
```

2. 安装依赖

```bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
```

3. 启动开发服务器

```bash
# 使用npm
npm run dev

# 或使用pnpm
pnpm dev
```

4. 构建生产版本

```bash
# 使用npm
npm run build

# 或使用pnpm
pnpm build
```

## 使用指南

1. **配置API**：首次使用时，点击右上角的API配置按钮，设置OpenAI API密钥和相关参数
2. **输入文本**：在文本输入框中粘贴或输入需要提取知识点的文本
3. **生成卡片**：点击"生成知识卡片"按钮，系统将自动分析文本并生成知识卡片
4. **管理卡片**：
   - 拖拽卡片可调整顺序
   - 点击卡片右上角的编辑按钮可修改卡片内容
   - 点击删除按钮可移除卡片
5. **导出知识**：使用导出功能将知识卡片导出为所需格式

## 项目结构

```
knowledge-extractor/
├── src/                  # 源代码目录
│   ├── components/       # React组件
│   ├── lib/              # 工具函数和API调用
│   ├── store/            # Zustand状态管理
│   ├── i18n/             # 国际化配置
│   ├── types/            # TypeScript类型定义
│   ├── styles/           # 样式文件
│   └── assets/           # 静态资源
├── public/               # 公共资源
└── ...                   # 配置文件
```

## 贡献指南

欢迎对本项目提出改进建议或直接贡献代码。请遵循以下步骤：

1. Fork本项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

## 许可证

本项目采用MIT许可证 - 详情请参见LICENSE文件

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 项目Issues页面
- 电子邮件：[您的邮箱]

---

**注意**：使用本应用需要有效的OpenAI API密钥。 