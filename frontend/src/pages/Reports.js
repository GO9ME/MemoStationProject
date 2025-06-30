import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  PieChart, 
  Activity, 
  Target, 
  Trophy, 
  Lightbulb,
  Brain,
  Zap,
  Clock,
  Users,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  // 시간대별 필터
  const periods = [
    { key: 'week', label: '1주일' },
    { key: 'month', label: '1개월' },
    { key: '3months', label: '3개월' },
    { key: 'year', label: '1년' }
  ];

  // 카테고리 필터
  const categories = [
    { key: 'overall', label: '전체 분석' },
    { key: 'learning', label: '학습 패턴' },
    { key: 'creativity', label: '창의성' },
    { key: 'productivity', label: '생산성' }
  ];

  // 주요 지표 데이터
  const keyMetrics = [
    {
      title: '메모 생성량',
      value: '47개',
      change: '+23%',
      trend: 'up',
      description: '지난달 대비 증가',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: '창의성 지수',
      value: '78점',
      change: '+12%',
      trend: 'up',
      description: '새로운 아이디어 연결성',
      icon: Lightbulb,
      color: 'yellow'
    },
    {
      title: '학습 활동',
      value: '156시간',
      change: '+34%',
      trend: 'up',
      description: '집중 학습 시간',
      icon: Brain,
      color: 'green'
    },
    {
      title: '목표 달성율',
      value: '84%',
      change: '-5%',
      trend: 'down',
      description: '설정한 목표 완료율',
      icon: Target,
      color: 'red'
    }
  ];

  // 가치 흐름 분석
  const valueFlowData = [
    {
      category: '지식 흡수',
      currentWeek: 89,
      lastWeek: 76,
      items: [
        { name: '새로운 개념 이해', score: 92 },
        { name: '기존 지식과 연결', score: 85 },
        { name: '실무 적용 가능성', score: 91 }
      ]
    },
    {
      category: '창의적 사고',
      currentWeek: 76,
      lastWeek: 82,
      items: [
        { name: '독창적 아이디어', score: 78 },
        { name: '문제 해결 관점', score: 74 },
        { name: '새로운 연결 발견', score: 76 }
      ]
    },
    {
      category: '실행력',
      currentWeek: 71,
      lastWeek: 68,
      items: [
        { name: '계획 수립', score: 75 },
        { name: '단계별 실행', score: 68 },
        { name: '결과 달성', score: 70 }
      ]
    },
    {
      category: '성찰과 개선',
      currentWeek: 83,
      lastWeek: 79,
      items: [
        { name: '자기 분석', score: 86 },
        { name: '개선 방향 설정', score: 81 },
        { name: '지속적 모니터링', score: 82 }
      ]
    }
  ];

  // 성장 트렌드 데이터
  const growthTrends = [
    { period: '1주차', value: 65, notes: 8 },
    { period: '2주차', value: 72, notes: 12 },
    { period: '3주차', value: 68, notes: 9 },
    { period: '4주차', value: 84, notes: 18 }
  ];

  // 주제별 분석
  const topicAnalysis = [
    { topic: '학습 방법론', percentage: 32, notes: 15, growth: '+18%' },
    { topic: '창의적 문제해결', percentage: 24, notes: 11, growth: '+24%' },
    { topic: '개인 성장', percentage: 18, notes: 8, growth: '+12%' },
    { topic: '마음챙김', percentage: 15, notes: 7, growth: '+8%' },
    { topic: '시스템 사고', percentage: 11, notes: 6, growth: '+15%' }
  ];

  // AI 인사이트
  const aiInsights = [
    {
      type: 'pattern',
      title: '학습 패턴 발견',
      content: '오후 2-4시 사이에 가장 창의적인 아이디어가 많이 생성됩니다. 이 시간대에 브레인스토밍을 집중하는 것을 추천합니다.',
      confidence: 87,
      actionable: true
    },
    {
      type: 'growth',
      title: '성장 가속화 포인트',
      content: '실행력 부문에서 개선의 여지가 있습니다. 작은 단위로 계획을 나누고 즉시 실행하는 습관을 만들어보세요.',
      confidence: 82,
      actionable: true
    },
    {
      type: 'connection',
      title: '지식 연결성 강화',
      content: '최근 메모들 사이의 연관성이 증가하고 있습니다. 서로 다른 주제를 연결하는 능력이 향상되고 있어요.',
      confidence: 91,
      actionable: false
    }
  ];

  const getMetricColor = (color) => {
    const colors = {
      blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      yellow: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
      green: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      red: 'text-red-500 bg-red-100 dark:bg-red-900/30'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">분석 리포트</h1>
              <p className="text-gray-600 dark:text-gray-400">성장 패턴과 학습 인사이트를 확인하세요</p>
            </div>
          </div>
          
          {/* 필터 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-3 py-2 text-sm"
              >
                {periods.map(period => (
                  <option key={period.key} value={period.key}>{period.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-3 py-2 text-sm"
              >
                {categories.map(category => (
                  <option key={category.key} value={category.key}>{category.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMetricColor(metric.color)}`}>
                    <IconComponent className={`w-6 h-6 ${metric.color === 'blue' ? 'text-blue-500' : 
                      metric.color === 'yellow' ? 'text-yellow-500' : 
                      metric.color === 'green' ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{metric.change}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {metric.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {metric.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 가치 흐름 분석 */}
        <div className="card p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">가치 흐름 분석</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">주요 역량 변화 추적</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {valueFlowData.map((category, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">{category.category}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.currentWeek}
                    </span>
                    <div className={`text-sm font-medium ${
                      category.currentWeek > category.lastWeek ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.currentWeek > category.lastWeek ? '+' : ''}
                      {category.currentWeek - category.lastWeek}점
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${category.currentWeek}%` }}
                  ></div>
                </div>
                
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.score}점</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 성장 트렌드 & 주제별 분석 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 성장 트렌드 */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">성장 트렌드</h2>
            </div>
            
            <div className="space-y-4">
              {growthTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{trend.period}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${trend.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {trend.value}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                      {trend.notes}개 메모
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 주제별 분석 */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">주제별 분석</h2>
            </div>
            
            <div className="space-y-4">
              {topicAnalysis.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {topic.topic}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {topic.notes}개
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          {topic.growth}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${topic.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI 인사이트 */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI 인사이트</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">패턴 분석 및 개선 제안</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {insight.type === 'pattern' && <Activity className="w-4 h-4 text-indigo-600" />}
                    {insight.type === 'growth' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {insight.type === 'connection' && <Zap className="w-4 h-4 text-yellow-600" />}
                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      {insight.type === 'pattern' ? '패턴 발견' : 
                       insight.type === 'growth' ? '성장 기회' : '연결성 분석'}
                    </span>
                  </div>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
                    {insight.confidence}%
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {insight.title}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {insight.content}
                </p>
                
                {insight.actionable && (
                  <button className="w-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800 dark:hover:bg-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                    실행 계획 세우기
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 