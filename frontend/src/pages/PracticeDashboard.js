import React, { useState, useEffect } from 'react';
import {
  Target, Plus, Calendar, Lightbulb, Award, AlertCircle, CheckCircle, Zap, PenLine, Bell, Eye
} from 'lucide-react';

const PracticeDashboard = () => {
  // 실행 항목 데이터 (예시) - 각 항목에 category 추가
  const [allExecutionItems, setAllExecutionItems] = useState([
    {
      id: 1,
      category: '생산성',
      status: 'completed',
      description: '오전 9-11시 집중 시간 블록 설정',
      scheduledDate: '2024-01-15',
      difficulty: '보통',
      relatedNote: '노트 보기',
      completedDate: '2024-01-15',
    },
    {
      id: 2,
      category: '생산성',
      status: 'completed',
      description: '회의 시간 최적화 (30분 → 20분)',
      scheduledDate: '2024-01-16',
      difficulty: '쉬움',
      relatedNote: null,
      completedDate: '2024-01-16',
    },
    {
      id: 3,
      category: '생산성',
      status: 'pending',
      description: 'React 공식 문서 읽기 (30분)',
      scheduledDate: '2024-01-17',
      difficulty: '보통',
      relatedNote: null,
      completedDate: null,
    },
    {
      id: 4,
      category: '생산성',
      status: 'completed',
      description: '저녁 10시 이전 취침',
      scheduledDate: '2024-01-15',
      difficulty: '어려움',
      relatedNote: null,
      completedDate: '2024-01-15',
    },
    {
      id: 5,
      category: '성장',
      status: 'pending',
      description: '하루 1시간 코딩 테스트 문제 풀이',
      scheduledDate: '2024-01-18',
      difficulty: '어려움',
      relatedNote: null,
      completedDate: null,
    },
    {
      id: 6,
      category: '성장',
      status: 'pending',
      description: '주 1회 개발 블로그 글 작성',
      scheduledDate: '2024-01-19',
      difficulty: '보통',
      relatedNote: null,
      completedDate: null,
    },
    {
      id: 7,
      category: '건강',
      status: 'completed',
      description: '매일 30분 유산소 운동',
      scheduledDate: '2024-01-20',
      difficulty: '쉬움',
      relatedNote: null,
      completedDate: '2024-01-20',
    },
    {
      id: 8,
      category: '건강',
      status: 'pending',
      description: '일주일에 3번 이상 물 2리터 마시기',
      scheduledDate: '2024-01-21',
      difficulty: '쉬움',
      relatedNote: null,
      completedDate: null,
    },
  ]);

  // 전체 항목 보기 상태
  const [showAllItems, setShowAllItems] = useState(false);
  // 활성 목표 카테고리 (기본값: 생산성)
  const [activeCategory, setActiveCategory] = useState('생산성');
  // 리마인드 알림 모달 상태
  const [showReminderModal, setShowReminderModal] = useState(false);
  // 실행 성찰 기록 모달 상태
  const [showReflectionModal, setShowReflectionModal] = useState(false);

  // 모달이 열리면 배경 스크롤 방지
  useEffect(() => {
    if (showReminderModal || showReflectionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // 컴포넌트 언마운트 시 초기화
    };
  }, [showReminderModal, showReflectionModal]);

  // 현재 활성 카테고리에 해당하는 항목 필터링
  const filteredExecutionItems = allExecutionItems.filter(item => item.category === activeCategory);

  // 완료된 항목 수 계산
  const completedCount = filteredExecutionItems.filter(item => item.status === 'completed').length;

  // 현재 표시할 항목 필터링 (전체 보기/미완료만 보기)
  const displayedItems = showAllItems
    ? filteredExecutionItems
    : filteredExecutionItems.filter(item => item.status !== 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">실천 점검 대시보드</h1><p className="text-slate-600 dark:text-slate-400">목표 달성 현황을 체계적으로 관리하고 다음 단계를 계획해보세요</p></div>
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"><div className="flex items-center justify-between mb-6"><div className="flex items-center space-x-3"><Target className="w-6 h-6 text-green-500"/><h2 className="text-2xl font-bold text-slate-900 dark:text-white">이번 주 목표 요약</h2></div><button className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"><Plus className="w-4 h-4"/><span>새 목표</span></button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 생산성 카드 */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${activeCategory === '생산성' ? 'border-green-500 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            onClick={() => setActiveCategory('생산성')}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">생산성</span>
              <div className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30">순조</div>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">업무 효율성 향상</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">시간 블록킹 방식을 도입하여 집중 시간 확보</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">진행률</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">75%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div className="h-3 rounded-full transition-all duration-500 bg-blue-500" style={{width: '75%'}}></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400"><Calendar className="w-4 h-4"/><span>목표일: 2024-01-21</span></div>
          </div>

          {/* 성장 카드 */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${activeCategory === '성장' ? 'border-green-500 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            onClick={() => setActiveCategory('성장')}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">성장</span>
              <div className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30">지연</div>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">학습 루틴 정착</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">매일 30분씩 새로운 기술 학습하기</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">진행률</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">60%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div className="h-3 rounded-full transition-all duration-500 bg-blue-500" style={{width: '60%'}}></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400"><Calendar className="w-4 h-4"/><span>목표일: 2024-01-20</span></div>
          </div>

          {/* 건강 카드 */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${activeCategory === '건강' ? 'border-green-500 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            onClick={() => setActiveCategory('건강')}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">건강</span>
              <div className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30">순조</div>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">건강한 습관 만들기</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">규칙적인 운동과 수면 패턴 유지</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">진행률</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">90%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div className="h-3 rounded-full transition-all duration-500 bg-green-500" style={{width: '90%'}}></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400"><Calendar className="w-4 h-4"/><span>목표일: 2024-01-22</span></div>
          </div>

        </div></div><div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">실행 항목 상세</h2><div className="flex items-center space-x-3"><button className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300" onClick={() => setShowAllItems(!showAllItems)}>{showAllItems ? '일부만 보기' : '전체 보기'}</button><span className="text-sm text-slate-500 dark:text-slate-400">{completedCount} / {filteredExecutionItems.length} 완료</span></div></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700"><th className="text-left py-4 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">상태</th><th className="text-left py-4 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">실행 항목</th><th className="text-left py-4 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">예정일</th><th className="text-left py-4 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">난이도</th><th className="text-left py-4 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">관련 노트</th><th className="text-left py-4 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">완료일</th></tr></thead><tbody>
            {displayedItems.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                    {item.status === 'completed' ? <CheckCircle className="w-4 h-4"/> : null}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className={`font-medium ${item.status === 'completed' ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{item.description}</span>
                </td>
                <td className="py-4 px-2 text-sm text-slate-600 dark:text-slate-400">{item.scheduledDate}</td>
                <td className="py-4 px-2"><span className={`text-sm font-medium ${item.difficulty === '어려움' ? 'text-red-600' : item.difficulty === '보통' ? 'text-yellow-600' : 'text-green-600'}`}>{item.difficulty}</span></td>
                <td className="py-4 px-2">
                  {item.relatedNote ? (
                    <button className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"><Eye className="w-3 h-3"/><span>{item.relatedNote}</span></button>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </td>
                <td className="py-4 px-2 text-sm text-slate-600 dark:text-slate-400">{item.completedDate || '-'}</td>
              </tr>
            ))}
          </tbody></table></div></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"><div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"><div className="flex items-center space-x-3 mb-6"><Lightbulb className="w-6 h-6 text-yellow-500"/><h2 className="text-2xl font-bold text-slate-900 dark:text-white">실행 인사이트</h2></div><div className="text-center mb-6"><div className="relative w-32 h-32 mx-auto mb-4"><svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-200 dark:text-slate-700"></path><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="78, 100" className="text-green-500"></path></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-slate-900 dark:text-white">78%</span></div></div><p className="text-sm text-slate-600 dark:text-slate-400">12 / 15 항목 완료</p></div><div className="space-y-6"><div><h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center space-x-2"><Award className="w-4 h-4"/><span>잘하고 있는 점</span></h3><ul className="space-y-2"><li className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/><span>시간 관리 관련 실행력이 높음</span></li><li className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/><span>작은 습관부터 차근차근 실행</span></li><li className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/><span>완료 후 기록하는 습관이 좋음</span></li></ul></div><div><h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center space-x-2"><AlertCircle className="w-4 h-4"/><span>개선이 필요한 점</span></h3><ul className="space-y-2"><li className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"/><span>학습 관련 목표 달성률 개선 필요</span></li><li className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"/><span>어려운 난이도 항목 실행 전략 보완</span></li><li className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"/><span>주말 실행률이 평일보다 낮음</span></li></ul></div></div></div><div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"><div className="flex items-center space-x-3 mb-6"><Zap className="w-6 h-6 text-blue-500"/><h2 className="text-2xl font-bold text-slate-900 dark:text-white">다음 주 우선 추천</h2></div><div className="space-y-4 mb-6"><div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50"><div className="flex items-start space-x-3"><div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div><p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">학습 시간을 15분으로 줄여서 부담 감소</p></div></div><div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50"><div className="flex items-start space-x-3"><div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div><p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">어려운 항목을 2-3개 작은 단위로 분할</p></div></div><div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50"><div className="flex items-start space-x-3"><div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div><p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">주말 실행 계획을 평일에 미리 수립</p></div></div></div><button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"><PenLine className="w-5 h-5"/><span>다음 주 계획 바로 작성</span></button></div></div>
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white"><h2 className="text-2xl font-bold mb-6">실행 관리 도구</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group" onClick={() => setShowReminderModal(true)}><div className="flex items-center space-x-3 mb-3"><Bell className="w-6 h-6"/><span className="font-semibold text-lg">리마인드 알림 설정</span></div><p className="text-purple-100 text-sm">실행 계획을 잊지 않도록 맞춤 알림을 설정하세요</p></button><button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group"
            onClick={() => setShowReflectionModal(true)}>
            <div className="flex items-center space-x-3 mb-3"><PenLine className="w-6 h-6"/><span className="font-semibold text-lg">실패/성공 요인 기록</span></div><p className="text-purple-100 text-sm">실행 과정에서 배운 점들을 기록하여 다음에 활용하세요</p></button></div></div>

      {/* 리마인드 알림 모달 */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">리마인드 알림 설정</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowReminderModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-2">알림 시간</label>
                <input type="time" className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white" defaultValue="09:00"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-2">알림 주기</label>
                <select className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white">
                  <option className="dark:bg-slate-700">매일</option>
                  <option className="dark:bg-slate-700">평일만</option>
                  <option className="dark:bg-slate-700">주말만</option>
                  <option className="dark:bg-slate-700">사용자 지정</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={() => setShowReminderModal(false)}>취소</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors">설정 완료</button>
            </div>
          </div>
        </div>
      )}

      {/* 실행 성찰 기록 모달 */}
      {showReflectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">실행 성찰 기록</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowReflectionModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">이번 주 실행 과정에서 배운 점</label>
                <textarea placeholder="성공한 요인, 실패한 이유, 개선할 점 등을 자유롭게 적어보세요..." className="w-full p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none dark:text-white" rows="6"></textarea>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">성찰 가이드</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• 어떤 항목이 쉽게 실행되었나요?</li>
                  <li>• 어려웠던 항목의 원인은 무엇인가요?</li>
                  <li>• 다음에는 어떻게 개선할 수 있을까요?</li>
                </ul>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={() => setShowReflectionModal(false)}>취소</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors">기록 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeDashboard; 