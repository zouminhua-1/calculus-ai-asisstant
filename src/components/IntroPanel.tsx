import React from 'react';
import { Camera, ShieldCheck, Activity } from 'lucide-react';

const IntroPanel: React.FC = () => {
  return (
    <div className="p-6 m-5 bg-white rounded-[24px] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] font-sans">
      {/* 图标与标题 */}
      <div className="mb-5 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Activity className="text-blue-600" size={32} />
        </div>
        <h3 className="m-0 text-slate-900 text-lg font-bold">
          AI 影像分析助手
        </h3>
        <p className="mt-1 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          Medical AI Analyst
        </p>
      </div>

      {/* 引导步骤 */}
      <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
            1
          </div>
          <p className="m-0 text-slate-600 text-sm leading-relaxed text-left">
            点击下方 <span className="text-blue-600 font-bold">图片按钮</span>
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-blue-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
            2
          </div>
          <p className="m-0 text-slate-600 text-sm leading-relaxed text-left">
            上传您的 <b className="text-slate-900">超声/CT 检查报告</b> 照片
          </p>
        </div>
      </div>

      {/* 安全提示 */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <ShieldCheck size={12} className="text-green-500" />
        <span className="text-slate-400 text-[11px]">
          隐私加密处理 · 结果仅供参考
        </span>
      </div>
    </div>
  );
};

export default IntroPanel;
