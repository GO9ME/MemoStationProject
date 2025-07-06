import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Clock, Target, Brain, ChevronDown, Sparkles, Link2, Zap, MessageCircle } from 'lucide-react';

// 의미 기반 검색 페이지
const SemanticSearch = () => {
  const navigate = useNavigate();
  // 필터 영역 열림/닫힘 상태
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 상단 헤더 */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">의미 기반 검색</h1>
      </div>
      {/* 검색 입력 영역 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">의미 기반 검색</h1>
        <p className="text-slate-600 dark:text-slate-400">키워드가 아닌 의미와 맥락으로 검색하세요</p>
      </div>
      <div className="relative mb-8">
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <div className="pl-6">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <input type="text" placeholder="질문이나 키워드를 입력하세요... (예: 집중력 떨어질 때 대처법)" className="flex-1 py-4 px-4 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-lg" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-medium transition-colors">검색</button>
        </div>
        {/* 추천 검색 버튼들 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors group">
            <Clock className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm text-slate-700 dark:text-slate-300">최근 작성한 노트와 관련된 콘텐츠 찾기</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors group">
            <Target className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm text-slate-700 dark:text-slate-300">실행력 향상을 위한 방법론</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors group">
            <Brain className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm text-slate-700 dark:text-slate-300">창의적 사고 기법 추천</span>
          </button>
        </div>
      </div>
      {/* 최근 검색어/인기 검색어/가이드 등 섹션 */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">최근 검색어</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {["최근 작성한 노트와 관련된 콘텐츠 찾기", "실행력 향상을 위한 방법론", "창의적 사고 기법 추천"].map((txt, i) => (
            <button key={i} className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{txt}</span>
            </button>
          ))}
        </div>
      </div>
      {/* 필터/피드백/가이드 등 추가 섹션 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {/* 필터 버튼 및 토글 */}
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            onClick={() => setFilterOpen((prev) => !prev)}
            aria-expanded={filterOpen}
            aria-controls="semantic-filter-panel"
          >
            <span>필터</span>
            {filterOpen ? (
              // 위쪽 화살표
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4"><path d="m18 15-6-6-6 6"></path></svg>
            ) : (
              // 아래쪽 화살표
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4"><path d="m6 9 6 6 6-6"></path></svg>
            )}
          </button>
          {/* 필터 옵션 영역 */}
          {filterOpen && (
            <div id="semantic-filter-panel" className="flex flex-wrap items-center gap-2 ml-2 animate-fade-in">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">콘텐츠 유형:</div>
              {['노트', '콘텐츠', '인사이트'].map((label, idx) => (
                <label key={label} className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                </label>
              ))}
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-4 mr-2">매칭 유형:</div>
              {['의미 기반', '키워드 기반', '맥락 기반'].map((label, idx) => (
                <label key={label} className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-end">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors ">피드백 남기기</button>
        </div>
      </div>
      {/* 의미 기반 검색 팁/가이드 */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/30">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">의미 기반 검색 팁</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-slate-900 dark:text-white">자연어 질문</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">"어떻게 기억력을 향상시킬 수 있을까?"와 같이 자연스러운 질문으로 검색해보세요.</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-slate-900 dark:text-white">목적 명시</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">"프레젠테이션을 위한 창의적 아이디어가 필요해"처럼 목적을 포함하면 더 정확한 결과를 얻을 수 있어요.</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2"><span className="text-xs text-blue-700 dark:text-blue-400">예시: "창의적 사고를 향상시키는 방법"</span></div>
          </div>
          <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-slate-900 dark:text-white">맥락 활용</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">현재 보고 있는 노트나 콘텐츠의 맥락을 활용한 검색이 자동으로 이루어집니다.</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2"><span className="text-xs text-blue-700 dark:text-blue-400">예시: "프레젠테이션을 위한 설득력 있는 자료"</span></div>
          </div>
        </div>
      </div>
      {/* 최근/인기 검색어 섹션 */}
      <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">최근 검색 기록</h2>
          </div>
          <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">기록 삭제</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["창의적 사고 방법", "기억력 향상 기법", "효율적인 학습 방법", "집중력 떨어질 때 대처법"].map((txt, i) => (
            <div key={i} className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{txt}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">인기 검색어</h2>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {["집중력 향상 방법", "효과적인 메모 작성법", "창의적 사고 기법", "지식 관리 시스템 구축", "실행력 높이는 방법"].map((txt, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300">{txt}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 의미 기반 검색 활용 가이드 */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/30">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">의미 기반 검색 활용 가이드</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-slate-900 dark:text-white">의미 기반 검색</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">키워드가 아닌 의미로 검색합니다. 정확한 단어를 몰라도 찾고자 하는 내용을 자연어로 입력하세요.</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2"><span className="text-xs text-blue-700 dark:text-blue-400">예시: "창의적 사고를 향상시키는 방법"</span></div>
          </div>
          <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-slate-900 dark:text-white">맥락 기반 검색</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">현재 보고 있는 노트나 콘텐츠의 맥락을 자동으로 고려하여 관련성 높은 결과를 제공합니다.</p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2"><span className="text-xs text-purple-700 dark:text-purple-400">노트 작성 중 검색 시 자동으로 맥락 반영</span></div>
          </div>
          <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-slate-900 dark:text-white">목적 명시 검색</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">검색 목적을 명시하면 더 정확한 결과를 얻을 수 있습니다.</p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2"><span className="text-xs text-green-700 dark:text-green-400">예시: "프레젠테이션을 위한 설득력 있는 자료"</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticSearch; 