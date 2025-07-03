import React, { useState } from 'react';
import { Brain, Lightbulb, BookOpen, ArrowRight, PenLine, AlertCircle, Target, Heart, Eye, Clock, Play, TrendingUp, Compass, Zap, BarChart3, ChevronDown, Link2, Sparkles, Check, Crown, Calendar, Tag, CheckCircle, Award, HelpCircle } from 'lucide-react';

const StrategyContent = () => {
  const [showReasonModal, setShowReasonModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-8 h-8"/>
            <h1 className="text-3xl font-bold">실행 전략 콘텐츠</h1>
          </div>
          <p className="text-xl text-green-100 mb-6">당신의 현재 노트 흐름과 목표를 기반으로 큐레이션된 콘텐츠입니다.</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Brain className="w-6 h-6"/>
              <span className="text-lg font-semibold">AI 분석 결과</span>
            </div>
            <p className="text-green-100">최근 7일간 실행과 관련된 노트가 40% 증가했으며, 특히 '계획 수립'에서 '실제 적용' 단계로의 전환 의지가 강하게 감지됩니다.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800" alt="실행력을 높이는 3단계 시스템" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Clock className="w-4 h-4"/>
                <span>12분 읽기</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">실행 전략</div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-3"><span className="text-sm text-green-600 dark:text-green-400 font-medium">Productivity Weekly</span></div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">실행력을 높이는 3단계 시스템</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">계획 수립부터 실제 실행까지, 체계적인 접근법으로 실행력을 극대화하는 방법을 단계별로 제시합니다. 실무에서 바로 적용할 수 있는 구체적인 도구와 템플릿을 포함합니다.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#실행루틴</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#체계적접근</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#실무적용</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4 border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400"/>
                <span className="text-sm font-bold text-green-900 dark:text-green-300">추천 이유</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">최근 실행 관련 노트 증가 패턴과 일치</p>
            </div>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl">
              <span>지금 읽기</span>
              <Link2 className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800" alt="결정 장애를 극복하는 실용적 방법론" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Clock className="w-4 h-4"/>
                <span>8분 읽기</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">실행 전략</div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-3"><span className="text-sm text-green-600 dark:text-green-400 font-medium">Decision Science</span></div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">결정 장애를 극복하는 실용적 방법론</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">복잡한 선택 상황에서 빠르고 정확한 결정을 내리는 프레임워크를 소개합니다. 일상과 업무에서 즉시 활용할 수 있는 결정 도구들을 제공합니다.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#결정장애해결</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#선택프레임워크</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#즉시적용</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4 border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400"/>
                <span className="text-sm font-bold text-green-900 dark:text-green-300">추천 이유</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">선택과 결정 관련 고민 노트와 연관성 높음</p>
            </div>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl">
              <span>지금 읽기</span>
              <Link2 className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800" alt="습관 형성의 과학적 접근법" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Clock className="w-4 h-4"/>
                <span>15분 읽기</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">실행 전략</div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-3"><span className="text-sm text-green-600 dark:text-green-400 font-medium">Habit Research</span></div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">습관 형성의 과학적 접근법</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">뇌과학 연구를 바탕으로 한 효과적인 습관 형성 전략을 다룹니다. 21일 법칙을 넘어선 실제로 작동하는 습관 설계 방법을 제시합니다.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#습관형성</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#과학적근거</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#장기지속</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4 border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400"/>
                <span className="text-sm font-bold text-green-900 dark:text-green-300">추천 이유</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">지속성과 루틴 관련 관심사 반영</p>
            </div>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl">
              <span>지금 읽기</span>
              <Link2 className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
          <div className="relative h-48 overflow-hidden">
            <img src="https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800" alt="미루는 습관을 끊는 즉시 실행법" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Clock className="w-4 h-4"/>
                <span>10분 읽기</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">실행 전략</div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-3"><span className="text-sm text-green-600 dark:text-green-400 font-medium">Action Today</span></div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">미루는 습관을 끊는 즉시 실행법</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">미루기의 심리적 원인을 분석하고, 즉시 행동으로 전환할 수 있는 구체적인 기법들을 소개합니다. 2분 룰부터 포모도로 기법까지 다양한 실행 도구를 다룹니다.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#미루기극복</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#즉시실행</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">#행동전환</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4 border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400"/>
                <span className="text-sm font-bold text-green-900 dark:text-green-300">추천 이유</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">실행 지연 관련 노트 패턴 분석 결과</p>
            </div>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl">
              <span>지금 읽기</span>
              <Link2 className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-medium transition-colors border border-slate-200/50 dark:border-slate-700/50"
          onClick={() => setShowReasonModal(true)}
        >
          <HelpCircle className="w-5 h-5"/>
          <span>추천 콘텐츠 이유 보기</span>
        </button>
      </div>

      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">추천 로직 및 근거</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowReasonModal(false)}>✕</button>
            </div>
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-5 h-5 text-green-600 dark:text-green-400"/>
                  <span className="font-bold text-green-900 dark:text-green-300">AI 분석 기준</span>
                </div>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                  <li>• 최근 7일간 노트 작성 패턴 분석</li>
                  <li>• '실행', '적용', '실천' 키워드 빈도 증가 (40%↑)</li>
                  <li>• 이론 학습에서 실무 적용으로의 관심 전환 감지</li>
                  <li>• 유사 사용자 그룹의 성공적 콘텐츠 소비 패턴</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                  <span className="font-bold text-blue-900 dark:text-blue-300">개인화 요소</span>
                </div>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                  <li>• 선호하는 콘텐츠 길이: 8-15분 (중간 길이)</li>
                  <li>• 관심 영역: 생산성, 습관 형성, 의사결정</li>
                  <li>• 학습 스타일: 체계적 접근법 선호</li>
                  <li>• 실행 성향: 단계별 가이드 선호</li>
                </ul>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                  <span className="font-bold text-purple-900 dark:text-purple-300">추천 정확도</span>
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-400">
                  <p className="mb-2">현재 추천 시스템 정확도: <span className="font-bold">87%</span></p>
                  <p>유사 프로필 사용자 만족도: <span className="font-bold">92%</span></p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors" onClick={() => setShowReasonModal(false)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyContent; 