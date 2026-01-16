import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

import { getUser } from '@/db';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('doctor1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('@test1234');

  const onSubmit = async () => {
    if (isLogin) {
      // 处理登录逻辑
      const { data, error } = await getUser({ name, pwd: password }); // 示例：从数据库获取用户信息
      console.log('登录数据：', data, error);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      {/* 顶部 Logo 区 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Activity className="text-white" size={36} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">AI 影像分析</h1>
        <p className="text-slate-400 text-xs mt-1 tracking-widest uppercase font-bold">
          Medical Intelligent Service
        </p>
      </motion.div>

      {/* 表单容器 */}
      <motion.div
        layout
        className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {isLogin ? '欢迎回来' : '创建新账号'}
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  placeholder="账号"
                  value={name}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="密码"
                  value={password}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <button
              onClick={onSubmit}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {isLogin ? '立即登录' : '注册账号'}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* 切换按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            {isLogin ? '还没有账号？' : '已有账号？'}
            <span className="text-blue-600 font-bold ml-1">
              {isLogin ? '立即注册' : '登录'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* 底部保障 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex items-center gap-2 text-slate-400"
      >
        <ShieldCheck size={14} />
        <span className="text-xs">数据由端到端加密保护</span>
      </motion.div>
    </div>
  );
};

export default AuthPage;
