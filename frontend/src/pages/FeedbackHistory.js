import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// lucide-react 아이콘 import
import { ArrowLeft, Filter, Search, ThumbsUp, ThumbsDown, BookOpen, Ban, Clock, AlertCircle } from 'lucide-react';

// 피드백 예시 데이터
const feedbackList = [
  {
    id: 1,
    type: '긍정',
    category: '학습',
    date: '2024-01-15 14:30',
    title: '효과적인 기억 강화 기법',
    detail: '이런 콘텐츠 더 보고 싶어요',
    detailIcon: <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />,
    badge: '긍정',
    badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    badgeIcon: <ThumbsUp className="w-3 h-3" />,
  },
  {
    id: 2,
    type: '부정',
    category: '디자인',
    date: '2024-01-14 09:15',
    title: '2024년 주목받는 디자인 트렌드',
    detail: '주제에 관심 없음',
    detailIcon: <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />,
    badge: '부정',
    badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    badgeIcon: <ThumbsDown className="w-3 h-3" />,
  },
  {
    id: 3,
    type: '부정',
    category: '철학',
    date: '2024-01-12 16:45',
    title: '창의적 사고를 위한 철학적 접근',
    detail: '너무 어려움',
    detailIcon: <BookOpen className="w-4 h-4 text-red-600 dark:text-red-400" />,
    badge: '부정',
    badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    badgeIcon: <ThumbsDown className="w-3 h-3" />,
  },
  {
    id: 4,
    type: '긍정',
    category: '생산성',
    date: '2024-01-10 11:20',
    title: '습관 형성의 과학적 접근법',
    detail: '나중에 다시 보고 싶어요',
    detailIcon: <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />,
    badge: '긍정',
    badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    badgeIcon: <ThumbsUp className="w-3 h-3" />,
  },
  {
    id: 5,
    type: '부정',
    category: '생산성',
    date: '2024-01-08 13:10',
    title: '미루는 습관을 끊는 즉시 실행법',
    detail: '기타',
    detailIcon: <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
    badge: '부정',
    badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    badgeIcon: <ThumbsDown className="w-3 h-3" />,
  },
];

const FeedbackHistory = () => {
  const navigate = useNavigate();
  // 필터 상태: '전체', '긍정', '부정'
  const [filterType, setFilterType] = useState('전체');
  // 필터링된 피드백 리스트
  const filteredList = filterType === '전체' ? feedbackList : feedbackList.filter(f => f.type === filterType);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 상단 헤더 */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">나의 피드백 기록</h1>
      </div>
      {/* 필터 및 검색 영역 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold text-slate-900 dark:text-white">필터 및 검색</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-slate-500 dark:text-slate-400">총 {filteredList.length}개의 피드백</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${filterType === '전체' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              onClick={() => setFilterType('전체')}
              aria-pressed={filterType === '전체'}
            >전체</button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${filterType === '긍정' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              onClick={() => setFilterType('긍정')}
              aria-pressed={filterType === '긍정'}
            ><ThumbsUp className="w-4 h-4" /><span>긍정</span></button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${filterType === '부정' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              onClick={() => setFilterType('부정')}
              aria-pressed={filterType === '부정'}
            ><ThumbsDown className="w-4 h-4" /><span>부정</span></button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="콘텐츠 제목 검색..." className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
        </div>
      </div>
      {/* 피드백 카드 리스트 */}
      <div className="space-y-4">
        {filteredList.map(f => (
          <div key={f.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            <div className="flex items-start p-6 cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                {/* 예시 이미지, 실제 데이터 연동 시 src/alt 변경 */}
                <img src={
                  f.id === 1 ? 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400' :
                  f.id === 2 ? 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400' :
                  f.id === 3 ? 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400' :
                  f.id === 4 ? 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=400' :
                  'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=400'
                } alt={f.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{f.category}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{f.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{f.title}</h3>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${f.badgeColor}`}>{f.badgeIcon}<span>{f.badge}</span></div>
                  <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">{f.detailIcon}<span>{f.detail}</span></div>
                </div>
              </div>
              <div className="ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-5 h-5 text-slate-400"><path d="m6 9 6 6 6-6"></path></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackHistory; 