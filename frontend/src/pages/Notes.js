import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Filter, List, LayoutGrid, TrendingUp, ArrowRight, Lightbulb, Plus, Zap, PenLine, Star, Search, Brain, Tag, Link2, Clock, X, HelpCircle, CheckCircle, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ========================= 예시 데이터 =========================
// const noteList = [
//   {
//     id: 1,
//     emoji: '🤔',
//     title: 'Design System Thoughts',
//     desc: '현대적 디자인 시스템에서 일관성과 창의성의 균형을 추천하며, 사용자 경험의 예측 가능성과 혁신 사이의 적절한 지점을 찾아보았다...',
//     value: '자기 개발',
//     valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
//     ai: true,
//     aiColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
//     review: '기억 선명',
//     reviewColor: 'text-green-500 bg-green-100 dark:bg-green-900/30',
//     tags: ['#디자인', '#시스템', '#UX'],
//     connections: 5,
//     time: '2시간 전',
//     stars: 4,
//     progress: 15,
//   },
//   {
//     id: 2,
//     emoji: '💭',
//     title: 'AI 윤리 토론',
//     desc: 'AI 추천 시스템에서 투명성과 사용자 신뢰에 대한 중요한 고려사항들을 정리하며, 알고리즘의 편향성 문제와 해결 방안을 모색했다...',
//     value: '문제 해결',
//     valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
//     ai: false,
//     aiColor: '',
//     review: '복습 권장',
//     reviewColor: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
//     tags: ['#AI', '#윤리', '#기술'],
//     connections: 8,
//     time: '1일 전',
//     stars: 5,
//     progress: 45,
//   },
//   {
//     id: 3,
//     emoji: '��',
//     title: '주말 성찰',
//     desc: '일과 삶의 균형과 창작적 휴식 시간의 중요성에 대해 생각해보며, 지속 가능한 창작 루틴을 만들어가는 과정을 기록했다...',
//     value: '정보 정리',
//     valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
//     ai: true,
//     aiColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
//     review: '복습 필요',
//     reviewColor: 'text-red-500 bg-red-100 dark:bg-red-900/30',
//     tags: ['#개인', '#성찰', '#균형'],
//     connections: 3,
//     time: '3일 전',
//     stars: 3,
//     progress: 75,
//   },
// ];

// const MEMO_NOTES_API = 'http://localhost:8000/api/memo-notes';
const MEMOS_API = 'http://15.164.213.252:8000/api/memos';
const PAGE_SIZE = 8; // 무한스크롤 기준 8개씩
const BOARD_COLORS = [
  'bg-yellow-50', 'bg-orange-50', 'bg-amber-50', 'bg-lime-50', 'bg-rose-50', 'bg-sky-50', 'bg-violet-50', 'bg-pink-50'
];
const PIN_ICONS = [
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400"><circle cx="12" cy="6" r="2"/><path d="M12 8v10M9 18h6"/></svg>,
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><rect x="10" y="2" width="4" height="4" rx="2"/><path d="M12 6v14"/></svg>,
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><circle cx="12" cy="4" r="2"/><path d="M12 6v14"/></svg>
];

