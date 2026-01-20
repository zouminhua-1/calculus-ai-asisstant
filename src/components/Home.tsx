import React, { useEffect, useRef, useState } from "react";
import { DeepChat } from "deep-chat-react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Plus, X, Loader2 } from "lucide-react";

import doctor from "@/assets/doctor.png";
import robot from "@/assets/robot.png";
import { introPanelHtml } from "./data";

import HistoryItem from "./HistoryItem";
import EmptyHistoryState from "./EmptyHistoryState";

const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;
const LOGIN_USER = "deep-chat-user";
const PROXY_PREFIX = import.meta.env.VITE_API_PROXY_PREFIX;

console.log("Using API Proxy Prefix:", PROXY_PREFIX);
const Home: React.FC = () => {
  const chatRef = useRef<any>(null);
  const conversationIdRef = useRef<string>("");
  const [activeId, setActiveId] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const [isListLoading, setIsListLoading] = useState(false); // 列表初始化加载
  const [isMessageLoading, setIsMessageLoading] = useState(false); // 切换会话加载

  const fetchHistoryList = async () => {
    try {
      setIsListLoading(true);
      const res = await fetch(
        `${PROXY_PREFIX}/conversations?user=${LOGIN_USER}&limit=20`,
        {
          headers: { Authorization: `Bearer ${DIFY_API_KEY}` },
        },
      );
      const data = await res.json();
      setHistoryList(data.data || []);
    } catch (e) {
      console.error("获取历史失败", e);
    } finally {
      setIsListLoading(false);
    }
  };

  // 加载选中的历史会话
  const loadConversation = async (convId: string) => {
    if (isMessageLoading) return;
    setActiveId(convId);
    setIsDrawerOpen(false);
    setIsMessageLoading(true);
    conversationIdRef.current = convId;
    try {
      const res = await fetch(
        `${PROXY_PREFIX}/messages?user=${LOGIN_USER}&conversation_id=${convId}`,
        {
          headers: { Authorization: `Bearer ${DIFY_API_KEY}` },
        },
      );
      const data = await res.json();

      const formattedMessages = data.data.reverse().flatMap((m: any) => [
        { role: "user", text: m.query },
        { role: "ai", text: m.answer },
      ]);
      setChatHistory(formattedMessages);
    } catch (e) {
      console.error("加载消息失败", e);
    } finally {
      setIsMessageLoading(false); // 结束加载
    }
  };

  // 开启新对话
  const startNewChat = () => {
    conversationIdRef.current = "";
    setActiveId("");
    setChatHistory([]); // 清空历史，触发组件重置
    setIsDrawerOpen(false);
  };

  // 3. 新增：删除会话功能
  const deleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation(); // 阻止触发 loadConversation
    if (!confirm("确定要删除这段对话吗？")) return;

    try {
      const res = await fetch(`${PROXY_PREFIX}/conversations/${convId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIFY_API_KEY}`,
        },
        body: JSON.stringify({ user: LOGIN_USER }),
      });

      if (res.ok) {
        // 更新本地列表
        setHistoryList((prev) => prev.filter((item) => item.id !== convId));
        // 如果删除的是当前正在聊天的，重置聊天窗口
        if (activeId === convId) {
          startNewChat();
        }
      }
    } catch (e) {
      console.error("删除失败", e);
    }
  };

  /**
   * 核心逻辑：拦截 Deep Chat 请求并转换为 Dify 接口调用
   */
  const requestHandler = async (body: any, signals) => {
    const { onResponse, onClose } = signals;
    console.log("RequestHandler Body:", body);

    try {
      let userText = "";
      let userFiles: File[] = [];
      if (body instanceof FormData) {
        // 1. 获取文字：Deep Chat 默认将消息放在 'message1', 'message2' 等 key 中，或者 'messages' 字符串
        // 获取用户最后输入的文字
        const message = body.get("message1") as unknown as {
          role: string;
          text: string;
        };
        userText = message?.text || "";
        // 2. 获取文件：Deep Chat 默认将文件放入 'files' 字段
        const filesFromForm = body.getAll("files") as File[];
        userFiles = filesFromForm;
      } else {
        // 保持原有的 JSON 解析逻辑
        for (const msg of body.messages ?? []) {
          if (msg.text) userText += msg.text;
          if (msg.files) userFiles.push(...msg.files);
        }
      }

      let uploadedFileId = "";
      // 1. 文件上传处理
      if (userFiles && userFiles.length > 0) {
        const fileItem = userFiles[0];

        const formData = new FormData();
        // Dify 上传接口要求必须包含 file 和 user
        formData.append("file", fileItem, fileItem.name || "image.png");
        formData.append("user", LOGIN_USER);

        const uploadRes = await fetch(`${PROXY_PREFIX}/files/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${DIFY_API_KEY}` },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("文件上传至 Dify 失败");
        const uploadData = await uploadRes.json();
        uploadedFileId = uploadData.id;
      }

      const payload: Record<string, any> = {
        inputs: {},
        query: userText || "请分析这张图片",
        user: LOGIN_USER,
        response_mode: "streaming",
        conversation_id: conversationIdRef.current || undefined,
      };
      console.log("uploadedFileId:", uploadedFileId);

      if (uploadedFileId) {
        payload.files = [
          {
            type: "image",
            transfer_method: "local_file",
            upload_file_id: uploadedFileId,
          },
        ];
      }
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIFY_API_KEY}`,
        },
        body: JSON.stringify(payload),
      };
      // 2. 调用 Dify 聊天接口
      const chatResponse = await fetch(`${PROXY_PREFIX}/chat-messages`, params);

      if (!chatResponse.ok) {
        const errorText = await chatResponse.text();
        throw new Error(`Dify 接口异常: ${errorText}`);
      }

      // 3. 健壮的流式数据解析逻辑
      const reader = chatResponse.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; // 缓冲区：处理被截断的 JSON 字符串

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解码并存入缓冲区
        buffer += decoder.decode(value, { stream: true });

        // 按行切割数据块
        const lines = buffer.split("\n");

        // 关键：保留最后一行（可能不完整），剩下的行进行解析
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith("data:")) continue;

          try {
            // 提取 data: 之后的 JSON 内容
            const data = JSON.parse(trimmedLine.substring(5));

            console.log("Dify Stream Data:", data);

            if (data.conversation_id && !conversationIdRef.current) {
              conversationIdRef.current = data.conversation_id;
              console.log("已捕获并保存会话 ID:", data.conversation_id);
            }

            if (data.event === "message" || data.event === "agent_message") {
              // 实时推送文本给 Deep Chat UI
              onResponse({ text: data.answer, overwrite: false });
            } else if (data.event === "error") {
              const finalAnswer =
                data.data?.outputs?.answer || data.metadata?.usage ? "" : null;
              if (finalAnswer) {
                onResponse({ text: finalAnswer, overwrite: false });
              }
            }
          } catch (e) {
            // 如果解析失败，说明这行可能不完整，放回缓冲区等下一块
            console.warn("解析行失败，跳过:", trimmedLine);
          }
        }
      }
      console.log("Dify Stream Ended");
    } catch (e: any) {
      console.error("RequestHandler Error:", e);
      onResponse({ error: e.message || "连接 Dify 出错，请稍后再试" });
    } finally {
      // 关闭流
      onClose();
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-white overflow-hidden text-slate-900 transition-colors">
      {/* 消息加载中的全局遮罩（可选，提升体感） */}
      {isMessageLoading && (
        <div className="fixed inset-0 z-[100] bg-white/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* 1. 自定义抽屉 (Drawer) */}
      {/* 侧边抽屉 */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)} // 点击外部关闭
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#171717] text-white z-[70] shadow-2xl flex flex-col"
            >
              {/* Header 部分 */}
              <div className="p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">历史记录</h2>
                <button onClick={() => setIsDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* 列表内容 */}
              <div className="flex-1 overflow-y-auto px-3 space-y-3 custom-scrollbar">
                {isListLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Loader2
                      className="animate-spin text-blue-400 mb-2"
                      size={30}
                    />
                    <p className="text-xs tracking-widest uppercase">
                      加载中...
                    </p>
                  </div>
                ) : historyList.length > 0 ? (
                  historyList.map((item) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      activeId={activeId}
                      onSelect={loadConversation}
                      onDelete={deleteConversation}
                    />
                  ))
                ) : (
                  /* --- 空状态展示 --- */
                  <EmptyHistoryState onStartNew={startNewChat} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. 主聊天区域 */}
      <div className="flex-1 flex flex-col w-full relative">
        {/* 顶部状态栏 */}
        <header className="h-14 px-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
              fetchHistoryList();
            }}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition-transform"
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-sm font-bold tracking-tight">
              AI 影像分析
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Online
              </span>
            </div>
          </div>

          <button onClick={startNewChat} className="p-2 -mr-2 text-blue-600">
            <Plus size={24} />
          </button>
        </header>

        {/* 聊天内容 */}
        <main className="flex-1 overflow-hidden relative">
          <DeepChat
            ref={chatRef}
            history={chatHistory}
            images={{
              files: {
                maxNumberOfFiles: 1,
                acceptedFormats: ".png,.jpg,.jpeg",
              },
            }}
            introMessage={{
              html: introPanelHtml,
            }}
            avatars={{
              user: {
                src: doctor,
                styles: { container: { width: "35px", height: "35px" } },
              },
              ai: {
                src: robot,
                styles: { container: { width: "35px", height: "35px" } },
              },
            }}
            connect={{ handler: requestHandler, stream: true }}
            style={{
              height: "90vh",
              width: "100vw",
              border: "none",
              backgroundColor: "transparent",
            }}
            messageStyles={{
              default: {
                user: {
                  bubble: {
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "20px 20px 4px 20px",
                    padding: "12px 16px",
                    fontSize: "15px",
                  },
                },
                ai: {
                  bubble: {
                    backgroundColor: "#f1f5f9",
                    color: "#1e293b",
                    borderRadius: "20px 20px 20px 4px",
                    padding: "12px 16px",
                    fontSize: "15px",
                    maxWidth: "90%",
                  },
                },
              },
            }}
            textInput={{
              placeholder: { text: "输入问题或发送图片..." },
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;
