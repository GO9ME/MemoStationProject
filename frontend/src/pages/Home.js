import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Brain, 
  Users, 
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  PenTool
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI 인사이트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 메인 인사이트 */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AI 인사이트</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    오늘의 생각으로부터 이런 인사이트가 도출됐습니다
                  </h1>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                실시간 분석
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                최근 3일간 '창의성'과 '도전' 키워드가 40% 증가했어요. 
                새로운 시도에 대한 열망이 커지고 있네요.
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>창의적 영감을 줄 콘텐츠를 준비했어요</span>
              </div>
            </div>
          </div>

          {/* 인사이트 통계 */}
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">창의성 메모</span>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-green-600">+40%</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">감정 강도</span>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-blue-600">85%</span>
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">연관 키워드</span>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-purple-600">12개</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 현재 목적 카드 */}
        <Link to="/explore" className="block mb-8 group">
          <div className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">현재 목적</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    📘 최근 '지식 확장'을 위한 콘텐츠 추천 중
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    2시간 전 업데이트 • 8개 콘텐츠 추천 • 3개 관련 메모
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">활발한 탐색</span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">목적 달성률 78%</div>
                <TrendingUp className="w-6 h-6 text-green-600 ml-auto mt-1" />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                목적별 맞춤 추천을 더 자세히 탐색해보세요
              </span>
              <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">탐색 메뉴로 이동</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* 빠른 메모 작성 버튼 */}
        <button className="w-full mb-8 card p-4 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-center space-x-3">
            <PenTool className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              빠른 메모 작성
            </span>
          </div>
        </button>

        {/* 오늘의 추천 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">오늘의 추천</h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              AI 큐레이션
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((item) => (
              <div key={item} className="card overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative">
                  <div className="h-32 bg-blue-500"></div>
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">8분 읽기</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-xs font-bold px-2 py-1 rounded-full">94%</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                      Memory Science
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    효과적인 기억 강화 기법
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    과학적으로 검증된 기억 강화 방법론과 일상에서 적용할 수 있는 실용적 기법들을 소개합니다.
                  </p>
                  
                  <div className="flex items-start space-x-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">추천 이유</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">최근 학습 관련 노트가 증가했어요</div>
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full flex items-center justify-center">
                    지금 읽기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 