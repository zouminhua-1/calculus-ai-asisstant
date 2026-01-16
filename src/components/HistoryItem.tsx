import { motion, useMotionValue, useTransform } from 'motion/react';
import { MessageSquare, Calendar, ChevronRight, Trash2 } from 'lucide-react';

/**
 * 抽离出的单个历史项组件，处理滑动逻辑
 */
const HistoryItem = ({ item, activeId, onSelect, onDelete }: any) => {
  const x = useMotionValue(0);
  // 根据滑动距离改变删除图标的透明度和缩放，增加灵动感
  const opacity = useTransform(x, [-70, -20], [1, 0]);
  const scale = useTransform(x, [-70, -20], [1, 0.8]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-transparent">
      {/* 底层：删除按钮区域 */}
      <div className="absolute inset-0 flex justify-end items-center pr-1 bg-red-500/90">
        <motion.button
          style={{ opacity, scale }}
          onClick={(e) => onDelete(e, item.id)}
          className="h-full w-20 flex flex-col items-center justify-center text-white"
        >
          <Trash2 size={20} />
          <span className="text-[10px] font-bold mt-1">删除</span>
        </motion.button>
      </div>

      {/* 上层：可拖拽的内容区域 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }} // 限制向左滑动的最大距离
        dragElastic={0.1} // 增加一点拉断感
        dragSnapToOrigin={false} // 松手后如果不超过阈值，motion 会根据约束停靠
        onDragEnd={(_, info) => {
          // 如果向左滑动距离不足 40，则自动弹回原位
          if (info.offset.x > -40) {
            x.set(0);
          }
        }}
        style={{ x }}
        className={`relative z-10 flex items-center p-4 gap-3 transition-colors touch-pan-y ${
          activeId === item.id ? 'bg-blue-600' : 'bg-[#262626]'
        }`}
        onClick={() => onSelect(item.id)}
      >
        <div
          className={`p-2 rounded-lg ${
            activeId === item.id ? 'bg-white/20' : 'bg-white/5'
          }`}
        >
          <MessageSquare size={18} className="text-white/80" />
        </div>

        <div className="flex-1 overflow-hidden pointer-events-none">
          <div className="text-sm font-medium text-white truncate">
            {item.name || '分析报告会话'}
          </div>
          <div className="text-[10px] text-white/40 mt-1 flex items-center gap-1 font-mono">
            <Calendar size={10} />
            {new Date(item.created_at * 1000).toLocaleDateString()}
          </div>
        </div>

        <ChevronRight size={14} className="text-white/20" />
      </motion.div>
    </div>
  );
};

export default HistoryItem;
