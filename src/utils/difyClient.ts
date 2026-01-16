const API_KEY = 'YOUR_DIFY_API_KEY'; // 直接写死或用 .env
const API_BASE = 'https://api.dify.ai/v1';

/**
 * 发送流式聊天消息
 */
export function sendMessageStream(
  query: string,
  inputs: Record<string, any> = {},
  callbacks: {
    onData?: (chunk: string) => void;
    onComplete?: () => void;
    onError?: (err: any) => void;
  }
) {
  const url = `${API_BASE}/chat-messages`;
  const eventSource = new EventSource(`${url}?stream=true`, {
    withCredentials: false,
  } as any); // EventSource 在 TS 里要断言

  // 监听数据
  eventSource.onmessage = (e) => {
    if (e.data === '[DONE]') {
      callbacks.onComplete?.();
      eventSource.close();
      return;
    }
    try {
      const data = JSON.parse(e.data);
      const text = data.answer || '';
      callbacks.onData?.(text);
    } catch (err) {
      console.error('解析流数据出错', err);
    }
  };

  eventSource.onerror = (err) => {
    callbacks.onError?.(err);
    eventSource.close();
  };

  // 发送 POST 初始化对话
  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs,
      query,
      user: 'frontend-user', // 每个用户唯一 ID
      response_mode: 'streaming',
    }),
  }).catch((err) => callbacks.onError?.(err));
}

/**
 * 上传文件到 Dify（直接存储在 Dify）
 */
export async function uploadFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) {
    console.error('上传失败', await res.text());
    return null;
  }

  const data = await res.json();
  return data.id || null;
}
