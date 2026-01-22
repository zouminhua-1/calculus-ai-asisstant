import React from "react";
import { Menu, Plus } from "lucide-react";

interface ChatHeaderProps {
  onMenuClick: () => void;
  onNewChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMenuClick,
  onNewChat,
}) => {
  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition-transform"
      >
        <Menu size={24} />
      </button>

      <div className="flex flex-col items-center">
        <span className="text-sm font-bold tracking-tight">AI 影像分析</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
            Online
          </span>
        </div>
      </div>

      <button onClick={onNewChat} className="p-2 -mr-2 text-blue-600">
        <Plus size={24} />
      </button>
    </header>
  );
};
