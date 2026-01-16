# 🪨 StoneChat — 基于 AI 的泌尿系结石智能识别助手

> 利用 **Dify 工作流** 与 **多模态 AI 模型**，自动分析用户上传的结石显微图像，智能判断结石类型（如草酸钙、尿酸、磷酸铵镁等），为临床辅助诊断提供参考。

![StoneChat Preview](https://via.placeholder.com/800x400?text=StoneChat+UI+Preview)

---

## ✨ 核心功能

- 📷 **上传结石图像**：支持 JPG/PNG 等常见格式
- 🧠 **AI 自动分析**：通过 Dify 编排的多步工作流（图像理解 → 特征提取 → 类型分类）
- 📊 **结构化结果**：清晰展示结石类型、置信度及医学建议
- 🌐 **响应式设计**：适配桌面与移动端，使用 Tailwind CSS 构建

---

## 🛠 技术栈

| 类别          | 技术                                                           |
| ------------- | -------------------------------------------------------------- |
| **框架**      | React 19 + TypeScript                                          |
| **构建工具**  | Vite 7                                                         |
| **UI 组件库** | DeepChat + Lucide React 图标                                   |
| **样式方案**  | Tailwind CSS v4 + PostCSS                                      |
| **图像处理**  | Dify 工作流（内置多模态模型）                                  |
| **路由管理**  | React Router v7                                                |
| **辅助工具**  | UUID（会话 ID）、Axios（备用 API）、React Markdown（结果渲染） |

---

## 🚀 快速开始

### 前置要求

- Node.js ≥ 18.x
- npm / pnpm / yarn（推荐 pnpm）
- 已在 [Dify](https://cloud.dify.ai/) 创建应用并配置好**结石识别工作流**

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或 npm
npm install
```
