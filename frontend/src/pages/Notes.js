import React, { useState } from 'react';
import {
  Filter, List, LayoutGrid, TrendingUp, ArrowRight, Lightbulb, Plus, Zap, PenLine, Star, Search, Brain, Tag, Link2, Clock, X, HelpCircle, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ========================= 예시 데이터 =========================
const noteList = [
  {
    id: 1,
    emoji: '🤔',
    title: 'Design System Thoughts',
    desc: '현대적 디자인 시스템에서 일관성과 창의성의 균형을 추천하며, 사용자 경험의 예측 가능성과 혁신 사이의 적절한 지점을 찾아보았다...',
    value: '자기 개발',
    valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    ai: true,
    aiColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    review: '기억 선명',
    reviewColor: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    tags: ['#디자인', '#시스템', '#UX'],
    connections: 5,
    time: '2시간 전',
    stars: 4,
    progress: 15,
  },
  {
    id: 2,
    emoji: '💭',
    title: 'AI 윤리 토론',
    desc: 'AI 추천 시스템에서 투명성과 사용자 신뢰에 대한 중요한 고려사항들을 정리하며, 알고리즘의 편향성 문제와 해결 방안을 모색했다...',
    value: '문제 해결',
    valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    ai: false,
    aiColor: '',
    review: '복습 권장',
    reviewColor: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    tags: ['#AI', '#윤리', '#기술'],
    connections: 8,
    time: '1일 전',
    stars: 5,
    progress: 45,
  },
  {
    id: 3,
    emoji: '🌱',
    title: '주말 성찰',
    desc: '일과 삶의 균형과 창작적 휴식 시간의 중요성에 대해 생각해보며, 지속 가능한 창작 루틴을 만들어가는 과정을 기록했다...',
    value: '정보 정리',
    valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    ai: true,
    aiColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    review: '복습 필요',
    reviewColor: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    tags: ['#개인', '#성찰', '#균형'],
    connections: 3,
    time: '3일 전',
    stars: 3,
    progress: 75,
  },
];

// ========================= Notes 컴포넌트 =========================
const Notes = () => {
  // 정렬, 필터, 뷰 상태
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');

  // 필터 상태(예시)
  const [valueFilter, setValueFilter] = useState([]);
  const [reviewFilter, setReviewFilter] = useState([]);
  const [keywordFilter, setKeywordFilter] = useState([]);
  const [aiFilter, setAiFilter] = useState([]);

  // 루틴 생성 모달 상태
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('오늘의 노트 정리 루틴');
  const [routineCycle, setRoutineCycle] = useState('매일');
  const [routineTime, setRoutineTime] = useState('오전 (9-12시)');
  const [routineNotes, setRoutineNotes] = useState([1, 2]); // 예시: id 1,2 선택

  // 방식 선택 모달 상태
  const [showModeModal, setShowModeModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideAnswers, setGuideAnswers] = useState(['', '', '']);

  // 자유 형식 노트 작성 모달 상태
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [expertTitle, setExpertTitle] = useState('실행 강화를 위한 개인 전략 수립');
  const [expertBody, setExpertBody] = useState(`## 현재 상황 분석\n- 성장 단계: 실행 강화 단계\n- 진행률: 40%\n- 상태: 지식 수집에서 실무 적용으로 전환 중\n\n## 실행 계획\n\n### 1. 단기 목표 (1-2주)\n- 실천 계획 3개 작성하기\n- \n\n### 2. 중기 목표 (1개월)\n- \n- \n\n### 3. 장기 목표 (3개월)\n- \n- \n\n## 실행 방법\n1. \n2. \n3. \n\n## 예상 장애물과 대응 방안\n- 장애물: \n  대응: \n- 장애물: \n  대응: \n\n## 성과 측정 방법\n- \n- \n\n## 다음 검토 일정\n- 1주 후: \n- 1개월 후: `);
  const [expertTags, setExpertTags] = useState('실행계획, 전략, 성장, 목표달성');

  // 새로운 실천계획 모달 상태 추가
  const [showPlanModal, setShowPlanModal] = useState(false);

  // 방식 선택 모달 상태 추가
  const [showPlanModeSelectModal, setShowPlanModeSelectModal] = useState(false);

  const navigate = useNavigate();

  // 별점 렌더링 함수
  const renderStars = (count) => (
    <div className="flex items-center space-x-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i <= count ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
      ))}
    </div>
  );

  // 진행도 바 렌더링 함수
  const renderProgress = (percent, color) => (
    <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-300 ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
  );

  // 루틴에 포함될 노트 예시 데이터
  const routineNoteOptions = [
    {
      id: 1,
      title: '창의성에 대한 고민',
      desc: '이후 유사 주제 3건 발생, 실행 계획 미연결',
      level: '높음',
      levelColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    },
    {
      id: 2,
      title: 'Design System Thoughts',
      desc: '높은 연결성(5개), 복습 권장 시점',
      level: '보통',
      levelColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-korean">
      {/* 질문 기반 노트 작성 모달 */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* 상단 sticky 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">추천 노트 생성</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">AI가 분석한 당신의 관심사를 바탕으로 노트를 작성해보세요</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={()=>setShowGuideModal(false)}><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={()=>{setShowGuideModal(false);setShowModeModal(true);}}>←</button>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">질문 기반 노트 작성</h3>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">Guided Mode</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-300">AI 추천 제목</span>
                  </div>
                  <p className="text-blue-700 dark:text-blue-400 font-medium">실행 강화를 위한 개인 전략 수립</p>
                </div>
                <div className="space-y-6">
                  {/* 질문 1 */}
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">지금 해결하고 싶은 문제는?</h4>
                    </div>
                    <textarea placeholder="예: 업무 효율성이 떨어져서 야근이 잦아지고 있다" className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" rows={4} value={guideAnswers[0]} onChange={e=>setGuideAnswers([e.target.value, guideAnswers[1], guideAnswers[2]])} />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">💡 구체적인 상황이나 어려움을 적어보세요</p>
                  </div>
                  {/* 질문 2 */}
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">최근 어떤 시도를 해봤나요?</h4>
                    </div>
                    <textarea placeholder="예: 할 일 목록을 만들어봤지만 지키지 못했다" className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" rows={4} value={guideAnswers[1]} onChange={e=>setGuideAnswers([guideAnswers[0], e.target.value, guideAnswers[2]])} />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">💡 이미 시도해본 방법들과 그 결과를 적어보세요</p>
                  </div>
                  {/* 질문 3 */}
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">다음에 어떤 방식으로 바꾸어 볼 수 있나요?</h4>
                    </div>
                    <textarea placeholder="예: 시간 블록킹 방식을 도입해보고 싶다" className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" rows={4} value={guideAnswers[2]} onChange={e=>setGuideAnswers([guideAnswers[0], guideAnswers[1], e.target.value])} />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">💡 새롭게 시도해보고 싶은 접근법을 적어보세요</p>
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <button className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={()=>{setShowGuideModal(false);setShowModeModal(true);}}>방식 변경</button>
                  <button disabled={guideAnswers.some(a=>!a)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2">
                    <span>노트 저장</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 방식 선택 모달 */}
      {showModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* 상단 sticky 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">추천 노트 생성</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">AI가 분석한 당신의 관심사를 바탕으로 노트를 작성해보세요</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={()=>setShowModeModal(false)}><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">작성 방식을 선택해주세요</h3>
                  <p className="text-slate-600 dark:text-slate-400">당신에게 맞는 노트 작성 방식을 선택하여 더 효과적으로 생각을 정리해보세요</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guided Mode */}
                  <button className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 text-left group" onClick={()=>{setShowModeModal(false);setShowGuideModal(true);}}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">🧭 Guided Mode</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">질문 기반 템플릿</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">질문에 따라 작성해보세요. AI가 단계별로 안내하여 체계적인 사고 정리를 도와드립니다.</p>
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">초보자 추천</span>
                    </div>
                  </button>
                  {/* Expert Mode */}
                  <button className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200 text-left group" onClick={()=>{setShowModeModal(false);setShowExpertModal(true);}}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PenLine className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">✍️ Expert Mode</h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">빈 구조형 템플릿</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">자신의 흐름에 따라 자유롭게 작성하세요. 경험이 있는 사용자에게 적합한 자유 형식입니다.</p>
                    <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">자유도 높음</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 자유 형식 노트 작성 모달 */}
      {showExpertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* 상단 sticky 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">추천 노트 생성</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">AI가 분석한 당신의 관심사를 바탕으로 노트를 작성해보세요</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={()=>setShowExpertModal(false)}><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={()=>{setShowExpertModal(false);setShowModeModal(true);}}>←</button>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">자유 형식 노트 작성</h3>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">Expert Mode</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-bold text-purple-900 dark:text-purple-300">AI 추천 제목</span>
                  </div>
                  <input type="text" className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" placeholder="노트 제목을 입력하세요" value={expertTitle} onChange={e=>setExpertTitle(e.target.value)} />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">본문</label>
                    <textarea placeholder="자유롭게 생각을 정리해보세요..." className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" rows={12} value={expertBody} onChange={e=>setExpertBody(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">태그</label>
                    <input type="text" placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 실행, 계획, 생산성)" className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" value={expertTags} onChange={e=>setExpertTags(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <button className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={()=>{setShowExpertModal(false);setShowModeModal(true);}}>방식 변경</button>
                  <button disabled={!expertTitle || !expertBody || !expertTags} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2">
                    <span>노트 저장</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 루틴 생성 모달 */}
      {showRoutineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI 추천 정리 루틴 생성</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={()=>setShowRoutineModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">루틴 제목</label>
                <input type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" value={routineTitle} onChange={e=>setRoutineTitle(e.target.value)} placeholder="루틴 제목을 입력하세요" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">실행 주기</label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white" value={routineCycle} onChange={e=>setRoutineCycle(e.target.value)}>
                    <option>매일</option>
                    <option>주 3회</option>
                    <option>주말만</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">선호 시간대</label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white" value={routineTime} onChange={e=>setRoutineTime(e.target.value)}>
                    <option>오전 (9-12시)</option>
                    <option>오후 (13-18시)</option>
                    <option>저녁 (19-22시)</option>
                  </select>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">포함될 노트</h4>
                <div className="space-y-2">
                  {routineNoteOptions.map(note => (
                    <div key={note.id} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={routineNotes.includes(note.id)} onChange={()=>setRoutineNotes(list=>list.includes(note.id)?list.filter(x=>x!==note.id):[...list, note.id])} />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">{note.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{note.desc}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${note.levelColor}`}>{note.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={()=>setShowRoutineModal(false)}>취소</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors" onClick={()=>setShowRoutineModal(false)}>루틴 생성</button>
            </div>
          </div>
        </div>
      )}
      {/* 실천계획 3개 작성하기 모달 */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* 상단 sticky 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">추천 노트 생성</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">AI가 분석한 당신의 관심사를 바탕으로 노트를 작성해보세요</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={()=>setShowPlanModal(false)}><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={()=>setShowPlanModal(false)}>←</button>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">자유 형식 노트 작성</h3>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">Expert Mode</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-bold text-purple-900 dark:text-purple-300">AI 추천 제목</span>
                  </div>
                  <input type="text" className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" placeholder="노트 제목을 입력하세요" value={expertTitle} onChange={e=>setExpertTitle(e.target.value)} />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">본문</label>
                    <textarea placeholder="자유롭게 생각을 정리해보세요..." className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" rows={12} value={expertBody} onChange={e=>setExpertBody(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">태그</label>
                    <input type="text" placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 실행, 계획, 생산성)" className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400" value={expertTags} onChange={e=>setExpertTags(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <button className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={()=>{setShowPlanModal(false); setShowPlanModeSelectModal(true);}}>방식 변경</button>
                  <button disabled={!expertTitle || !expertBody || !expertTags} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2">
                    <span>노트 저장</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPlanModeSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* 상단 sticky 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">추천 노트 생성</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">AI가 분석한 당신의 관심사를 바탕으로 노트를 작성해보세요</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={()=>setShowPlanModeSelectModal(false)}><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">작성 방식을 선택해주세요</h3>
                  <p className="text-slate-600 dark:text-slate-400">당신에게 맞는 노트 작성 방식을 선택하여 더 효과적으로 생각을 정리해보세요</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guided Mode 버튼 */}
                  <button className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 text-left group">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">🧭 Guided Mode</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">질문 기반 템플릿</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">질문에 따라 작성해보세요. AI가 단계별로 안내하여 체계적인 사고 정리를 도와드립니다.</p>
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">초보자 추천</span>
                    </div>
                  </button>
                  {/* Expert Mode 버튼 */}
                  <button className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200 text-left group">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PenLine className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">✍️ Expert Mode</h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">빈 구조형 템플릿</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">자신의 흐름에 따라 자유롭게 작성하세요. 경험이 있는 사용자에게 적합한 자유 형식입니다.</p>
                    <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">자유도 높음</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-8">
        {/* ========================= 좌측 스마트 필터 ========================= */}
        <aside className="w-80 flex-shrink-0 space-y-6 hidden lg:block">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 sticky top-24">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>스마트 필터</span>
            </h3>
            {/* 정렬 */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">정렬</h4>
              <div className="space-y-2">
                {['recent','importance','connections','forgetting'].map((key) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="sort" className="text-blue-600 focus:ring-blue-500" value={key} checked={sort===key} onChange={()=>setSort(key)} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {key==='recent'?'최신순':key==='importance'?'중요도순':key==='connections'?'연결성순':'복습 필요순'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* 본질적 가치 */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">본질적 가치</h4>
              <div className="space-y-2">
                {['자기 개발','문제 해결','정보 정리','창의적 탐색','실행 강화'].map((v) => (
                  <label key={v} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={valueFilter.includes(v)} onChange={()=>setValueFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* 복습 상태 */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">복습 상태</h4>
              <div className="space-y-2">
                {['기억 선명','복습 권장','복습 필요'].map((v) => (
                  <label key={v} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={reviewFilter.includes(v)} onChange={()=>setReviewFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                    <span className={`text-sm ${v==='기억 선명'?'text-green-600':v==='복습 권장'?'text-yellow-600':'text-red-600'}`}>{v}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* 키워드 */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">키워드</h4>
              <div className="space-y-2">
                {['#디자인','#AI','#생산성','#성찰','#기술','#개인'].map((v) => (
                  <label key={v} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={keywordFilter.includes(v)} onChange={()=>setKeywordFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* AI 분석 */}
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">AI 분석</h4>
              <div className="space-y-2">
                {['AI 추천 대상','높은 연결성'].map((v) => (
                  <label key={v} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={aiFilter.includes(v)} onChange={()=>setAiFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>
        {/* ========================= 우측 노트 리스트/검색/뷰 전환 ========================= */}
        <main className="flex-1 min-w-0">
          {/* 헤더/검색/뷰 전환 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">내 노트</h1>
              <p className="text-slate-600 dark:text-slate-400">총 127개의 노트 • AI 추천 대상 23개 • 복습 필요 8개</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* 모바일 필터 버튼 */}
              <button className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
                <span>필터</span>
              </button>
              {/* 뷰 전환 버튼 */}
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button className={`p-2 rounded-lg transition-colors ${view==='list'?'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm':''}`} onClick={()=>setView('list')}>
                  <List className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${view==='grid'?'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm':''}`} onClick={()=>setView('grid')}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* 가치 흐름/AI 추천 루틴/진행도 카드 등 상단 카드 예시 */}
          <button className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6 border border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100 dark:hover:from-blue-900/30 hover:to-indigo-100 dark:hover:to-indigo-900/30 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">나의 최근 가치 흐름</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">지난 7일간 노트 작성 패턴 분석</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <div className="mt-4 flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">자기 개발 42%</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">+15%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">정보 정리 30%</span>
                <span className="text-xs font-medium text-red-600 dark:text-red-400">-5%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">문제 해결 28%</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">+8%</span>
              </div>
            </div>
          </button>
          {/* AI 추천 루틴 카드 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">오늘의 AI 추천 정리 루틴</h3>
              </div>
              <button className="bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2" onClick={()=>setShowRoutineModal(true)}>
                <Plus className="w-4 h-4" />
                <span>루틴 생성</span>
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">우선순위가 높은 노트들을 정리하여 생각을 체계화해보세요</p>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold text-slate-400 dark:text-slate-500">1</div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">창의성에 대한 고민</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">이후 유사 주제 3건 발생, 실행 계획 미연결</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">높음</span>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">실천 계획 작성</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold text-slate-400 dark:text-slate-500">2</div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Design System Thoughts</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">높은 연결성(5개), 복습 권장 시점</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">보통</span>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">연관 노트 정리</span>
                </div>
              </button>
            </div>
          </div>
          {/* 성장 단계/진행도 카드 */}
          <button
            className="w-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 mb-8 border border-green-200/50 dark:border-green-800/50 hover:from-green-100 dark:hover:from-green-900/30 hover:to-emerald-100 dark:hover:to-emerald-900/30 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg"
            onClick={() => setShowPlanModal(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PenLine className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">현재 성장 단계: 실행 강화 단계</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">지식 수집에서 실무 적용으로 전환 중</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">40%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">진행률</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-500 group-hover:bg-green-400" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="bg-green-600 group-hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2">
                <PenLine className="w-4 h-4" />
                <span>실천 계획 3개 작성하기</span>
              </div>
            </div>
          </button>
          {/* 검색창 */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="노트 제목, 내용, 태그로 검색..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          {/* 노트 카드 리스트 */}
          <div className={`grid ${view==='grid'?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6':'space-y-4'}`}>
            {noteList.filter(note => note.title.includes(search) || note.desc.includes(search) || note.tags.some(t=>t.includes(search))).map(note => (
              <div
                key={note.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.01] hover:border-blue-300 dark:hover:border-blue-600 ${view==='grid'?'':'flex items-start justify-between'}`}
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{note.emoji}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">{note.title}</h3>
                    <div className={`flex items-center space-x-2 ${note.valueColor} px-2 py-1 rounded-full text-xs font-medium`}>{note.value}</div>
                    {note.ai && <div className={`flex items-center space-x-1 ${note.aiColor} px-2 py-1 rounded-full text-xs font-medium`}><Brain className="w-3 h-3" /><span>AI 추천</span></div>}
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${note.reviewColor}`}><Clock className="w-3 h-3" /><span>{note.review}</span></div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{note.desc}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2"><Tag className="w-4 h-4 text-slate-400" />
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">{tag}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1"><Link2 className="w-3 h-3" /><span>{note.connections}개 연결</span></div>
                      <span>{note.time}</span>
                    </div>
                  </div>
                </div>
                {/* 별점/진행도 */}
                <div className="flex flex-col items-center space-y-2 ml-6">
                  {renderStars(note.stars)}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{note.stars}/5</span>
                  {renderProgress(note.progress, note.reviewColor)}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes; 