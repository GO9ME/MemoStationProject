import React, { useState } from 'react';
import {
  Settings,
  TrendingUp,
  Shield,
  BarChart3,
  RefreshCw,
  Zap,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Target,
  RotateCcw,
  Star,
  Compass,
  Lightbulb,
  ArrowRight,
  Search,
  Eye,
  Bookmark,
  Share2,
  Brain,
  Heart,
  Clock,
} from 'lucide-react';

// 추천 전략 예시 데이터
const strategyList = [
  {
    key: 'trend',
    icon: <TrendingUp className="w-4 h-4 text-white" />, // 트렌드 추종형
    grad: 'from-blue-500 to-cyan-500',
    title: '트렌드 추종형',
    desc: '최신 인기 콘텐츠 위주로 추천',
    tags: ['최신 트렌드 우선', '인기 급상승 콘텐츠'],
  },
  {
    key: 'expert',
    icon: <Shield className="w-4 h-4 text-white" />, // 신중 검증형
    grad: 'from-emerald-500 to-teal-500',
    title: '신중 검증형',
    desc: '검증된 콘텐츠(평가 높은, 오래된 등) 위주 추천',
    tags: ['높은 완독률', '전문가 검증'],
  },
  {
    key: 'balance',
    icon: <BarChart3 className="w-4 h-4 text-white" />, // 균형형
    grad: 'from-purple-500 to-pink-500',
    title: '균형형',
    desc: '트렌드/검증 콘텐츠 균형 있게 추천',
    tags: ['다양성 보장', '균형잡힌 관점'],
  },
  {
    key: 'review',
    icon: <RefreshCw className="w-4 h-4 text-white" />, // 회고/복습형
    grad: 'from-orange-500 to-red-500',
    title: '회고/복습형',
    desc: '이전 읽은 콘텐츠와 연관된 콘텐츠 재추천',
    tags: ['연관성 중심', '복습 효과'],
  },
  {
    key: 'practical',
    icon: <Zap className="w-4 h-4 text-white" />, // 실용/즉시형
    grad: 'from-green-500 to-emerald-500',
    title: '실용/즉시형',
    desc: '실천 가능한, 실행 중심 콘텐츠 우선 추천',
    tags: ['즉시 적용 가능', '실무 중심'],
  },
];

// 추천 성향 카드 예시 데이터
const recommendCards = [
  {
    icon: <TrendingUp className="w-5 h-5 text-white" />,
    grad: 'from-blue-500 to-cyan-500',
    title: '요즘 많이 찾는 정보가 궁금할 때',
    desc: '최신 트렌드와 화제의 콘텐츠를 빠르게 파악하고 싶어요',
    tags: ['최신 기술 동향', '인기 있는 방법론', '화제의 인사이트'],
  },
  {
    icon: <BookOpen className="w-5 h-5 text-white" />,
    grad: 'from-emerald-500 to-teal-500',
    title: '검증된 깊이 있는 정보를 찾고 싶을 때',
    desc: '신뢰할 수 있고 전문적인 내용으로 깊이 있게 학습하고 싶어요',
    tags: ['학술 연구 기반', '전문가 검증', '체계적 학습'],
  },
  {
    icon: <Target className="w-5 h-5 text-white" />,
    grad: 'from-purple-500 to-pink-500',
    title: '다양한 콘텐츠를 균형 있게 보고 싶을 때',
    desc: '여러 관점과 다양한 형태의 콘텐츠를 골고루 추천받고 싶어요',
    tags: ['다각도 분석', '균형잡힌 시각', '종합적 이해'],
  },
  {
    icon: <RotateCcw className="w-5 h-5 text-white" />,
    grad: 'from-orange-500 to-red-500',
    title: '기억을 되살리거나 다시 복습하고 싶을 때',
    desc: '이전에 본 내용을 다시 보거나 관련된 내용으로 복습하고 싶어요',
    tags: ['복습 콘텐츠', '연관 내용', '기억 강화'],
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-white" />,
    grad: 'from-green-500 to-emerald-500',
    title: '지금 바로 써먹을 정보를 찾고 있을 때',
    desc: '실무에 즉시 적용할 수 있는 실용적인 정보가 필요해요',
    tags: ['실무 팁', '즉시 적용', '단계별 가이드'],
  },
];

