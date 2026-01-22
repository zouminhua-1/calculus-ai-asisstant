import React, { useEffect, useRef, useState } from "react";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useConversation } from "@/hooks/useConversation";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatArea } from "@/components/ChatArea";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import useCurrentUser from "@/hooks/useCurrentUser";
import { DEFAULT_CHAT_USER } from "@/common/constant";

const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;
const PROXY_PREFIX = import.meta.env.VITE_API_PROXY_PREFIX;

const Home: React.FC = () => {
  const chatRef = useRef<any>(null);
  const user = useCurrentUser();
  const LOGIN_USER = user?.user_name || DEFAULT_CHAT_USER;
  console.log("LOGIN_USER:", LOGIN_USER);
  const { historyList, isListLoading, fetchHistoryList } = useChatHistory();
  const {
    chatHistory,
    activeId,
    isMessageLoading,
    conversationIdRef,
    loadConversation,
    startNewChat,
    deleteConversation,
  } = useConversation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      <HistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        historyList={historyList}
        isLoading={isListLoading}
        activeId={activeId}
        onFetchHistory={fetchHistoryList}
        onSelect={loadConversation}
        onDelete={deleteConversation}
        onNewChat={startNewChat}
      />
      <div className="flex-1 flex flex-col w-full relative">
        <ChatHeader
          onMenuClick={() => setIsDrawerOpen(true)}
          onNewChat={startNewChat}
        />
        <ChatArea
          ref={chatRef}
          history={chatHistory}
          isMessageLoading={isMessageLoading}
          requestHandler={requestHandler}
        />
      </div>
    </div>
  );
};

export default Home;
