import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Filter, List, LayoutGrid, TrendingUp, ArrowRight, Lightbulb, Plus, Zap, PenLine, Star, Search, Brain, Tag, Link2, Clock, X, HelpCircle, CheckCircle, Sparkles, Target, AlertCircle, Calendar, Eye, Heart, BarChart3, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TodaySummaryCard from '../components/TodaySummaryCard';

const MEMOS_API = 'http://121.171.194.10:8000/api/memos';
const PAGE_SIZE = 8;

// 메모 타입에 따른 이모지 반환 함수
function getEmojiByMemoType(memoType) {
  const typeMap = {
    '자기개발': '💡',
    '업무': '💼', 
    '일상': '📔',
    '학습': '📚',
    '목표': '🎯',
    '아이디어': '🌟',
    '회고': '🤔',
    '계획': '📋'
  };
  return typeMap[memoType] || '📝';
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays-1}일 전`;
    return date.toLocaleDateString('ko-KR');
  } catch (e) {
    return dateString;
  }
}

const Notes = () => {
  // 상태 관리
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();

  // 필터 상태
  const [valueFilter, setValueFilter] = useState([]);
  const [reviewFilter, setReviewFilter] = useState([]);
  const [keywordFilter, setKeywordFilter] = useState([]);
  const [aiFilter, setAiFilter] = useState([]);

  // 모달 상태
  const [showModeModal, setShowModeModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideAnswers, setGuideAnswers] = useState(['', '', '']);

  // 필터 섹션 접기/펼치기 상태
  const [filterSections, setFilterSections] = useState({
    sort: true,
    value: true,
    review: true,
    keyword: true,
    ai: true
  });

  // 통계 데이터 계산
  const totalNotes = notes.length;
  const aiRecommendedNotes = notes.filter(note => note.ai || note.memo_type === '자기개발').length;
  const reviewNeededNotes = notes.filter(note => note.review === '복습 필요' || Math.random() > 0.7).length;

  // DB에서 메모 불러오기
  const fetchMemos = useCallback(async (resetPage = false) => {
    setLoading(true);
    setError(null);
    
    if (resetPage) {
      setPage(1);
      setNotes([]);
    }
    
    try {
      const currentPage = resetPage ? 1 : page;
      const response = await fetch(`${MEMOS_API}?page=${currentPage}&size=${PAGE_SIZE}`);
      if (!response.ok) throw new Error('메모 데이터를 불러올 수 없습니다.');
      
      const data = await response.json();
      
        if (data.memos) {
        const mapped = data.memos.map((row) => ({
            id: row.id,
          emoji: getEmojiByMemoType(row.memo_type),
          title: row.summary ? row.summary.slice(0, 50) : row.content ? row.content.slice(0, 50) + '...' : '(제목 없음)',
          desc: row.content ? row.content.slice(0, 120) + '...' : row.summary || '',
          value: row.style || '정보 정리',
            valueColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
          ai: Math.random() > 0.5, // AI 분석 여부 (임시)
          aiColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
          review: ['기억 선명', '복습 권장', '복습 필요'][Math.floor(Math.random() * 3)],
          reviewColor: Math.random() > 0.5 ? 'text-green-500 bg-green-100 dark:bg-green-900/30' : 
                      Math.random() > 0.5 ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' :
                      'text-red-500 bg-red-100 dark:bg-red-900/30',
          tags: row.keyword ? row.keyword.split(',').map(t=>t.trim()).filter(Boolean).slice(0, 3) : [],
          connections: Math.floor(Math.random() * 10),
          time: formatDate(row.date) || '',
          stars: Math.floor(Math.random() * 5) + 1,
          progress: Math.floor(Math.random() * 100),
          // 새 테이블 구조에 맞는 필드들
          memo_type: row.memo_type,
          persona_id: row.persona_id,
          persona_age: row.persona_age,
          persona_profession: row.persona_profession,
          content: row.content,
            interests: row.interests,
            pain_points: row.pain_points,
          keyword: row.keyword,
          summary: row.summary,
          }));
        
        if (resetPage) {
          setNotes(mapped);
        } else {
          setNotes(prev => [...prev, ...mapped]);
        }
      setHasMore(data.has_more);
      } else {
        if (resetPage) setNotes([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // 초기 로드
  useEffect(() => {
    fetchMemos(true);
  }, []);

  // 무한스크롤 IntersectionObserver
  const lastNoteRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.7 });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // page가 변경될 때마다 fetchMoreNotes 실행
  useEffect(() => {
    if (page > 1) {
      fetchMemos(false);
    }
  }, [page, fetchMemos]);

  // 체크박스 핸들러
  const handleCheckbox = (filter, setFilter, value) => {
    setFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  // 필터 섹션 토글 핸들러
  const toggleFilterSection = (section) => {
    setFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 중요 노트 계산
  const importantNotes = notes.filter(note => note.ai || note.connections > 5).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* 상단 헤더 */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI가 본 오늘의 나</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">작성한 모든 노트들로 분석된 결과</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                <button 
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => setShowModeModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>새 노트</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div className="flex gap-8">
          {/* 좌측: 스마트 필터 */}
          <div className="w-80 flex-shrink-0 space-y-6 hidden lg:block">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 sticky top-24 shadow-xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>스마트 필터</span>
            </h3>
              
              {/* 정렬 */}
            <div className="mb-6">
                <button 
                  onClick={() => toggleFilterSection('sort')}
                  className="w-full font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>정렬</span>
                  </div>
                  {filterSections.sort ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {filterSections.sort && (
                <div className="space-y-2">
                  {[
                    { label: '최신순', value: 'recent', icon: Clock },
                    { label: '중요도순', value: 'importance', icon: Star },
                    { label: '연결성순', value: 'connections', icon: Link2 },
                    { label: '복습 필요순', value: 'forgetting', icon: AlertCircle },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <input 
                        type="radio" 
                        name="sort" 
                        className="text-blue-600 focus:ring-blue-500" 
                        value={opt.value} 
                        checked={sort === opt.value} 
                        onChange={() => setSort(opt.value)} 
                      />
                      <opt.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

              {/* 본질적 가치 */}
            <div className="mb-6">
                <button 
                  onClick={() => toggleFilterSection('value')}
                  className="w-full font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>본질적 가치</span>
                  </div>
                  {filterSections.value ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {filterSections.value && (
                <div className="space-y-2">
                  {['자기 개발','문제 해결','정보 정리','창의적 탐색','실행 강화'].map(label => (
                    <label key={label} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        checked={valueFilter.includes(label)} 
                        onChange={() => handleCheckbox(valueFilter, setValueFilter, label)} 
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

              {/* 복습 상태 */}
            <div className="mb-6">
                <button 
                  onClick={() => toggleFilterSection('review')}
                  className="w-full font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>복습 상태</span>
                  </div>
                  {filterSections.review ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {filterSections.review && (
                <div className="space-y-2">
                  {[
                    { label: '기억 선명', color: 'text-green-600' },
                    { label: '복습 권장', color: 'text-yellow-600' },
                    { label: '복습 필요', color: 'text-red-600' }
                  ].map(item => (
                    <label key={item.label} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        checked={reviewFilter.includes(item.label)} 
                        onChange={() => handleCheckbox(reviewFilter, setReviewFilter, item.label)} 
                      />
                      <div className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
                      <span className={`text-sm ${item.color}`}>{item.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

              {/* 키워드 */}
            <div className="mb-6">
                <button 
                  onClick={() => toggleFilterSection('keyword')}
                  className="w-full font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>키워드</span>
                  </div>
                  {filterSections.keyword ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {filterSections.keyword && (
                <div className="space-y-2">
                  {['#디자인','#AI','#생산성','#성찰','#기술','#개인'].map(kw => (
                    <label key={kw} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        checked={keywordFilter.includes(kw)} 
                        onChange={() => handleCheckbox(keywordFilter, setKeywordFilter, kw)} 
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{kw}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

              {/* AI 분석 */}
            <div>
                <button 
                  onClick={() => toggleFilterSection('ai')}
                  className="w-full font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>AI 분석</span>
                  </div>
                  {filterSections.ai ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {filterSections.ai && (
                <div className="space-y-2">
                  {['AI 추천 대상','높은 연결성'].map(label => (
                    <label key={label} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        checked={aiFilter.includes(label)} 
                        onChange={() => handleCheckbox(aiFilter, setAiFilter, label)} 
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>

          {/* 우측: 내 노트 전체 */}
          <div className="flex-1 min-w-0">
            {/* 상단 헤더/통계 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">내 노트</h1>
                <p className="text-slate-600 dark:text-slate-400 flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>총 {totalNotes}개</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span>AI 추천 {aiRecommendedNotes}개</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span>복습 필요 {reviewNeededNotes}개</span>
                  </span>
                </p>
              </div>
            </div>

            {/* 상단 카드 1: 나의 최근 가치 흐름 */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-6 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">나의 최근 가치 흐름</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">지난 7일간 노트 작성 패턴 분석</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">자기 개발</span>
                  <div className="text-lg font-bold text-blue-600">{notes.filter(n => n.value === '자기 개발').length}</div>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">정보 정리</span>
                  <div className="text-lg font-bold text-purple-600">{notes.filter(n => n.value === '정보 정리').length}</div>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">문제 해결</span>
                  <div className="text-lg font-bold text-green-600">{notes.filter(n => n.value === '문제 해결').length}</div>
                </div>
              </div>
            </div>

            {/* 상단 카드 2: 오늘의 AI 추천 정리 루틴 */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">오늘의 AI 추천 정리 루틴</h3>
              </div>
                <button 
                  onClick={() => setShowRoutineModal(true)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                <Plus className="w-4 h-4" />
                <span>루틴 생성</span>
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">우선순위가 높은 노트들을 정리하여 생각을 체계화해보세요</p>
            <div className="space-y-3">
                {importantNotes.map((note, idx) => (
                  <div key={note.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/30 dark:to-slate-800/30 rounded-xl hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="text-2xl">{note.emoji}</div>
                  <div className="flex-1 text-left">
                        <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{note.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">연결성 {note.connections}개 • {note.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-400">높음</span>
                      <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">실천 계획 작성</button>
                </div>
                  </div>
                ))}
                </div>
            </div>

            {/* 현재 성장 단계 카드 */}
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-green-200/50 dark:border-green-800/50 hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">현재 성장 단계: 실행 강화 단계</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">지식 수집에서 실무 적용으로 전환 중</p>
                </div>
              </div>
              <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">40%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">진행률</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex-1 mr-6">
                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 group-hover:from-green-400 group-hover:to-emerald-400" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105">
                <PenLine className="w-4 h-4" />
                <span>실천 계획 3개 작성하기</span>
                </button>
              </div>
            </div>

            {/* 노트 검색창 */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="노트 제목, 내용, 태그로 검색..."
              value={search}
                onChange={e => setSearch(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-lg placeholder-slate-400 dark:placeholder-slate-500" 
            />
          </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                  </div>
                  <button
                    onClick={() => fetchMemos(true)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    재시도
                  </button>
                </div>
              </div>
            )}

            {/* 노트 리스트 */}
            <div className="space-y-4">
              {notes.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">아직 노트가 없습니다</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">첫 번째 노트를 작성해보세요!</p>
                  <button 
                    onClick={() => setShowModeModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 노트 작성</span>
                  </button>
                </div>
              ) : (
                notes.map((note, idx) => (
                  <div
                    key={note.id}
                    ref={idx === notes.length - 1 ? lastNoteRef : null}
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-3xl">{note.emoji}</span>
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">{note.title}</h3>
                          <div className="flex items-center space-x-2">
                            <div className={`${note.valueColor} px-3 py-1 rounded-full text-xs font-medium`}>{note.value}</div>
                            {note.ai && (
                              <div className={`${note.aiColor} flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium`}>
                                <Brain className="w-3 h-3" />
                                <span>AI 추천</span>
                              </div>
                            )}
                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${note.reviewColor}`}>
                              <Clock className="w-3 h-3" />
                              <span>{note.review}</span>
                            </div>
                          </div>
                      </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{note.desc}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Tag className="w-4 h-4 text-slate-400" />
                              <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                                  <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                    {tag}
                                  </span>
                        ))}
                      </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Link2 className="w-3 h-3" />
                              <span>{note.connections}개 연결</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                        <span>{note.time}</span>
                            </div>
                          </div>
                      </div>
                    </div>
                    {/* 우측: 별점/진행도 */}
                      <div className="flex flex-col items-center space-y-3 ml-6">
                        <div className="flex items-center space-x-1">
                        {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-4 h-4 ${i <= note.stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'} transition-colors`} />
                        ))}
                      </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{note.stars}/5</span>
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              note.reviewColor.includes('green') ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                              note.reviewColor.includes('yellow') ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                              'bg-gradient-to-r from-red-400 to-red-500'
                            }`} 
                            style={{ width: `${note.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{note.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* 로딩 인디케이터 */}
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      {/* 방식 선택 모달 */}
      {showModeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">노트 작성 방식 선택</h3>
              <button onClick={() => setShowModeModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowModeModal(false);
                  navigate('/notes/new');
                }}
                className="w-full p-4 text-left bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <PenLine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">빠른 작성</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">간단하고 빠르게 아이디어를 기록</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowModeModal(false);
                  setShowGuideModal(true);
                }}
                className="w-full p-4 text-left bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl border border-green-200 dark:border-green-800 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">가이드 모드</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">질문에 답하며 체계적으로 작성</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowModeModal(false);
                  navigate('/notes/enhanced');
                }}
                className="w-full p-4 text-left bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">향상된 에디터</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">풍부한 기능으로 상세하게 작성</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default Notes; 