// Notion 페이지에서 제목 속성을 자동으로 추출하는 함수
function getNotionPageTitle(page) {
  if (!page.properties) return "(제목 없음)";
  const titleProp = Object.values(page.properties).find(
    prop => prop.type === "title"
  );
  if (
    titleProp &&
    titleProp.title &&
    titleProp.title.length > 0 &&
    titleProp.title[0].plain_text
  ) {
    return titleProp.title[0].plain_text;
  }
  return "(제목 없음)";
}

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

  // 노트 목록 상태
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 무한스크롤 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const navigate = useNavigate();

  // DB에서 메모 불러오기 (최초 1페이지만)
  useEffect(() => {
    setLoading(true);
    setError(null);
    // page가 1일 때만 notes 상태 초기화
    if (page === 1) setNotes([]);
    fetch(`${MEMOS_API}?page=1&size=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        if (data.memos) {
          const mapped = data.memos.map((row, idx) => ({
            id: row.id,
            emoji: '📝',
            title: row.date || '(제목 없음)',
            desc: row.summary ? row.summary.slice(0, 80) : '',
            value: row.style || '',
            valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            ai: false,
            aiColor: '',
            review: '',
            reviewColor: '',
            tags: row.keywords ? row.keywords.split(',').map(t=>t.trim()).filter(Boolean) : [],
            connections: 0,
            time: row.date || '',
            stars: 0,
            progress: 0,
            fullContent: row.summary,
            interests: row.interests,
            pain_points: row.pain_points,
            persona_profession: row.persona_profession,
          }));
          setNotes(mapped);
        } else {
          setNotes([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('메모 데이터를 불러올 수 없습니다.');
        setLoading(false);
      });
  // eslint-disable-next-line
  }, []);

  // 카드 누적 로딩 (무한스크롤)
  const fetchMoreNotes = useCallback(async () => {
    // 이미 로딩 중이면 중복 호출 방지
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${MEMOS_API}?page=${page}&size=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('메모 데이터를 불러올 수 없습니다.');
      const data = await res.json();
      const parsed = data.memos.map((row, idx) => ({
        id: row.id,
        emoji: '📝',
        title: row.date || '(제목 없음)',
        desc: row.summary ? row.summary.slice(0, 80) : '',
        value: row.style || '',
        valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        ai: false,
        aiColor: '',
        review: '',
        reviewColor: '',
        tags: row.keywords ? row.keywords.split(',').map(t=>t.trim()).filter(Boolean) : [],
        connections: 0,
        time: row.date || '',
        stars: 0,
        progress: 0,
        fullContent: row.summary,
        interests: row.interests,
        pain_points: row.pain_points,
        persona_profession: row.persona_profession,
      }));
      setNotes(prev => [...prev, ...parsed]);
      setHasMore(data.has_more);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  // 무한스크롤 IntersectionObserver (threshold 0.7)
  const lastNoteRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.7 }); // 마지막 카드가 70% 이상 보일 때만 트리거
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // page가 변경될 때마다 fetchMoreNotes 실행 (무한스크롤 정상 동작)
  useEffect(() => {
    fetchMoreNotes();
    // eslint-disable-next-line
  }, [page]);

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

  // 에러 발생 시 상단에 안내 메시지 및 재시도 버튼 표시
  const handleRetry = () => {
    setError(null);
    setPage(1);
    setNotes([]);
    setHasMore(true);
  };

  // 필터 섹션별 토글 상태 (기본값: 모두 닫힘)
  const [openSort, setOpenSort] = useState(false);
  const [openValue, setOpenValue] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [openKeyword, setOpenKeyword] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  // 전체 화면 레이아웃을 중앙 max-w-7xl, 좌우 여백, flex로 감싸도록 변경
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* 좌측: 스마트 필터 (w-80, sticky) */}
        <aside className="w-80 flex-shrink-0 space-y-6 hidden lg:block">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 sticky top-24">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>스마트 필터</span>
            </h3>
            {/* 정렬 섹션 토글 */}
            <div className="mb-6">
              <h4
                className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center cursor-pointer select-none"
                onClick={() => setOpenSort(v => !v)}
              >
                정렬
                <span className="ml-2">{openSort ? '▲' : '▼'}</span>
              </h4>
              {openSort && (
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
              )}
            </div>
            {/* 본질적 가치 섹션 토글 */}
            <div className="mb-6">
              <h4
                className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center cursor-pointer select-none"
                onClick={() => setOpenValue(v => !v)}
              >
                본질적 가치
                <span className="ml-2">{openValue ? '▲' : '▼'}</span>
              </h4>
              {openValue && (
                <div className="space-y-2">
                  {['자기 개발','문제 해결','정보 정리','창의적 탐색','실행 강화'].map((v) => (
                    <label key={v} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={valueFilter.includes(v)} onChange={()=>setValueFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* 복습 상태 섹션 토글 */}
            <div className="mb-6">
              <h4
                className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center cursor-pointer select-none"
                onClick={() => setOpenReview(v => !v)}
              >
                복습 상태
                <span className="ml-2">{openReview ? '▲' : '▼'}</span>
              </h4>
              {openReview && (
                <div className="space-y-2">
                  {['기억 선명','복습 권장','복습 필요'].map((v) => (
                    <label key={v} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={reviewFilter.includes(v)} onChange={()=>setReviewFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                      <span className={`text-sm ${v==='기억 선명'?'text-green-600':v==='복습 권장'?'text-yellow-600':'text-red-600'}`}>{v}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* 키워드 섹션 토글 */}
            <div className="mb-6">
              <h4
                className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center cursor-pointer select-none"
                onClick={() => setOpenKeyword(v => !v)}
              >
                키워드
                <span className="ml-2">{openKeyword ? '▲' : '▼'}</span>
              </h4>
              {openKeyword && (
                <div className="space-y-2">
                  {['#디자인','#AI','#생산성','#성찰','#기술','#개인'].map((v) => (
                    <label key={v} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={keywordFilter.includes(v)} onChange={()=>setKeywordFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* AI 분석 섹션 토글 */}
            <div>
              <h4
                className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center cursor-pointer select-none"
                onClick={() => setOpenAI(v => !v)}
              >
                AI 분석
                <span className="ml-2">{openAI ? '▲' : '▼'}</span>
              </h4>
              {openAI && (
                <div className="space-y-2">
                  {['AI 추천 대상','높은 연결성'].map((v) => (
                    <label key={v} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={aiFilter.includes(v)} onChange={()=>setAiFilter(f=>f.includes(v)?f.filter(x=>x!==v):[...f,v])} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
        {/* 우측: 메인 컨텐츠 (flex-1 min-w-0) */}
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
          <button class="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6 border border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100 dark:hover:from-blue-900/30 hover:to-indigo-100 dark:hover:to-indigo-900/30 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg" onClick={() => navigate('/reports')}>
            <div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up w-6 h-6 text-white"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></div><div class="text-left"><h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">나의 최근 가치 흐름</h3><p class="text-sm text-slate-600 dark:text-slate-400">지난 7일간 노트 작성 패턴 분석</p></div></div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></div><div class="mt-4 flex items-center space-x-6"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-blue-500 rounded-full"></div><span class="text-sm font-medium text-slate-700 dark:text-slate-300">자기 개발 42%</span><span class="text-xs font-medium text-green-600 dark:text-green-400">+15%</span></div><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-purple-500 rounded-full"></div><span class="text-sm font-medium text-slate-700 dark:text-slate-300">정보 정리 30%</span><span class="text-xs font-medium text-red-600 dark:text-red-400">-5%</span></div><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-green-500 rounded-full"></div><span class="text-sm font-medium text-slate-700 dark:text-slate-300">문제 해결 28%</span><span class="text-xs font-medium text-green-600 dark:text-green-400">+8%</span></div></div></button>
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
          {/* grid 모드: 한 줄에 3개씩, 반응형 지원 */}
          <div className={`grid ${view==='grid'?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10':'space-y-6'}`} style={{justifyItems:'center'}}>
            {notes.length === 0 && !loading && !error && (
              <div className="col-span-full text-center text-slate-400 py-12">표시할 메모가 없습니다.</div>
            )}
            {notes.filter(note => note.title.includes(search) || note.desc.includes(search) || note.tags.some(t=>t.includes(search))).map((note, idx) => {
              // 랜덤 카드 배경/회전/핀
              // 색상 팔레트 개선: 더 부드럽고 깔끔한 파스텔톤
              const BOARD_COLORS = [
                'bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100',
                'bg-gradient-to-br from-blue-100 via-cyan-50 to-green-100',
                'bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100',
                'bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100',
                'bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100',
                'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100',
              ];
              const color = BOARD_COLORS[idx % BOARD_COLORS.length];
              const rotate = ["rotate-1", "-rotate-2", "rotate-2", "-rotate-1", "rotate-0"][idx%5];
              const pin = PIN_ICONS[idx % PIN_ICONS.length];
              const isLast = idx === notes.length-1;
              // 리스트형(가로형) 뷰일 때 배경/레이아웃 분기
              if (view === 'list') {
                // 관심사 키워드는 태그로만, 본문은 짧은 메모(2줄 ...처리)
                const shortMemo = note.short_memo || note.desc || '';
                return (
                  <div
                    key={note.id}
                    ref={isLast ? lastNoteRef : null}
                    className="relative w-full max-w-none self-center mb-6 bg-[#232a36] rounded-2xl p-6 flex flex-row items-start shadow-lg hover:shadow-2xl border border-slate-700/50 transition-all duration-200 group"
                    style={{wordBreak:'break-word'}}
                    onClick={() => navigate(`/notes/${note.id}`)}
                  >
                    {/* 좌측: 이모지/타이틀/분류 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{note.emoji}</span>
                        <h3 className="font-bold text-slate-100 text-lg group-hover:text-blue-400 transition-colors truncate max-w-[60%]">{note.title}</h3>
                        {note.value && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{note.value}</span>}
                      </div>
                      {/* 본문: summary(요약) 내용 표시 */}
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">{note.desc}</p>
                      {/* 관심사 키워드: 하단 태그로만 */}
                      <div className="flex items-center space-x-2 mb-2">
                        {/* keywords(키워드) 값이 있을 때, 쉼표로 분리하여 각각 태그로 렌더링 */}
                        {note.tags.map(tag => (
                          <span key={tag} className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      {/* 하단: 연결/날짜 등 메타 */}
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <div className="flex items-center space-x-1"><Link2 className="w-3 h-3" /><span>{note.connections}개 연결</span></div>
                        <span>{note.time}</span>
                      </div>
                    </div>
                    {/* 우측: 별점/진행도 */}
                    <div className="flex flex-col items-center justify-center ml-6 min-w-[70px]">
                      <div className="flex items-center space-x-1 mb-1">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} className={`w-4 h-4 ${i <= note.stars ? 'text-yellow-400' : 'text-slate-600'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-300 font-medium mb-1">{note.stars}/5</span>
                      <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${note.review === '기억 선명' ? 'bg-green-500' : note.review === '복습 권장' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${note.progress || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              }
              // grid형(포스트잇) 뷰는 기존대로, 색상/태그 스타일 개선
              return (
                <div
                  key={note.id}
                  ref={isLast ? lastNoteRef : null}
                  className={`relative ${color} ${rotate} shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-xl w-[260px] min-h-[260px] flex flex-col items-center p-5 pt-10 border-2 border-amber-100 hover:border-orange-300`}
                  style={{
                    wordBreak:'break-word',
                    backgroundImage: "url('/pin_note.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  {/* 집게/핀 아이콘 */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">{pin}</div>
                  {/* 분류 뱃지: 왼쪽 상단 고정 */}
                  <div className="absolute top-3 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 text-white text-xs font-bold shadow-sm whitespace-nowrap">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {note.value || '분류 없음'}
                    </span>
                  </div>
                  {/* 날짜 강조 뱃지 */}
                  <div className="absolute top-3 right-4 z-10">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/30 whitespace-nowrap">{note.time}</span>
                  </div>
                  {/* grid 뷰에서만 이 부분 렌더링 */}
                  <div className="flex items-center space-x-3 mb-3 min-w-0 mt-2">
                    <span className="text-3xl drop-shadow-lg shrink-0">{note.emoji}</span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg tracking-tight truncate max-w-[60%]">{note.title}</h3>
                  </div>
                  {/* 본문 내용을 더 많이 보여줌 (최대 6줄) */}
                  <p className="text-slate-700 dark:text-slate-300 text-base mb-5 line-clamp-6 leading-relaxed font-medium break-words max-h-36 overflow-hidden">{note.desc}</p>
                  {/* 아래 여백을 flex-grow로 채우고, 메타 정보를 항상 하단에 고정 */}
                  <div className="flex-1 w-full" />
                  {/* 하단: 연결/날짜 등 메타 - 항상 카드 맨 아래 고정 */}
                  <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap w-full justify-start">
                    <div className="flex items-center space-x-1"><Link2 className="w-3 h-3" /><span>{note.connections}개 연결</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          {loading && <div className="text-center text-slate-500 py-8">불러오는 중...</div>}
          {!hasMore && !error && <div className="text-center text-slate-400 py-8">모든 메모를 불러왔습니다.</div>}
        </main>
      </div>
    </div>
  );
};

export default Notes; 