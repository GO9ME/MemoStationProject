import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark, Brain, Calendar, Link2, Users, Tag, Star, PenLine, Copy, Plus, BarChart3, Zap, Lightbulb, Target, BookOpen, ChevronDown, CheckCircle, Heart, Compass } from 'lucide-react';

// 예시 데이터 (실제 noteList와 동일 구조)
const noteList = [
  {
    id: 1,
    emoji: '🤔',
    title: 'Design System Thoughts',
    value: '자기 개발',
    valueColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    ai: true,
    aiColor: 'bg-purple-100 text-purple-700',
    review: '기억 선명',
    reviewColor: 'bg-green-100 text-green-700',
    desc: '현대적 디자인 시스템에서 일관성과 창의성의 균형을 추천하며, 사용자 경험의 예측 가능성과 혁신 사이의 적절한 지점을 찾아보았다...',
    tags: ['#디자인', '#시스템', '#UX'],
    connections: 5,
    time: '2시간 전',
    stars: 4,
    progress: 80,
    content: `현대적 디자인 시스템에서 <mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">일관성</mark>과 <mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">창의성</mark>의 <mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">균형</mark>을 추천하며, <mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">사용자 경험</mark>의 <mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">예측 가능성</mark>과 <mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">혁신</mark> 사이의 적절한 지점을 찾아보았다...\n\n이것은 노트의 전체 내용입니다. 실제로는 사용자가 작성한 전체 텍스트가 여기에 표시됩니다.\n\n첫 번째 단락에서는 주요 개념을 소개하고, 두 번째 단락에서는 구체적인 방법론을 설명합니다.\n\n마지막으로 실제 적용 사례와 함께 마무리합니다.`
  },
];

