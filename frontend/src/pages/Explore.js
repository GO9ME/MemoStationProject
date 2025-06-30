import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  TrendingUp, 
  Lightbulb, 
  BookOpen, 
  Target, 
  Zap, 
  Clock, 
  Star, 
  ArrowRight,
  Filter,
  Brain,
  Users,
  Eye
} from 'lucide-react';

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGoal, setSelectedGoal] = useState('knowledge-expansion');

  // 현재 목적
  const currentGoal = {
    id: 'knowledge-expansion',
    title: '📘 지식 확장',
    description: '새로운 분야의 지식을 습득하고 기존 지식과 연결하기',
    progress: 78,
    status: '활발한 탐색',
    lastUpdate: '2시간 전',
    recommendations: 8,
    relatedNotes: 3
  };

  // AI 추천 콘텐츠
  const recommendations = [
    {
      id: 1,
      title: '효과적인 기억 강화 기법',
      category: 'Memory Science',
      description: '과학적으로 검증된 기억 강화 방법론과 일상에서 적용할 수 있는 실용적 기법들을 소개합니다.',
      readTime: 8,
      accuracy: 94,
      reason: '최근 학습 관련 노트가 증가했어요',
      tags: ['학습', '기억법', '인지과학'],
      difficulty: 'intermediate',
      popularity: 4.8,
      views: '2.1K'
    },
    {
      id: 2,
      title: '창의적 문제 해결 사고법',
      category: 'Creative Thinking',
      description: '막힌 상황에서 새로운 관점을 찾고 창의적 해결책을 도출하는 체계적 방법론입니다.',
      readTime: 12,
      accuracy: 89,
      reason: '문제 해결 관련 고민이 자주 나타나고 있어요',
      tags: ['창의성', '문제해결', '디자인씽킹'],
      difficulty: 'advanced',
      popularity: 4.6,
      views: '1.8K'
    },
    {
      id: 3,
      title: '마음챙김을 통한 감정 정리법',
      category: 'Mindful Living',
      description: '복잡한 감정을 차분히 들여다보고 정리하는 마음챙김 기반 접근법을 다룹니다.',
      readTime: 10,
      accuracy: 87,
      reason: '본질적 가치 정리 욕구가 보여요',
      tags: ['마음챙김', '감정', '웰빙'],
      difficulty: 'beginner',
      popularity: 4.9,
      views: '3.2K'
    },
    {
      id: 4,
      title: '시스템 사고와 복잡성 이해',
      category: 'Systems Thinking',
      description: '복잡한 시스템을 이해하고 분석하는 사고 프레임워크와 실제 적용 사례들을 다룹니다.',
      readTime: 15,
      accuracy: 91,
      reason: '체계적 사고에 대한 관심이 높아지고 있어요',
      tags: ['시스템사고', '복잡성', '분석'],
      difficulty: 'advanced',
      popularity: 4.4,
      views: '1.2K'
    },
    {
      id: 5,
      title: '효과적인 습관 형성 과학',
      category: 'Behavior Science',
      description: '신경과학과 행동심리학을 바탕으로 한 지속 가능한 습관 형성 전략을 소개합니다.',
      readTime: 9,
      accuracy: 93,
      reason: '개인 성장 관련 노트 패턴 발견',
      tags: ['습관', '행동과학', '자기계발'],
      difficulty: 'intermediate',
      popularity: 4.7,
      views: '2.5K'
    },
    {
      id: 6,
      title: '데이터 리터러시 기초',
      category: 'Data Science',
      description: '현대 사회에서 필수적인 데이터를 읽고 해석하는 능력을 기르는 방법을 다룹니다.',
      readTime: 11,
      accuracy: 85,
      reason: '분석적 사고 능력 향상 니즈 감지',
      tags: ['데이터', '분석', '리터러시'],
      difficulty: 'beginner',
      popularity: 4.5,
      views: '1.9K'
    }
  ];

  // 카테고리
  const categories = [
    { key: 'all', label: '전체', count: recommendations.length },
    { key: 'trending', label: '인기', count: 4 },
    { key: 'recent', label: '최신', count: 3 },
    { key: 'personal', label: '맞춤', count: 5 }
  ];

  // 목적별 설정
  const goals = [
    { key: 'knowledge-expansion', label: '📘 지식 확장', progress: 78 },
    { key: 'skill-development', label: '🔧 스킬 개발', progress: 65 },
    { key: 'creative-thinking', label: '💡 창의적 사고', progress: 82 },
    { key: 'problem-solving', label: '🎯 문제 해결', progress: 71 }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '기타';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center space-x-3 mb-8">
          <Search className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">추천 탐색</h1>
            <p className="text-gray-600 dark:text-gray-400">AI가 분석한 맞춤형 콘텐츠를 발견하세요</p>
          </div>
        </div>

        {/* 현재 목적 카드 */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">현재 목적</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentGoal.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{currentGoal.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">{currentGoal.status}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentGoal.progress}%
              </div>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${currentGoal.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{currentGoal.lastUpdate} 업데이트 • {currentGoal.recommendations}개 콘텐츠 추천 • {currentGoal.relatedNotes}개 관련 메모</span>
            <div className="flex items-center space-x-4">
              {goals.map((goal) => (
                <button
                  key={goal.key}
                  onClick={() => setSelectedGoal(goal.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedGoal === goal.key
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {goal.label} {goal.progress}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 필터 및 카테고리 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.key
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{category.label}</span>
                <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 ml-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select className="bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white">
              <option>추천 순위순</option>
              <option>최신순</option>
              <option>인기순</option>
              <option>난이도순</option>
            </select>
          </div>
        </div>

        {/* AI 인사이트 */}
        <div className="card p-4 mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">AI 큐레이션 인사이트</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                최근 활동 패턴을 분석한 결과, 실용적 학습법과 창의적 사고에 대한 관심이 높아지고 있습니다. 
                오늘 추천된 콘텐츠들은 이러한 관심사를 반영하여 선별되었습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 추천 콘텐츠 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <div key={item.id} className="card overflow-hidden hover:shadow-md transition-shadow group">
              {/* 콘텐츠 헤더 */}
              <div className="relative">
                <div className="h-32 bg-blue-500"></div>
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">{item.readTime}분 읽기</span>
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  <span className="bg-white/90 text-xs font-bold px-2 py-1 rounded-full">
                    {item.accuracy}%
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                    {getDifficultyLabel(item.difficulty)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                {/* 카테고리 */}
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                {/* 제목 및 설명 */}
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {item.description}
                </p>
                
                {/* 태그 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* 추천 이유 */}
                <div className="flex items-start space-x-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-gray-900 dark:text-white">추천 이유</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.reason}</div>
                  </div>
                </div>
                
                {/* 통계 */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{item.popularity}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                </div>
                
                {/* 액션 버튼 */}
                <button className="btn-primary w-full flex items-center justify-center">
                  지금 읽기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 더 많은 추천 */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            더 많은 추천 보기
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore; 