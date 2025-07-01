import React from 'react';
import { Crown } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">프리미엄 구독</h3>
          <p className="text-slate-600 dark:text-slate-400">월 ₩9,900으로 모든 프리미엄 기능을 이용하세요.</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-900 dark:text-white">월간 구독</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">₩9,900</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">언제든지 취소 가능</p>
          </div>
          <div className="p-4 border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-900 dark:text-white">연간 구독</span>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">20% 할인</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 dark:text-white">₩95,000</div>
                <div className="text-sm text-slate-500 line-through">₩118,800</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">2개월 무료</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={onClose} 
            className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            취소
          </button>
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300">
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 