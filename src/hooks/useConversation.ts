import { DEFAULT_CHAT_USER } from "@/common/constant";
import { useState, useRef } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
const PROXY_PREFIX = import.meta.env.VITE_API_PROXY_PREFIX;
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;

interface UseConversationReturn {
  chatHistory: any[];
  activeId: string;
  isMessageLoading: boolean;
  conversationIdRef: React.MutableRefObject<string>;
  loadConversation: (convId: string) => Promise<void>;
  startNewChat: () => void;
  deleteConversation: (e: React.MouseEvent, convId: string) => Promise<void>;
}

export const useConversation = (): UseConversationReturn => {
  const conversationIdRef = useRef<string>("");
  const [activeId, setActiveId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const user = useCurrentUser();
  const LOGIN_USER = user?.user_name || DEFAULT_CHAT_USER;

  const loadConversation = async (convId: string) => {
    if (isMessageLoading) return;
    setActiveId(convId);
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
      setIsMessageLoading(false);
    }
  };

  const startNewChat = () => {
    conversationIdRef.current = "";
    setActiveId("");
    setChatHistory([]);
  };

  const deleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
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
        if (activeId === convId) {
          startNewChat();
        }
      }
    } catch (e) {
      console.error("删除失败", e);
    }
  };

  return {
    chatHistory,
    activeId,
    isMessageLoading,
    conversationIdRef,
    loadConversation,
    startNewChat,
    deleteConversation,
  };
};
