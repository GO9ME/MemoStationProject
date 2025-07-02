import React, { useState } from 'react';
import { PenLine, Brain, MessageCircle, X, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// 오른쪽 하단 플로팅 액션 버튼 그룹 (모든 화면 공통)
const FloatingActionButtons = () => {
  const location = useLocation();
  // 플로팅 버튼 토글 상태 (기본: 닫힘)
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  return (
    showFloatingButtons ? (
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-3 pointer-events-auto">
        {/* 새로운 노트 작성 */}
        <div className="flex items-center space-x-3">
          <button className="bg-[#232b36] text-white/80 font-medium px-5 py-3 rounded-2xl shadow text-sm">새로운 노트 작성</button>
          <button className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
            <PenLine className="w-6 h-6 text-white" />
          </button>
        </div>
        {/* 노트 인사이트 분석 */}
        <div className="flex items-center space-x-3">
          <button className="bg-[#232b36] text-white/80 font-medium px-5 py-3 rounded-2xl shadow text-sm">노트 인사이트 분석</button>
          <button className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{background: 'linear-gradient(135deg, #a21caf 0%, #9333ea 100%)'}}>
            <Brain className="w-6 h-6 text-white" />
          </button>
        </div>
        {/* AI와 대화하기 */}
        <div className="flex items-center space-x-3">
          <button className="bg-[#232b36] text-white/80 font-medium px-5 py-3 rounded-2xl shadow text-sm">AI와 대화하기</button>
          <button className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>
        {/* X(닫기) 버튼 */}
        <button
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mt-2 z-50 pointer-events-auto focus:outline-none"
          style={{background: 'linear-gradient(135deg, #3b82f6 0%, #a21caf 50%, #ec4899 100%)'}}
          onClick={() => setShowFloatingButtons(false)}
          aria-label="플로팅 버튼 닫기"
        >
          <X className="w-7 h-7 text-white" />
        </button>
      </div>
    ) : (
      <button
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl pointer-events-auto focus:outline-none"
        style={{background: 'linear-gradient(135deg, #3b82f6 0%, #a21caf 50%, #ec4899 100%)'}}
        onClick={() => setShowFloatingButtons(true)}
        aria-label="플로팅 버튼 열기"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    )
  );
};

export default FloatingActionButtons; 