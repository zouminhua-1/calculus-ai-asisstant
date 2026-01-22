import { useEffect } from "react";
import type { ConfirmOptions } from "./index";

export function ConfirmDialog({
  title = "确认操作",
  message = "你确定要继续吗？",
  confirmText = "确认",
  cancelText = "取消",
  danger,
  onClose,
}: ConfirmOptions & { onClose: (v: boolean) => void }) {
  // 禁止背景滚动（移动端很重要）
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onClose(false)}
      />

      {/* 弹窗 */}
      <div className="relative w-[90%] max-w-sm rounded-2xl bg-white p-4 shadow-lg">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 rounded-xl border px-4 py-2 text-sm"
            onClick={() => onClose(false)}
          >
            {cancelText}
          </button>

          <button
            className={`flex-1 rounded-xl px-4 py-2 text-sm text-white ${
              danger
                ? "bg-red-500 active:bg-red-600"
                : "bg-blue-500 active:bg-blue-600"
            }`}
            onClick={() => onClose(true)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
