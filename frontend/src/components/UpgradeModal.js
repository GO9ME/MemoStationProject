import React, { useState } from 'react';
import { Crown, Check, X } from 'lucide-react';

const PlanCard = ({ plan, currentPlan, selectedPlan, onSelect }) => {
  const isCurrent = plan.name === currentPlan;
  const isSelected = plan.name === selectedPlan;

  let cardClasses = "relative p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ";
  if (isSelected) {
    cardClasses += "border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500 ring-opacity-20";
  } else {
    cardClasses += "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600";
  }

  return (
    <div className={cardClasses} onClick={() => onSelect(plan.name)}>
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">현재 이용 중</span>
        </div>
      )}
       {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full">가장 인기</span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{plan.description}</p>
        <div className="mb-4">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{plan.price.monthly}</div>
          {plan.price.yearly && <div className="text-sm text-slate-500 dark:text-slate-400">월 (연간 결제)</div>}
          {plan.price.discount && <div className="text-xs text-green-600 dark:text-green-400 mt-1">{plan.price.discount}</div>}
        </div>
      </div>
      <div className="space-y-3">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
          </div>
        ))}
      </div>
      {isSelected && (
        <div className="mt-6">
            <div className="w-full bg-purple-600 text-white py-3 rounded-xl text-center font-medium">선택됨</div>
        </div>
      )}
    </div>
  );
};


const UpgradeModal = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState('프로 플랜');

  if (!isOpen) return null;

  const plans = {
    monthly: [
        { name: '기본 플랜', description: '개인 사용자를 위한 기본 기능', price: { monthly: '무료' }, features: ['노트 작성 무제한', '기본 AI 추천', '태그 및 검색', '기본 리포트', '모바일 앱 사용'] },
        { name: '프로 플랜', popular: true, description: '전문가를 위한 고급 기능', price: { monthly: '₩4,900' }, features: ['모든 기본 플랜 기능', '고급 AI 분석 및 추천', '상세 인사이트 리포트', '노트 연결 추천', '맞춤형 템플릿', '외부 툴 연동 (노션, 옵시디언)', '우선 고객 지원', '데이터 내보내기', '고급 검색 필터'] },
        { name: '팀 플랜', description: '팀과 조직을 위한 협업 기능', price: { monthly: '₩9,900' }, features: ['모든 프로 플랜 기능', '팀 워크스페이스', '노트 공유 및 협업', '팀 인사이트 대시보드', '관리자 권한 설정', '팀 활동 분석', '무제한 게스트 초대', '24/7 전담 지원', 'SSO 연동'] },
    ],
    yearly: [
        { name: '기본 플랜', description: '개인 사용자를 위한 기본 기능', price: { monthly: '무료' }, features: ['노트 작성 무제한', '기본 AI 추천', '태그 및 검색', '기본 리포트', '모바일 앱 사용'] },
        { name: '프로 플랜', popular: true, description: '전문가를 위한 고급 기능', price: { monthly: '₩4,083', yearly: '월 (연간 결제)', discount: '연간 ₩49,000 (17% 할인)' }, features: ['모든 기본 플랜 기능', '고급 AI 분석 및 추천', '상세 인사이트 리포트', '노트 연결 추천', '맞춤형 템플릿', '외부 툴 연동 (노션, 옵시디언)', '우선 고객 지원', '데이터 내보내기', '고급 검색 필터'] },
        { name: '팀 플랜', description: '팀과 조직을 위한 협업 기능', price: { monthly: '₩8,250', yearly: '월 (연간 결제)', discount: '연간 ₩99,000 (17% 할인)' }, features: ['모든 프로 플랜 기능', '팀 워크스페이스', '노트 공유 및 협업', '팀 인사이트 대시보드', '관리자 권한 설정', '팀 활동 분석', '무제한 게스트 초대', '24/7 전담 지원', 'SSO 연동'] },
    ]
  };
  
  const currentBillingPlans = plans[billingCycle];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-purple-500" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">플랜 업그레이드</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">플랜 업그레이드</h2>
            <p className="text-slate-600 dark:text-slate-400">더 강력한 기능으로 노트 관리와 추천을 업그레이드하세요</p>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-1 flex">
              <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>
                월간 결제
              </button>
              <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>
                연간 결제
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">17% 할인</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {currentBillingPlans.map(plan => (
              <PlanCard 
                key={plan.name}
                plan={plan}
                currentPlan="기본 플랜"
                selectedPlan={selectedPlan}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm">
              플랜 상세 비교하기
            </button>
          </div>

          <div className="flex space-x-4">
            <button onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              나중에
            </button>
            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300">
              {selectedPlan} 업그레이드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal; 