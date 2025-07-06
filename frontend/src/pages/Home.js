import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Plus,
  Heart,
  ExternalLink,
  Clock,
  Eye,
  BarChart3,
  ChevronDown,
  PenLine,
  Puzzle,
  Tag,
  Calendar,
  Link2,
  X,
  Zap,
  Sprout,
  MessageCircle
} from 'lucide-react';

// ========================= 예시 데이터 =========================
const insightStats = [
  { label: '오전 집중도', value: '92%', icon: <TrendingUp className="w-4 h-4 text-green-500" /> },
  { label: '저녁 성찰도', value: '78%', icon: <TrendingUp className="w-4 h-4 text-slate-400" /> },
  { label: '감정 변화', value: '3회', icon: <TrendingUp className="w-4 h-4 text-red-500" /> },
];
const todayRecommendations = [
  {
    category: 'Memory Science',
    title: '효과적인 기억 강화 기법',
    desc: '과학적으로 검증된 기억 강화 방법론과 일상에서 적용할 수 있는 실용적 기법들을 소개합니다.',
    reason: '최근 학습 관련 노트가 증가했어요',
    readTime: '8분 읽기',
    score: '94%',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    category: 'Creative Thinking',
    title: '창의적 문제 해결 사고법',
    desc: '막힌 상황에서 새로운 관점을 찾고 창의적 해결책을 도출하는 체계적 방법론입니다.',
    reason: '문제 해결 관련 고민이 자주 나타나고 있어요',
    readTime: '12분 읽기',
    score: '89%',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    category: 'Mindful Living',
    title: '마음챙김을 통한 감정 정리법',
    desc: '복잡한 감정을 차분히 들여다보고 정리하는 마음챙김 기반 접근법을 다룹니다.',
    reason: '본질적 가치 정리 욕구가 보여요',
    readTime: '10분 읽기',
    score: '87%',
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];
const revisitNotes = [
  {
    emoji: '🤔',
    title: '창의성에 대한 고민',
    desc: '창의적인 아이디어가 나오지 않을 때의 답답함과 그것을 극복하는 방법에 대해...',
    importance: '85%',
    related: 3,
    last: '12일 전',
  },
  {
    emoji: '😰',
    title: '새로운 도전에 대한 두려움',
    desc: '안전한 길과 도전적인 길 사이에서의 고민, 실패에 대한 두려움을 어떻게...',
    importance: '92%',
    related: 5,
    last: '8일 전',
  },
];
const valueTrends = [
  {
    title: '자기 개발',
    desc: '개인 성장과 역량 향상',
    percent: '42%',
    count: '18회',
    change: '+15%',
    color: 'blue',
    icon: <Target className="w-6 h-6" />,
    chart: 'blue',
  },
  {
    title: '문제 해결',
    desc: '구체적 문제의 해답 탐색',
    percent: '28%',
    count: '12회',
    change: '+8%',
    color: 'green',
    icon: <Puzzle className="w-6 h-6" />,
    chart: 'green',
  },
  {
    title: '정보 정리',
    desc: '지식 체계화와 구조화',
    percent: '30%',
    count: '13회',
    change: '-5%',
    color: 'purple',
    icon: <BarChart3 className="w-6 h-6" />,
    chart: 'purple',
  },
];

// ========================= Home 컴포넌트 =========================
const Home = () => {
  // 빠른 메모 모달 상태
  const [showQuickMemo, setShowQuickMemo] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [memoText, setMemoText] = useState("");

  // 이모지/기분 리스트
  const moodList = [
    { key: 'think', icon: '🤔' },
    { key: 'idea', icon: '💡' },
    { key: 'calm', icon: '😌' },
    { key: 'target', icon: <Target className="w-5 h-5 text-blue-400" /> },
    { key: 'heart', icon: <Heart className="w-5 h-5 text-red-400" /> },
    { key: 'zap', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { key: 'sprout', icon: <Sprout className="w-5 h-5 text-green-400" /> },
    { key: 'thought', icon: <MessageCircle className="w-5 h-5 text-slate-400" /> },
  ];

  // 빠른 메모 저장 함수
  const handleQuickMemoSave = async () => {
    if (!memoText) return alert('메모를 입력하세요!');
    try {
      const res = await fetch('http://121.171.194.10:8000/api/quick-memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memoText, mood: selectedMood }),
      });
      const data = await res.json();
      if (data.success) {
        alert('저장 완료!');
        setShowQuickMemo(false);
        setMemoText('');
        setSelectedMood(null);
        // 저장 후 페이지 새로고침 (리다이렉트)
        window.location.reload();
      } else {
        alert('저장 실패');
      }
    } catch (e) {
      alert('저장 중 오류 발생');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-korean">
      {/* ========================= AI 인사이트 카드 ========================= */}
      <div className="relative overflow-hidden rounded-3xl transition-all duration-700 opacity-100 translate-y-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-5"></div>
        <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">AI 인사이트</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">감정의 흐름에서 패턴을 발견했어요</h1>
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">실시간 분석</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">오전에는 목표 지향적, 저녁에는 성찰적 메모가 많아요. 하루의 리듬이 뚜렷하게 나타나고 있습니다.</p>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 bg-opacity-10 px-4 py-2 rounded-xl">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">시간대별 맞춤 콘텐츠를 추천드릴게요</span>
              </div>
            </div>
            <div className="space-y-3">
              {insightStats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">{stat.value}</span>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ========================= 현재 목적 카드 ========================= */}
      <Link to="/explore" className="group block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100 dark:hover:from-blue-900/30 hover:to-indigo-100 dark:hover:to-indigo-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">현재 목적</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">📘 최근 '지식 확장'을 위한 콘텐츠 추천 중</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">2시간 전 업데이트 • 8개 콘텐츠 추천 • 3개 관련 메모</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">활발한 탐색</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">목적 달성률 78%</div>
            </div>
            <div className="w-10 h-10 bg-white/50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowRight className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">목적별 맞춤 추천을 더 자세히 탐색해보세요</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">탐색 메뉴로 이동 →</span>
          </div>
        </div>
      </Link>
      {/* ========================= 빠른 메모 작성 버튼/모달 ========================= */}
      <button
        className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 group"
        onClick={() => setShowQuickMemo(true)}
      >
        <div className="flex items-center justify-center space-x-3 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          <Plus className="w-5 h-5" />
          <span className="font-medium">빠른 메모 작성</span>
        </div>
      </button>
      {showQuickMemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-xl relative border border-slate-700">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-200" onClick={() => setShowQuickMemo(false)}>
              <X className="w-6 h-6" />
            </button>
            <div className="text-lg font-bold text-white mb-4">빠른 메모</div>
            <div className="mb-4">
              <div className="text-sm text-slate-300 mb-2">지금 기분은?</div>
              <div className="flex space-x-3">
                {moodList.map((mood) => (
                  <button
                    key={mood.key}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-700 border-2 transition-all duration-150 ${selectedMood === mood.key ? 'border-blue-400' : 'border-transparent'} hover:border-blue-300`}
                    onClick={() => setSelectedMood(mood.key)}
                  >
                    {typeof mood.icon === 'string' ? mood.icon : mood.icon}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="w-full mt-4 p-4 rounded-xl bg-slate-700 text-slate-100 placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={4}
              placeholder="지금 떠오르는 생각을 자유롭게 적어보세요..."
              value={memoText}
              onChange={e => setMemoText(e.target.value)}
            />
            <div className="flex items-center justify-end mt-4 space-x-2">
              <button
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                onClick={handleQuickMemoSave}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2V7m0 5v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>저장</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================= 오늘의 추천 섹션 ========================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <span>오늘의 추천</span>
          </h2>
          <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">AI 큐레이션</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {todayRecommendations.map((rec, idx) => (
            <div key={idx} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="relative h-40 overflow-hidden">
                <img src={rec.image} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>{rec.readTime}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <button className="w-8 h-8 rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center bg-white/20 text-white/80 hover:text-red-400">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-bold">{rec.score}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-2"><span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{rec.category}</span></div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rec.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{rec.desc}</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4 border border-blue-100/50 dark:border-blue-800/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Brain className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">추천 이유</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{rec.reason}</p>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl">
                  <span>지금 읽기</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ========================= 다시 보면 좋을 노트 ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2"><span>💭</span><span>다시 보면 좋을 노트</span></h2>
            <div className="space-y-4">
              {revisitNotes.map((note, idx) => (
                <div key={idx} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 relative">
                  <button className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{note.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{note.last} 노트를 잊고 계시네요</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{note.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{note.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>중요도 {note.importance}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                            <Eye className="w-4 h-4" />
                            <span>{note.related}개 연관 노트</span>
                          </div>
                        </div>
                        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2">
                          <span>다시 보기</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-blue-900 dark:text-blue-300">AI 인사이트</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">이 노트들은 모두 '성장과 도전'이라는 공통 주제로 연결되어 있어요. 시간이 지나면서 생각이 어떻게 발전하고 있는지 확인해보세요.</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">자기 개발 42%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">정보 정리 30%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">문제 해결 28%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ========================= 가치 흐름 분석 ========================= */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl mt-8">
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
        <div className="space-y-4 mb-8">
          {valueTrends.map((trend, idx) => (
            <div key={idx} className={`group cursor-pointer p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-12 h-12 bg-${trend.color}-500 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {trend.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{trend.title}</h3>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-200">
                        <PenLine className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{trend.desc}</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{trend.percent}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">비중</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">{trend.count}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">활동</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${trend.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{trend.change}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">주간 변화</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">7일 추이</div>
                    <svg width="60" height="20" className="overflow-visible">
                      <polyline points="0,20 10,15.588235294117647 20,11.176470588235293 30,8.529411764705884 40,5 50,6.764705882352942 60,5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500"></polyline>
                    </svg>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:rotate-180 duration-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-blue-900 dark:text-blue-300">가치 패턴 인사이트</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">이번 주는 자기 개발에 대한 관심이 크게 증가했어요. 특히 개념 학습 단계에서 실제 적용 단계로 넘어가려는 의지가 보입니다.</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">자기 개발 42%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">정보 정리 30%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">문제 해결 28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;