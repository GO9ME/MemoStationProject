import React from 'react';
import { Clock, Sparkles, TrendingUp } from 'lucide-react';

// 오늘의 요약 카드 컴포넌트
export default function TodaySummaryCard() {
  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-3xl p-8 transition-all duration-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl opacity-100 translate-y-0">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
        <div className="relative flex items-start space-x-6">
          {/* 아이콘 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg flex-shrink-0">
            <Clock className="w-8 h-8 text-white" />
          </div>
          {/* 텍스트 */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI가 본 오늘의 나</h2>
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-2 font-medium">화요일 오전, 집중력이 좋은 시간이에요.</p>
            <p className="text-slate-600 dark:text-slate-400">정보 확장 콘텐츠를 추천할게요.</p>
          </div>
          {/* 우측 실시간 분석 */}
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-4 h-4" />
            <span>실시간 분석</span>
          </div>
        </div>
      </div>
    </div>
  );
} 