import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import HistoryItem from "./HistoryItem";
import EmptyHistoryState from "./EmptyHistoryState";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: any[];
  isLoading: boolean;
  activeId: string;
  onFetchHistory: () => void;
  onSelect: (convId: string) => void;
  onDelete: (e: React.MouseEvent, convId: string) => void;
  onNewChat: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyList,
  isLoading,
  activeId,
  onFetchHistory,
  onSelect,
  onDelete,
  onNewChat,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#171717] text-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">历史记录</h2>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-3 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <Loader2
                    className="animate-spin text-blue-400 mb-2"
                    size={30}
                  />
                  <p className="text-xs tracking-widest uppercase">加载中...</p>
                </div>
              ) : historyList.length > 0 ? (
                historyList.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    activeId={activeId}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <EmptyHistoryState onStartNew={onNewChat} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
