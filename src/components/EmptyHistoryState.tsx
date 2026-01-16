import { Ghost, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
const EmptyHistoryState = ({ onStartNew }: { onStartNew: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
  >
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
      <Ghost className="text-white/20" size={40} />
    </div>
    <h3 className="text-white/80 font-medium mb-2">暂无历史记录</h3>
    <p className="text-white/40 text-xs leading-relaxed mb-6">
      您的分析报告将会保存在这里，方便随时查看。
    </p>
    <button
      onClick={onStartNew}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all active:scale-95"
    >
      <Sparkles size={16} />
      开启首次咨询
    </button>
  </motion.div>
);

export default EmptyHistoryState;