// 추천 콘텐츠 예시 데이터
const contentCards = [
  {
    img: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Memory Science',
    title: '효과적인 기억 강화 기법',
    desc: '과학적으로 검증된 기억 강화 방법론과 일상에서 적용할 수 있는 실용적 기법들을 소개합니다.',
    reason: '최근 학습 관련 노트가 증가했어요',
    reasonDetail: '지난 주 작성하신 학습 효율성 노트와 기억력 개선 관련 검색 패턴을 분석한 결과입니다.',
    stat: { view: '12,400회', bookmark: '890저장', share: '234공유', complete: '87% 완독' },
    tag: '실용형 추천',
    tagColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    time: '8분 읽기',
    reasonType: '실용형 추천',
    reasonTypeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  {
    img: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Design Today',
    title: '2024년 주목받는 디자인 트렌드',
    desc: '올해 디자인 업계에서 가장 주목받고 있는 트렌드와 실무 적용 사례를 분석합니다.',
    reason: '디자인 관련 콘텐츠 조회가 급증하고 있어요',
    reasonDetail: '최근 1주일간 디자인 관련 콘텐츠 조회수가 340% 증가했으며, 비슷한 관심사를 가진 사용자들의 높은 만족도를 보였습니다.',
    stat: { view: '45,600회', bookmark: '2340저장', share: '567공유', complete: '92% 완독' },
    tag: '트렌드형 추천',
    tagColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    time: '12분 읽기',
    reasonType: '트렌드형 추천',
    reasonTypeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  {
    img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Philosophy & Creativity',
    title: '창의적 사고를 위한 철학적 접근',
    desc: '동서양 철학에서 찾는 창의성의 본질과 현대적 적용 방법을 추천합니다.',
    reason: '평소와 다른 관점의 콘텐츠를 추천해드려요',
    reasonDetail: '기존 관심 영역과는 다르지만, 창의성과 사고 확장에 도움이 될 수 있는 새로운 시각의 콘텐츠입니다.',
    stat: { view: '8,900회', bookmark: '456저장', share: '123공유', complete: '78% 완독' },
    tag: '미지형 추천',
    tagColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    time: '20분 읽기',
    reasonType: '미지형 추천',
    reasonTypeColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
];

const filterButtons = [
  {
    key: 'all',
    icon: <Search className="w-4 h-4" />,
    label: '전체 보기',
    desc: '모든 추천 콘텐츠를 한 번에 확인하세요',
    detail: ['개인화 알고리즘', '추천 성향', '최근 활동'],
    active: true,
    color: 'bg-blue-600 text-white',
  },
  {
    key: 'trend',
    icon: <TrendingUp className="w-4 h-4" />,
    label: '트렌드 추천',
    desc: '많은 사람들이 관심을 갖는 인기 콘텐츠',
    detail: ['조회수', '저장 수', '공유 수', '최근 급상승'],
    color: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  },
  {
    key: 'trust',
    icon: <Star className="w-4 h-4" />,
    label: '신뢰 추천',
    desc: '검증된 품질과 높은 만족도의 콘텐츠',
    detail: ['완독률', '재방문율', '높은 반응률', '전문가 추천'],
    color: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  },
  {
    key: 'unknown',
    icon: <Compass className="w-4 h-4" />,
    label: '미지의 추천',
    desc: '새로운 관점과 예상치 못한 발견을 위한 콘텐츠',
    detail: ['미추천 영역', '새로운 관점', '의외의 연결', '확장된 시야'],
    color: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  },
];

const Explore = () => {
  // 선택된 추천 전략 상태
  const [selectedStrategy, setSelectedStrategy] = useState('balance');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* 좌측 추천 전략 설정 패널 */}
        <div className="w-80 flex-shrink-0 space-y-6">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">추천 전략 설정</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">선호하는 추천 방식을 선택하여 맞춤형 콘텐츠를 받아보세요.</p>
              <div className="space-y-3">
                {strategyList.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedStrategy(item.key)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedStrategy === item.key ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${item.grad} rounded-lg flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                      </div>
                      {selectedStrategy === item.key && (
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{item.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              {/* 적용된 전략 안내 */}
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-bold text-purple-900 dark:text-purple-300">적용된 전략</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">균형형 방식으로 콘텐츠를 추천하고 있습니다.</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">트렌드와 검증 요소의 가중 평균</p>
              </div>
            </div>
          </div>
        </div>
        {/* 우측 메인 영역 */}
        <div className="flex-1 min-w-0">
          {/* 상단 타이틀/설명 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">콘텐츠 추천</h1>
            <p className="text-slate-600 dark:text-slate-400">당신의 추천 성향에 맞는 정보를 깊이 있게 추천해드립니다</p>
          </div>
          {/* 현재 추천 전략 박스 */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-8 border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">현재 추천 전략: 균형형</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-3">트렌드/검증 콘텐츠 균형 있게 추천</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">다양성 보장</span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">균형잡힌 관점</span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">종합적 큐레이션</span>
            </div>
          </div>
          {/* 추천 성향 카드 그리드 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">나의 추천 성향</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium">
                  <HelpCircle className="w-4 h-4" />
                  <span>3분 진단</span>
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400">다중 선택 가능</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendCards.map((card, idx) => (
                <button key={idx} className="p-6 rounded-2xl border-2 transition-all duration-200 text-left border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${card.grad} rounded-xl flex items-center justify-center`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm leading-tight">{card.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{card.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* 추천 필터 버튼 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filterButtons.map((btn, idx) => (
              <div key={btn.key} className="relative group">
                <button className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${btn.color} shadow-lg ${btn.active ? '' : 'hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50'}`}>
                  {btn.icon}
                  <span>{btn.label}</span>
                  <HelpCircle className="w-4 h-4 opacity-60" />
                </button>
                {/* 툴팁 */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-xl p-4 shadow-xl max-w-xs">
                    <div className="font-medium mb-2">{btn.desc}</div>
                    <div className="text-xs text-slate-300 dark:text-slate-400">
                      <div className="font-medium mb-1">추천 기준:</div>
                      <ul className="space-y-1">
                        {btn.detail.map((d, i) => (
                          <li key={i}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 추천 콘텐츠 카드 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {contentCards.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/50 transition-all duration-300 hover:scale-[1.02] group">
                {/* 이미지 및 상단 통계/태그 */}
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Heart className="w-6 h-6 text-white/80 hover:text-red-400 cursor-pointer transition-colors drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${item.tagColor}`}>
                      {item.tag === '실용형 추천' && <Lightbulb className="w-3 h-3" />}
                      {item.tag === '트렌드형 추천' && <TrendingUp className="w-3 h-3" />}
                      {item.tag === '미지형 추천' && <Compass className="w-3 h-3" />}
                      <span>{item.tag}</span>
                    </div>
                  </div>
                </div>
                {/* 카드 본문 */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{item.desc}</p>
                  {/* 추천 이유 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 mb-4 border border-blue-100/50 dark:border-blue-800/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">추천 이유</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">{item.reason}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.reasonDetail}</p>
                  </div>
                  {/* 통계 */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <Eye className="w-3 h-3" />
                      <span>{item.stat.view}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <Bookmark className="w-3 h-3" />
                      <span>{item.stat.bookmark}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <Share2 className="w-3 h-3" />
                      <span>{item.stat.share}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>{item.stat.complete}</span>
                    </div>
                  </div>
                  {/* 읽기 버튼 */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl">
                    <span>지금 읽어보기</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* 이전 추천 콘텐츠 보기 버튼 */}
          <div className="text-center">
            <button className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-medium transition-colors border border-slate-200/50 dark:border-slate-700/50">
              <RotateCcw className="w-5 h-5" />
              <span>이전 추천 콘텐츠 보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore; 