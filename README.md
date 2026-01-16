🪨 StoneChat — 基于 AI 的泌尿系结石智能识别助手
利用 Dify 工作流 与 多模态 AI 模型，自动分析用户上传的结石显微图像，智能判断结石类型（如草酸钙、尿酸、磷酸铵镁等），为临床辅助诊断提供参考。
✨ 核心功能
📷 上传结石图像：支持 JPG/PNG 等常见格式
🧠 AI 自动分析：通过 Dify 编排的多步工作流（图像理解 → 特征提取 → 类型分类）
📊 结构化结果：清晰展示结石类型、置信度及医学建议
💬 对话式交互：基于 deep-chat-react 实现自然语言追问与解释
🌐 响应式设计：适配桌面与移动端，使用 Tailwind CSS 构建
🛠 技术栈
表格
类别 技术
框架 React 19 + TypeScript
构建工具 Vite 7
UI 组件库 Ant Design X (@ant-design/x) + Lucide React 图标
样式方案 Tailwind CSS v4 + PostCSS
AI 集成 Dify Client SDK
图像处理 Dify 工作流（内置多模态模型）
路由管理 React Router v7
辅助工具 UUID（会话 ID）、Axios（备用 API）、React Markdown（结果渲染）
🚀 快速开始
前置要求
Node.js ≥ 18.x
npm / pnpm / yarn（推荐 pnpm）
已在 Dify 创建应用并配置好结石识别工作流
安装依赖
bash

编辑

# 使用 pnpm（推荐）

pnpm install

# 或 npm

npm install
配置环境变量
在项目根目录创建 .env.local 文件：
env

编辑

# Dify 应用配置（必填！）

VITE_DIFY_API_KEY=your_dify_api_key_here
VITE_DIFY_APP_ID=your_dify_app_id_here

# 可选：Supabase（若用于日志或用户存储）

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
🔑 如何获取 Dify API Key 和 App ID？
登录 Dify → 进入你的应用 → 「API」页面 → 复制 API Key 和 App ID
启动开发服务器
bash

编辑

pnpm dev
访问 http://localhost:5173 即可开始使用！
构建生产版本
bash

编辑

pnpm build
pnpm preview # 本地预览构建结果
🤖 Dify 工作流说明
本项目依赖一个在 Dify 中预先配置好的 “结石图像分类”工作流，建议包含以下节点：
用户上传图片 → 触发工作流
多模态 LLM 节点 → 分析图像特征（如晶体形态、颜色、纹理）
规则/分类器节点 → 映射到具体结石类型（草酸钙、尿酸、胱氨酸等）
结构化输出 → 返回 JSON 格式结果（含类型、置信度、建议）
💡 提示：可在 Dify 中添加“追问”逻辑，当图像模糊时引导用户重新上传。