const relatedNotes = [
  {
    emoji: '💡',
    title: '창의성 향상 방법론',
    badge: '키워드 연결',
    badgeColor: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    time: '3일 전',
    percent: 94,
    percentColor: 'text-purple-600 dark:text-purple-400',
    desc: '창의적 사고를 기르기 위한 체계적 접근법과 일상 습관들...',
    match: '창의성, 사고법 키워드 일치',
    matchIcon: <Compass className="w-3 h-3" />,
    matchText: '창의성, 사고법 키워드 일치',
    badgeType: '키워드 연결',
  },
  {
    emoji: '🎯',
    title: '디자인 시스템 구축 경험',
    badge: '가치 연결',
    badgeColor: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    time: '7일 전',
    percent: 87,
    percentColor: 'text-purple-600 dark:text-purple-400',
    desc: '실무에서 디자인 시스템을 구축하며 겪은 시행착오와 교훈들...',
    match: '자기 개발 가치 연결',
    matchIcon: <Heart className="w-3 h-3" />,
    matchText: '자기 개발 가치 연결',
    badgeType: '가치 연결',
  },
  {
    emoji: '📚',
    title: '효율적 학습 루틴',
    badge: '주제 연결',
    badgeColor: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
    time: '5일 전',
    percent: 82,
    percentColor: 'text-purple-600 dark:text-purple-400',
    desc: '지속 가능한 학습 습관을 만들기 위한 개인적 실험과 결과...',
    match: '성장 주제 연관성',
    matchIcon: <Compass className="w-3 h-3" />,
    matchText: '성장 주제 연관성',
    badgeType: '주제 연결',
  },
];

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = noteList.find(n => String(n.id) === String(id));

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center text-slate-500 dark:text-slate-400">노트를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={()=>navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
              <span>돌아가기</span>
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"><Share2 className="w-5 h-5" /></button>
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"><Bookmark className="w-5 h-5" /></button>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                <span>{note.emoji}</span>
                <span>{note.value}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 본문 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 노트 내용 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 노트 카드 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{note.emoji}</span>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">{note.value}</div>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{note.title}</h1>
                  <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{note.time}</span></div>
                    <div className="flex items-center space-x-2"><Link2 className="w-4 h-4" /><span>{note.connections}개 연결</span></div>
                    <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>3개 관련 노트</span></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {note.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"><Tag className="w-3 h-3" /><span>{tag}</span></span>
                    ))}
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2"><Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" /><span className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide">AI 요약</span></div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: note.content}} />
                  </div>
                </div>
                {/* 평가 */}
                <div className="ml-8 text-center">
                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI 평가</div>
                    <div className="flex items-center space-x-1 justify-center">
                      {[...Array(5)].map((_,i)=>(<Star key={i} className={`w-4 h-4 ${i<note.stars?'fill-yellow-400 text-yellow-400':'text-slate-300 dark:text-slate-600'}`} />))}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{note.stars}/5</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">내 평가</div>
                    <div className="flex items-center space-x-1 justify-center">
                      {[...Array(5)].map((_,i)=>(<button key={i} className="w-4 h-4 transition-colors text-slate-300 dark:text-slate-600 hover:text-blue-400"><Star className="w-4 h-4" /></button>))}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">평가하기</div>
                  </div>
                </div>
              </div>
            </div>
            {/* 노트 내용 섹션 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">노트 내용</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"><PenLine className="w-4 h-4" /><span>수정</span></button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"><Copy className="w-4 h-4" /><span>복사</span></button>
                </div>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap cursor-text" dangerouslySetInnerHTML={{__html: note.content}} />
              </div>
            </div>
            {/* 연결된 생각들 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3"><Link2 className="w-6 h-6 text-purple-500" /><h2 className="text-2xl font-bold text-slate-900 dark:text-white">연결된 생각들</h2></div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">3개 연관 노트</span>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"><Plus className="w-4 h-4" /><span>더 연결하기</span></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNotes.map((rel, idx) => (
                  <div key={idx} className="group cursor-pointer p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{rel.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{rel.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${rel.badgeColor}`}>{rel.badge}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{rel.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${rel.percentColor}`}>{rel.percent}%</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">연관도</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{rel.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        {rel.matchIcon}
                        <span>{rel.matchText}</span>
                      </div>
                      <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">바로가기 →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 다음에 할 수 있는 행동 */}
            <div className="mt-12 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">다음에 할 수 있는 행동</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                  <PenLine className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">업데이트된 노트로 다시 쓰기</h3>
                  <p className="text-sm text-purple-100">현재 생각을 반영하여 노트를 업데이트해보세요</p>
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                  <BookOpen className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">이 노트를 기반으로 콘텐츠 추천 받기</h3>
                  <p className="text-sm text-purple-100">관련된 새로운 콘텐츠를 추천받아 지식을 확장해보세요</p>
                </button>
              </div>
            </div>
          </div>
          {/* 우측 사이드바 예시 (AI 분석 등) */}
          <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2"><Brain className="w-5 h-5 text-blue-500" /><h3 className="font-bold text-slate-900 dark:text-white">AI 분석</h3></div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">핵심 키워드</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">일관성</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">창의성</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">균형</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">사용자 경험</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">예측 가능성</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">혁신</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">연관 주제</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>생산성</span></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>학습</span></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>성장</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">제안 행동</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" /><span>실행 계획 수립하기</span></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" /><span>관련 콘텐츠 탐색하기</span></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2"><CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" /><span>후속 노트 작성하기</span></div>
                  </div>
                </div>
              </div>
            </div>
            {/* 기타 사이드바 위젯 예시 필요시 추가 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2"><BarChart3 className="w-5 h-5 text-green-500" /><h3 className="font-bold text-slate-900 dark:text-white">가치 흐름</h3></div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center space-x-2 mb-4"><Zap className="w-5 h-5 text-green-600 dark:text-green-400" /><h3 className="font-bold text-green-900 dark:text-green-300">실행 제안</h3></div>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-white/70 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left"><div className="flex items-center space-x-3"><Target className="w-4 h-4 text-green-600 dark:text-green-400" /><span className="text-sm font-medium text-slate-900 dark:text-white">실천 계획 작성</span></div></button>
                  <button className="w-full p-3 bg-white/70 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left"><div className="flex items-center space-x-3"><BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" /><span className="text-sm font-medium text-slate-900 dark:text-white">루틴화 제안</span></div></button>
                  <button className="w-full p-3 bg-white/70 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left"><div className="flex items-center space-x-3"><Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400" /><span className="text-sm font-medium text-slate-900 dark:text-white">추천 노트 보기</span></div></button>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl mt-4"><Target className="w-5 h-5" /><span>실천 계획으로 전환하기</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail; 