import React, { useState } from 'react';
import {
  Brain, Lightbulb, BookOpen, ArrowRight, PenLine, AlertCircle, Target, Heart, Eye, Clock, Play,
  TrendingUp, Compass, Zap, BarChart3, ChevronDown, Link2, Sparkles, Check, Crown, Calendar, Tag, CheckCircle, Award, X, HelpCircle, FileText, Puzzle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UpgradeModal from '../components/UpgradeModal';
import PaymentModal from '../components/PaymentModal';

const Reports = () => {
  // 피드백 입력 상태
  const [feedback, setFeedback] = useState('');
  // 주간/월간 리포트 탭 상태 (선택된 탭을 시각적으로 표시하기 위함)
  const [reportPeriod, setReportPeriod] = useState('weekly'); // 'weekly' 또는 'monthly'

  // 피드백 전송 처리 (실제 API 연동 시 수정)
  const handleFeedbackSend = () => {
    if (!feedback.trim()) {
      alert('피드백 내용을 입력해주세요.');
      return;
    }
    // TODO: 피드백 전송 API 연동
    alert('피드백이 전송되었습니다. 감사합니다!');
    setFeedback('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI 인사이트 리포트</h1>
        <p className="text-slate-600 dark:text-slate-400">데이터로 확인하는 당신의 지식 여정과 성장 로드맵</p>
      </div>

      {/* 리포트 탭 */}
      <div className="flex space-x-2 mb-8">
        <button
          className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${reportPeriod === 'weekly' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50'}`}
          onClick={() => setReportPeriod('weekly')}
        >
          주간 리포트
        </button>
        <button
          className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${reportPeriod === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50'}`}
          onClick={() => setReportPeriod('monthly')}
        >
          월간 리포트
        </button>
      </div>

      {/* 이번 주의 핵심 인사이트 */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            {/* 뇌 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-8 h-8"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
            <h2 className="text-2xl font-bold">이번 주의 핵심 인사이트</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="text-3xl font-bold mb-2">실천 중심 콘텐츠 소비율 +34%</div>
            <div className="text-blue-100 text-lg">지난 주 대비 실행 가능한 콘텐츠 선택 비율이 크게 증가했습니다</div>
          </div>
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              {/* 전구 아이콘 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb w-6 h-6"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
              <span className="text-xl font-semibold">AI 해석</span>
            </div>
            <p className="text-xl text-blue-100 leading-relaxed">현재 사용자는 <span className="font-bold text-white">실행 의지가 상승 중</span>입니다. 이론적 학습에서 실무 적용 단계로 전환하려는 강한 동기가 감지됩니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 실행 전략 콘텐츠 보러가기 */}
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
              <div className="flex items-center space-x-3 mb-3">
                {/* 책 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open w-6 h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                <span className="font-semibold text-lg">실행 전략 콘텐츠 보러가기</span>
              </div>
              <p className="text-blue-200 text-sm mb-3">실무 적용 가능한 맞춤 콘텐츠를 추천해드려요</p>
              <div className="flex items-center space-x-2 text-sm">
                <span>바로 이동</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </button>
            {/* 추천 노트 바로 생성하기 */}
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
              <div className="flex items-center space-x-3 mb-3">
                {/* 펜 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line w-6 h-6"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                <span className="font-semibold text-lg">추천 노트 바로 생성하기</span>
              </div>
              <p className="text-blue-200 text-sm mb-3">현재 관심사 기반으로 실행 계획 노트를 만들어드려요</p>
              <div className="flex items-center space-x-2 text-sm">
                <span>노트 생성</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 성장 단계 리포트 섹션 */}
      <div id="value-flow-analysis" className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {/* 추세 상승 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up w-6 h-6 text-green-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">성장 단계 리포트</h2>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">지난 7일간의 활동 분석</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 주간 활동 요약 카드 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                {/* 막대 그래프 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart3 w-6 h-6 text-white"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">주간 활동 요약</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">지난 7일간의 활동 통계</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-slate-700 dark:text-slate-300">작성한 노트</span><span className="font-bold text-slate-900 dark:text-white">8개</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-700 dark:text-slate-300">열람한 콘텐츠</span><span className="font-bold text-slate-900 dark:text-white">12개</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-700 dark:text-slate-300">계획한 행동</span><span className="font-bold text-slate-900 dark:text-white">3개</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-700 dark:text-slate-300">완료한 행동</span><span className="font-bold text-slate-900 dark:text-white">2개</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-700 dark:text-slate-300">성장률</span><span className="font-bold text-green-600 dark:text-green-400">+15%</span></div>
            </div>
          </div>
          {/* AI 코칭 피드백 카드 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100/50 dark:border-purple-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                {/* 뇌 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-6 h-6 text-white"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI 코칭 피드백</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">개인화된 성장 가이드</p>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4 mb-4"><p className="text-slate-700 dark:text-slate-300 leading-relaxed"><span className="font-bold">현재 단계:</span> 지식 수집에서 실행 단계로 전환 중입니다. 이론적 이해는 충분하니 이제 실제 적용에 집중하면 더 빠른 성장이 가능합니다.</p></div>
            <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                {/* 전구 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb w-4 h-4 text-purple-600 dark:text-purple-400"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg><span className="font-medium text-slate-900 dark:text-white">주요 관심 주제</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">생산성</span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">학습 방법론</span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">실행력</span>
              </div>
            </div>
          </div>
          {/* 성장 단계 현황 카드 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100/50 dark:border-green-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                {/* 타겟 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-6 h-6 text-white"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">성장 단계 현황</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">지식 → 문제해결 → 실행</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* 지식 추천 */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {/* 나침반 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass w-4 h-4 text-slate-700 dark:text-slate-300"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                    <span className="font-medium text-slate-900 dark:text-white text-sm">지식 추천</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">85%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3"><div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500" style={{ width: '85%' }}></div></div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">새로운 정보와 아이디어 수집</div>
              </div>
              {/* 문제 해결 */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {/* 뇌 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-4 h-4 text-slate-700 dark:text-slate-300"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
                    <span className="font-medium text-slate-900 dark:text-white text-sm">문제 해결</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">65%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500" style={{ width: '65%' }}></div></div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">구체적 문제 분석과 해결책 모색</div>
              </div>
              {/* 실행 강화 */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {/* 번개 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-4 h-4 text-slate-700 dark:text-slate-300"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    <span className="font-medium text-slate-900 dark:text-white text-sm">실행 강화</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">40%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3"><div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: '40%' }}></div></div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">계획 수립과 실제 적용</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이번 주 추천 행동 섹션 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {/* 번개 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-6 h-6 text-amber-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">이번 주 추천 행동</h3>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">현재 성장 단계에 최적화된 추천</div>
        </div>
        <div className="space-y-4">
          {/* 행동 카드 1 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <div className="bg-green-500 w-full h-full rounded-xl flex items-center justify-center">
                  {/* 체크 원 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-5 h-5 text-white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">실행 계획 작성하기</h4>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">medium 난이도</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">창의성 관련 노트를 실제 행동으로 옮기는 계획 수립</p>
                <div className="flex items-center space-x-4 text-xs"><div className="text-slate-500 dark:text-slate-400">예상 소요 시간: 15분</div></div>
              </div>
              <div className="flex items-center">
                <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  {/* 오른쪽 화살표 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>
          {/* 행동 카드 2 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <div className="bg-blue-500 w-full h-full rounded-xl flex items-center justify-center">
                  {/* 책 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open w-5 h-5 text-white"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">효과적인 실행력 강화 방법</h4>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">실행 전략</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">계획을 실천으로 옮기는 체계적 접근법</p>
                <div className="flex items-center space-x-4 text-xs"><div className="text-slate-500 dark:text-slate-400">읽는 시간: 8분</div></div>
              </div>
              <div className="flex items-center">
                <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  {/* 오른쪽 화살표 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>
          {/* 행동 카드 3 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <div className="bg-purple-500 w-full h-full rounded-xl flex items-center justify-center">
                  {/* 링크 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link2 w-5 h-5 text-white"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">창의성 노트와 학습 방법론 연결하기</h4>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">높음 가치</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">두 주제 간의 연결점을 찾아 시너지 효과 창출</p>
                <div className="flex items-center space-x-4 text-xs"><div className="text-slate-500 dark:text-slate-400">관련 노트: 2개</div></div>
              </div>
              <div className="flex items-center">
                <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  {/* 오른쪽 화살표 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2">
            {/* 막대 그래프 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart3 w-5 h-5"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
            <span>실천 점검 대시보드 열기</span>
          </button>
        </div>
      </div>

      {/* 프리미엄에서 더 많은 인사이트 보기 섹션 */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-8 border border-purple-200/50 dark:border-purple-800/50">
        <div className="flex items-center space-x-3 mb-4">
          {/* 뇌 아이콘 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-6 h-6 text-purple-600 dark:text-purple-400"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">프리미엄에서 더 많은 인사이트 보기</h3>
        </div>
        <p className="text-slate-700 dark:text-slate-300 mb-4">고급 AI 분석으로 더 정확한 패턴 인식과 맞춤형 추천을 받아보세요. 프리미엄 사용자에게는 다음과 같은 추가 인사이트가 제공됩니다:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-3">
            {/* 체크 원 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-5 h-5 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
            <span className="text-slate-700 dark:text-slate-300">감정 패턴 심층 분석</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* 체크 원 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-5 h-5 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
            <span className="text-slate-700 dark:text-slate-300">장기 성장 트렌드 리포트</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* 체크 원 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-5 h-5 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
            <span className="text-slate-700 dark:text-slate-300">맞춤형 실행 전략 제안</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* 체크 원 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-5 h-5 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
            <span className="text-slate-700 dark:text-slate-300">외부 툴 연동 데이터 분석</span>
          </div>
        </div>
        <div className="text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2">
            <span>프리미엄 인사이트 활성화하기</span>
            {/* 오른쪽 화살표 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      {/* 가치 흐름 분석 섹션 */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {/* 막대 그래프 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart3 w-6 h-6 text-blue-500"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">가치 흐름 분석</h2>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center space-x-1">
            <span>세부 분석 보기</span>
            {/* 오른쪽 화살표 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6">당신의 본질적 가치 카테고리별 활동 패턴과 변화 추이를 분석합니다.</p>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
              {/* 타겟 아이콘 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-6 h-6 text-blue-500"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              <span>가치 흐름 분석</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              {/* 달력 아이콘 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
              <span>지난 7일</span>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            {/* 자기 개발 */}
            <div className="group cursor-pointer p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    {/* 타겟 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-6 h-6"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">자기 개발</h3>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-200">
                        {/* 펜 아이콘 */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">개인 성장과 역량 향상</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2"><span className="text-2xl font-bold text-slate-900 dark:text-white">42%</span><span className="text-sm text-slate-500 dark:text-slate-400">비중</span></div>
                      <div className="flex items-center space-x-2"><span className="text-lg font-semibold text-slate-700 dark:text-slate-300">18회</span><span className="text-sm text-slate-500 dark:text-slate-400">활동</span></div>
                      <div className="flex items-center space-x-2"><span className="text-sm font-medium text-green-600 dark:text-green-400">+15%</span><span className="text-sm text-slate-500 dark:text-slate-400">주간 변화</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right"><div className="text-xs text-slate-500 dark:text-slate-400 mb-1">7일 추이</div><svg width="60" height="20" className="overflow-visible"><polyline points="0,20 10,15.588235294117647 20,11.176470588235293 30,8.529411764705884 40,5 50,6.764705882352942 60,5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500"></polyline></svg></div>
                  {/* 아래 화살표 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:rotate-180 duration-200"><path d="m6 9 6 6 6-6"></path></svg>
                </div>
              </div>
            </div>
            {/* 문제 해결 */}
            <div className="group cursor-pointer p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    {/* 퍼즐 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-puzzle w-6 h-6"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894-.527-.967 1.02Z"></path></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">문제 해결</h3>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-200">
                        {/* 펜 아이콘 */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">구체적 문제의 해답 탐색</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2"><span className="text-2xl font-bold text-slate-900 dark:text-white">28%</span><span className="text-sm text-slate-500 dark:text-slate-400">비중</span></div>
                      <div className="flex items-center space-x-2"><span className="text-lg font-semibold text-slate-700 dark:text-slate-300">12회</span><span className="text-sm text-slate-500 dark:text-slate-400">활동</span></div>
                      <div className="flex items-center space-x-2"><span className="text-sm font-medium text-green-600 dark:text-green-400">+8%</span><span className="text-sm text-slate-500 dark:text-slate-400">주간 변화</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right"><div className="text-xs text-slate-500 dark:text-slate-400 mb-1">7일 추이</div><svg width="60" height="20" className="overflow-visible"><polyline points="0,20 10,16.25 20,10.625 30,8.75 40,5 50,6.875 60,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"></polyline></svg></div>
                  {/* 아래 화살표 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:rotate-180 duration-200"><path d="m6 9 6 6 6-6"></path></svg>
                </div>
              </div>
            </div>
            {/* 정보 정리 */}
            <div className="group cursor-pointer p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    {/* 막대 그래프 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart3 w-6 h-6"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">정보 정리</h3>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-200">
                        {/* 펜 아이콘 */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">지식 체계화와 구조화</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2"><span className="text-2xl font-bold text-slate-900 dark:text-white">30%</span><span className="text-sm text-slate-500 dark:text-slate-400">비중</span></div>
                      <div className="flex items-center space-x-2"><span className="text-lg font-semibold text-slate-700 dark:text-slate-300">13회</span><span className="text-sm text-slate-500 dark:text-slate-400">활동</span></div>
                      <div className="flex items-center space-x-2"><span className="text-sm font-medium text-red-600 dark:text-red-400">-5%</span><span className="text-sm text-slate-500 dark:text-slate-400">주간 변화</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right"><div className="text-xs text-slate-500 dark:text-slate-400 mb-1">7일 추이</div><svg width="60" height="20" className="overflow-visible"><polyline points="0,5 10,9.285714285714285 20,11.428571428571429 30,15.714285714285715 40,20 50,17.857142857142858 60,15.714285714285715" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"></polyline></svg></div>
                  {/* 아래 화살표 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:rotate-180 duration-200"><path d="m6 9 6 6 6-6"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 가치 패턴 인사이트 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center space-x-2 mb-3">
            {/* 뇌 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-5 h-5 text-blue-600 dark:text-blue-400"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
            <span className="text-sm font-bold text-blue-900 dark:text-blue-300">가치 패턴 인사이트</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">이번 주는 자기 개발에 대한 관심이 크게 증가했어요. 특히 개념 학습 단계에서 실제 적용 단계로 넘어가려는 의지가 보입니다.</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm text-slate-600 dark:text-slate-400">자기 개발 42%</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span className="text-sm text-slate-600 dark:text-slate-400">정보 정리 30%</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-sm text-slate-600 dark:text-slate-400">문제 해결 28%</span></div>
          </div>
        </div>
      </div>
      {/* AI 개선을 위한 피드백 섹션 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">AI 개선을 위한 피드백</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">추천이 도움이 되었나요? 더 나은 추천을 위해 의견을 들려주세요.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <textarea
            placeholder="피드백을 입력해주세요..."
            className="flex-1 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            rows="3"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors self-start"
            onClick={handleFeedbackSend}
          >
            피드백 전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;