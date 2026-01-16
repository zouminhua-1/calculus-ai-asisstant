import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ChevronLeft,
  SendHorizontal,
} from 'lucide-react';

const RegisterPage = ({ onBack }) => {
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    code: '',
    password: '',
  });

  // 验证码倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (countdown === 0) {
      // 在此处调用发送验证码接口
      setCountdown(60);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col p-6">
      {/* 顶部返回按钮 */}
      <nav className="mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 active:text-blue-600 transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">返回登录</span>
        </button>
      </nav>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* 头部标题 */}
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            创建账号
          </h2>
          <p className="text-slate-500 mt-2">开启您的 AI 医疗影像分析之旅</p>
        </header>

        {/* 注册表单 */}
        <div className="space-y-4">
          {/* 用户名 */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest">
              您的姓名
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="请输入真实姓名"
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* 手机号 */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest">
              联系电话
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                type="tel"
                inputMode="tel"
                placeholder="11位手机号码"
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* 验证码 */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest">
              验证码
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ShieldCheck
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="6位验证码"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <button
                onClick={handleSendCode}
                disabled={countdown > 0}
                className={`px-4 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  countdown > 0
                    ? 'bg-slate-100 text-slate-400'
                    : 'bg-blue-50 text-blue-600 active:bg-blue-100'
                }`}
              >
                {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 密码 */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest">
              设置密码
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                type="password"
                placeholder="不少于8位字符"
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* 注册按钮 */}
        <button className="w-full mt-10 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          完成注册并登录
          <SendHorizontal size={18} />
        </button>

        {/* 用户协议 */}
        <p className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed px-4">
          点击“完成注册”即代表您同意我们的 <br />
          <span className="text-blue-500 font-medium">服务协议</span> 与{' '}
          <span className="text-blue-500 font-medium">隐私条款</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
