import { useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { DEFAULT_CHAT_USER } from "@/common/constant";

const PROXY_PREFIX = import.meta.env.VITE_API_PROXY_PREFIX;
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;

interface UseChatHistoryReturn {
  historyList: any[];
  isListLoading: boolean;
  fetchHistoryList: () => Promise<void>;
}

export const useChatHistory = (): UseChatHistoryReturn => {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const user = useCurrentUser();
  const LOGIN_USER = user?.user_name || DEFAULT_CHAT_USER;

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

  return {
    historyList,
    isListLoading,
    fetchHistoryList,
  };
};
