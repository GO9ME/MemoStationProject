import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Lightbulb, BookOpen, ArrowRight, PenLine, AlertCircle, Target, Heart,
  Eye, Clock, Play, TrendingUp, Compass, Zap, BarChart3, ChevronDown, Puzzle,
  Link2, Sparkles, Check, Crown, X, Calendar, Tag, CheckCircle, Award
} from 'lucide-react';
import UpgradeModal from '../components/UpgradeModal';
import PaymentModal from '../components/PaymentModal';

const Reports = () => {
  const [activeReportTab, setActiveReportTab] = useState('monthly');
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [expandedValueStreamId, setExpandedValueStreamId] = useState(null);
  const [activeConnectionId, setActiveConnectionId] = useState('connection-2');
  const [reminderOpenId, setReminderOpenId] = useState(null);

  const importantNotesData = [
    { id: 1, emoji: '🤔', title: '창의성에 대한 고민', description: '창의적인 아이디어가 나오지 않을 때의 답답함과 그것을 극복하는 방법에 대해...', reason: '이 노트 이후 유사 주제 3건 발생', importance: 85, relatedCount: 3, age: 12, actionText: '실천 계획 작성하기' },
    { id: 2, emoji: '😰', title: '새로운 도전에 대한 두려움', description: '안전한 길과 도전적인 길 사이에서의 고민, 실패에 대한 두려움을 어떻게...', reason: '실행 계획 미작성 상태', importance: 92, relatedCount: 5, age: 8, actionText: '이 노트로 루틴 생성' }
  ];

  const reviewNotesData = [
    { id: 3, emoji: '🤔', timeText: '12일 전 노트를 잊고 계시네요', title: '창의성에 대한 고민', description: '창의적인 아이디어가 나오지 않을 때의 답답함과 그것을 극복하는 방법에 대해...', importance: 85, relatedCount: 3 },
    { id: 4, emoji: '😰', timeText: '8일 전 노트를 잊고 계시네요', title: '새로운 도전에 대한 두려움', description: '안전한 길과 도전적인 길 사이에서의 고민, 실패에 대한 두려움을 어떻게...', importance: 92, relatedCount: 5 }
  ];

  const [visibleReviewNotes, setVisibleReviewNotes] = useState(reviewNotesData.map(n => n.id));

  const handleDismissReview = (id) => {
    setVisibleReviewNotes(prev => prev.filter(noteId => noteId !== id));
  };
  
  const valueStreamData = [
    { id: 'dev', Icon: Target, color: 'blue', title: '자기 개발', description: '개인 성장과 역량 향상', weight: 42, count: 18, change: 15, trend: "0,20 10,15.588235294117647 20,11.176470588235293 30,8.529411764705884 40,5 50,6.764705882352942 60,5" },
    { id: 'problem', Icon: Puzzle, color: 'green', title: '문제 해결', description: '구체적 문제의 해답 탐색', weight: 28, count: 12, change: 8, trend: "0,20 10,16.25 20,10.625 30,8.75 40,5 50,6.875 60,5" },
    { id: 'info', Icon: BarChart3, color: 'purple', title: '정보 정리', description: '지식 체계화와 구조화', weight: 30, count: 13, change: -5, trend: "0,5 10,9.285714285714285 20,11.428571428571429 30,15.714285714285715 40,20 50,17.857142857142858 60,15.714285714285715" }
  ];

  const connectedNotesData = [
    { id: 'connection-1', emoji: '🤔', title: '창의성 블록 극복하기', type: '키워드 연결', typeColor: 'blue', description: '아이디어가 막혔을 때 사용하는 나만의 방법들을 정리해보았다...', age: 5, tags: ['#창의성', '#문제해결'], relevance: 92 },
    { id: 'connection-2', emoji: '😰', title: '새로운 도전에 대한 두려움', type: '본질적 가치 연결', typeColor: 'purple', description: '안전한 길과 모험적인 길 사이에서 고민하는 마음을...', age: 3, tags: ['#도전', '#두려움'], relevance: 87 },
    { id: 'connection-3', emoji: '💡', title: '오늘의 영감 노트', type: '주제 연결', typeColor: 'orange', description: '산책 중에 떠오른 아이디어들을 빠르게 기록...', age: 1, tags: ['#영감', '#아이디어'], relevance: 78 },
  ];

  const toggleValueStream = (id) => {
    setExpandedValueStreamId(prevId => (prevId === id ? null : id));
  };
  
  // 리마인드 알림 모달 컴포넌트 (내부 선언)
  function ReminderModal({ open, onClose }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in fade-in">
          <div className="mb-6">
            <span className="font-medium text-green-900 dark:text-green-300">리마인드 알림 받기</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mb-6">
            <input type="checkbox" className="sr-only peer" checked readOnly />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
          </label>
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-green-700 dark:text-green-400">알림 주기:</span>
              <select className="px-3 py-2 bg-white dark:bg-slate-800 border border-green-300 dark:border-green-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50">
                <option value="1">1일 후</option>
                <option value="3">3일 후</option>
                <option value="7">7일 후</option>
                <option value="14">14일 후</option>
              </select>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">설정한 기간 후에 실천 상황을 확인하는 알림을 보내드려요.</p>
          </div>
          <div className="flex justify-between pt-6">
            <button onClick={onClose} className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">취소</button>
            <button disabled className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2">
              <span>실천 계획 저장</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI 인사이트 리포트</h1><p className="text-slate-600 dark:text-slate-400">데이터로 확인하는 당신의 지식 여정과 성장 로드맵</p></div>
      <div className="flex space-x-2 mb-8">
        <button
          onClick={() => setActiveReportTab('weekly')}
          className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${activeReportTab === 'weekly' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50'}`}
        >
          주간 리포트
        </button>
        <button
          onClick={() => setActiveReportTab('monthly')}
          className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${activeReportTab === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50'}`}
        >
          월간 리포트
        </button>
      </div>
      {activeReportTab === 'weekly' && (
        <div className="text-center text-xl text-slate-500 py-20">주간 리포트 준비 중입니다.</div>
      )}
      {activeReportTab === 'monthly' && (
        <>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-8 h-8" />
                <h2 className="text-2xl font-bold">이번 주의 핵심 인사이트</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="text-3xl font-bold mb-2">실천 중심 콘텐츠 소비율 +34%</div>
                <div className="text-blue-100 text-lg">지난 주 대비 실행 가능한 콘텐츠 선택 비율이 크게 증가했습니다</div>
              </div>
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-6 h-6" />
                  <span className="text-xl font-semibold">AI 해석</span>
                </div>
                <p className="text-xl text-blue-100 leading-relaxed">
                  현재 사용자는 <span className="font-bold text-white">실행 의지가 상승 중</span>입니다. 이론적 학습에서 실무 적용 단계로 전환하려는 강한 동기가 감지됩니다.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                  <div className="flex items-center space-x-3 mb-3">
                    <BookOpen className="w-6 h-6" />
                    <span className="font-semibold text-lg">실행 전략 콘텐츠 보러가기</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-3">실무 적용 가능한 맞춤 콘텐츠를 추천해드려요</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>바로 이동</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                  <div className="flex items-center space-x-3 mb-3">
                    <PenLine className="w-6 h-6" />
                    <span className="font-semibold text-lg">추천 노트 바로 생성하기</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-3">현재 관심사 기반으로 실행 계획 노트를 만들어드려요</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>노트 생성</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">놓치고 있는 중요한 노트</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🤔</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">창의성에 대한 고민</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">창의적인 아이디어가 나오지 않을 때의 답답함과 그것을 극복하는 방법에 대해...</p>
                    <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-bold text-amber-900 dark:text-amber-300">중요 판단 기준</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">이 노트 이후 유사 주제 3건 발생</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>중요도 85%</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <Eye className="w-4 h-4" />
                          <span>3개 연관 노트</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>12일 전</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>다시 보기</span>
                        </button>
                        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>실천 계획 작성하기</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">😰</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">새로운 도전에 대한 두려움</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">안전한 길과 도전적인 길 사이에서의 고민, 실패에 대한 두려움을 어떻게...</p>
                    <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-bold text-amber-900 dark:text-amber-300">중요 판단 기준</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">실행 계획 미작성 상태</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>중요도 92%</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <Eye className="w-4 h-4" />
                          <span>5개 연관 노트</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>8일 전</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>다시 보기</span>
                        </button>
                        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>이 노트로 루틴 생성</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 3. 성장 단계 흐름 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">성장 단계 흐름</h2>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">지식 → 문제해결 → 실행 순서</div>
            </div>
            <div className="mb-8">
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-800 dark:via-purple-800 dark:to-green-800 transform -translate-y-1/2"></div>
                <div className="grid grid-cols-3 gap-8 relative">
                  {/* 지식 추천 */}
                  <div className="text-center cursor-pointer group">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200 relative z-10">
                      <Compass className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">지식 추천</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">새로운 정보와 아이디어 수집</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 relative" style={{ width: '85%' }}>
                        <div className="absolute right-2 top-0 h-full flex items-center"><span className="text-xs text-white font-bold">85%</span></div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">활발한 추천 활동</div>
                  </div>
                  {/* 문제 해결 */}
                  <div className="text-center cursor-pointer group">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200 relative z-10">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">문제 해결</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">구체적 문제 분석과 해결책 모색</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 relative" style={{ width: '65%' }}>
                        <div className="absolute right-2 top-0 h-full flex items-center"><span className="text-xs text-white font-bold">65%</span></div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">문제 해결 중심</div>
                  </div>
                  {/* 실행 강화 */}
                  <div className="text-center cursor-pointer group">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200 relative z-10">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">실행 강화</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">계획 수립과 실제 적용</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 relative" style={{ width: '40%' }}>
                        <div className="absolute right-2 top-0 h-full flex items-center"><span className="text-xs text-white font-bold">40%</span></div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">실행 준비 단계</div>
                  </div>
                </div>
              </div>
            </div>
            {/* 단계별 퍼센트 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">지식 확장</span><span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">+15%</span></div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">75%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">추천 단계</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all duration-500 group-hover:scale-105" style={{ width: '75%' }}></div></div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">문제 해결</span><span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">+25%</span></div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">65%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">분석 단계</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full transition-all duration-500 group-hover:scale-105" style={{ width: '65%' }}></div></div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">실행 강화</span><span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">+35%</span></div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">40%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">적용 단계</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full transition-all duration-500 group-hover:scale-105" style={{ width: '40%' }}></div></div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">창작 영감</span><span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">+10%</span></div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">60%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">확장 단계</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full transition-all duration-500 group-hover:scale-105" style={{ width: '60%' }}></div></div>
              </div>
            </div>
          </div>
          {/* 4. 추천 성과 분석 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">추천 성과 분석</h2>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 mb-6 border border-green-200/50 dark:border-green-800/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">사용자 행동 전환 흐름</h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">24건</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">AI 추천 콘텐츠</div>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">18건</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">클릭</div>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">6건</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">노트화</div>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">33%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">실행율</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">75%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">클릭률</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12% 상승</div>
              </div>
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenLine className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">33%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">노트 전환율</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8% 상승</div>
              </div>
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">87%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">AI 추천 만족도</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">+5% 상승</div>
              </div>
            </div>
          </div>
          {/* 5. 실행 가이드 */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-8 h-8" />
                <h2 className="text-2xl font-bold">이 주의 실행 가이드</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <p className="text-xl font-semibold mb-4">📝 이번 주 당신의 성장 방향은 <span className="font-bold text-green-100">[실행 강화]</span>입니다.</p>
                <p className="text-green-100">지금까지 수집한 지식을 실제로 적용해볼 최적의 시기입니다.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                  <div className="flex items-center space-x-3 mb-3">
                    <Brain className="w-6 h-6" />
                    <span className="font-semibold">AI 루틴 노트 생성하기</span>
                  </div>
                  <p className="text-green-200 text-sm mb-3">현재 관심사를 바탕으로 실행 가능한 루틴을 만들어드려요</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>바로 생성</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                  <div className="flex items-center space-x-3 mb-3">
                    <BookOpen className="w-6 h-6" />
                    <span className="font-semibold">실천 전략 콘텐츠 3편 보기</span>
                  </div>
                  <p className="text-green-200 text-sm mb-3">실무 적용에 특화된 맞춤 콘텐츠를 추천해드려요</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>콘텐츠 보기</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 className="w-6 h-6" />
                    <span className="font-semibold">실천 점검 대시보드 열기</span>
                  </div>
                  <p className="text-green-200 text-sm mb-3">실행 계획의 진행 상황을 체계적으로 관리해보세요</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>대시보드 열기</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* 6. 가치 흐름 분석 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">가치 흐름 분석</h2>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center space-x-1">
                <span>세부 분석 보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">당신의 본질적 가치 카테고리별 활동 패턴과 변화 추이를 분석합니다.</p>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                  <Target className="w-6 h-6 text-blue-500" />
                  <span>가치 흐름 분석</span>
                </h2>
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>지난 7일</span>
                </div>
              </div>
              {/* 예시: 자기 개발, 문제 해결, 정보 정리 */}
              <div className="space-y-4 mb-8">
                <div className="group cursor-pointer p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Target className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">자기 개발</h3>
                          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-200">
                            <PenLine className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
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
                      <div className="text-right">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">7일 추이</div>
                        {/* 예시: 추이 polyline 그래프 */}
                        <svg width="60" height="20" className="overflow-visible"><polyline points="0,20 10,15.6 20,11.2 30,8.5 40,5 50,6.8 60,5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500"></polyline></svg>
                      </div>
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:rotate-180 duration-200" />
                    </div>
                  </div>
                </div>
                {/* ... (문제 해결, 정보 정리 등 추가 예시) ... */}
              </div>
            </div>
          </div>
          {/* 7. 연결된 생각들 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Link2 className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">연결된 생각들</h2>
              </div>
              <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center space-x-1">
                <span>연관도 분석 보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">AI가 발견한 노트 간의 연결성과 패턴을 통해 새로운 인사이트를 얻어보세요.</p>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                  <Link2 className="w-6 h-6 text-blue-500" />
                  <span>연결된 생각들</span>
                </h2>
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Brain className="w-4 h-4" />
                  <span>AI가 발견한 연관성</span>
                </div>
              </div>
              {/* 예시: 연관 노트 카드 */}
              <div className="space-y-4">
                <div className="group cursor-pointer p-5 rounded-2xl border transition-all duration-200 border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-2xl">🤔</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">창의성 블록 극복하기</h3>
                          <span className="text-xs px-2 py-1 rounded-full font-medium text-blue-500 bg-blue-100 dark:bg-blue-900/30">키워드 연결</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-1">아이디어가 막혔을 때 사용하는 나만의 방법들을 정리해보았다...</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>5일 전</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <div className="flex space-x-1">
                              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">#창의성</span>
                              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">#문제해결</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">92%</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">연관도</div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* ... (다른 연관 노트 카드 예시 추가) ... */}
              </div>
            </div>
          </div>
          {/* 8. 프리미엄 업그레이드 */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <Crown className="w-6 h-6" />
                  <h3 className="text-xl font-bold">프리미엄으로 업그레이드</h3>
                </div>
                <p className="text-purple-100 mb-6">더 강력한 AI 기능과 무제한 연동으로 생산성을 극대화하세요.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <div>
                      <div className="font-medium">고급 AI 분석</div>
                      <div className="text-sm text-purple-200">더 정교한 감정 분석과 패턴 인식</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <div>
                      <div className="font-medium">외부 툴 연동</div>
                      <div className="text-sm text-purple-200">노션, 옵시디언 등과 무제한 연동</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <div>
                      <div className="font-medium">무제한 메모</div>
                      <div className="text-sm text-purple-200">메모 개수 제한 없이 자유롭게 작성</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <div>
                      <div className="font-medium">우선 고객 지원</div>
                      <div className="text-sm text-purple-200">24시간 내 답변 보장</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">₩9,900</div>
                    <div className="text-sm text-purple-200">월 구독</div>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>지금 업그레이드</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 9. AI 피드백 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">AI 개선을 위한 피드백</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">추천이 도움이 되었나요? 더 나은 추천을 위해 의견을 들려주세요.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <textarea placeholder="피드백을 입력해주세요..." className="flex-1 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" rows={3}></textarea>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors self-start">피드백 전송</button>
            </div>
          </div>
        </>
      )}
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} />
    </div>
  );
};

export default Reports;