import React, { useState } from 'react';
import { Crown, Check, X, Sparkles, Link2 } from 'lucide-react';

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

// 결제 방식 목록 정의
const paymentMethods = [
  {
    id: 'card',
    label: '신용카드/체크카드',
    desc: '비자, 마스터카드, 국내 모든 카드',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card w-6 h-6 text-slate-600 dark:text-slate-400"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
    ),
  },
  {
    id: 'kakao',
    label: '카카오페이',
    desc: '간편하고 안전한 모바일 결제',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone w-6 h-6 text-slate-600 dark:text-slate-400"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
    ),
  },
  {
    id: 'toss',
    label: '토스페이',
    desc: '토스 앱으로 간편 결제',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone w-6 h-6 text-slate-600 dark:text-slate-400"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
    ),
  },
  {
    id: 'bank',
    label: '무통장입금',
    desc: '계좌이체로 안전하게',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building w-6 h-6 text-slate-600 dark:text-slate-400"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
    ),
  },
];

const PLAN_INFO = {
  name: '팀 플랜',
  price: 99000,
  priceText: '₩99,000',
  period: '연간 결제',
  discount: '연간 결제로 17% 할인 적용됨',
};

const UpgradeModal = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState('프로 플랜');
  const [showPlanTable, setShowPlanTable] = useState(false); // 비교표 상태
  const [step, setStep] = useState(1); // 1: 플랜 선택/비교, 2: 결제 정보/결제 방식, 3: 결제 처리 중, 4: 업그레이드 완료
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [errorMsg, setErrorMsg] = useState('');

  // 결제 처리 중 타이머
  React.useEffect(() => {
    // step이 3(결제 처리 중)이면 1.5초 후 step 4(완료)로 자동 전환
    if (step === 3) {
      const timer = setTimeout(() => setStep(4), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

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

  // step1: 플랜 선택/비교, step2: 결제 정보/결제 방식, step3: 결제 처리 중, step4: 업그레이드 완료
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
          {/* step3: 결제 처리 중 */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader w-8 h-8 text-white animate-spin"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">결제 처리 중...</h2>
              <p className="text-slate-600 dark:text-slate-400">안전하게 결제를 처리하고 있습니다. 잠시만 기다려주세요.</p>
            </div>
          )}
          {/* step4: 업그레이드 완료 */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">업그레이드 완료!</h2>
              <p className="text-slate-700 dark:text-slate-200 mb-6">새로운 기능을 지금 바로 이용하실 수 있습니다.</p>
              {/* 새로 이용 가능한 기능 카드 예시 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-xl">
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                  <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-200">고급 AI 분석</div>
                    <div className="text-sm text-green-700 dark:text-green-300">더 정교한 감정 분석과 패턴 인식</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                  <Link2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-200">외부 툴 연동</div>
                    <div className="text-sm text-green-700 dark:text-green-300">노션, 옵시디언 등과 무제한 연동</div>
                  </div>
                </div>
              </div>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300" onClick={onClose}>시작하기</button>
            </div>
          )}
          {/* step2: 결제 정보/결제 방식 선택 */}
          {step === 2 && step !== 3 && step !== 4 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card w-8 h-8 text-white"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">결제 정보</h2>
                <p className="text-slate-600 dark:text-slate-400">선택하신 플랜의 결제를 진행합니다</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 mb-8 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-purple-900 dark:text-purple-300">{PLAN_INFO.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">{PLAN_INFO.priceText}</div>
                    <div className="text-sm text-purple-700 dark:text-purple-400">{PLAN_INFO.period}</div>
                  </div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-4 h-4 text-green-600 dark:text-green-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">{PLAN_INFO.discount}</span>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">결제 방법 선택</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedMethod === method.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                      onClick={() => setSelectedMethod(method.id)}
                      type="button"
                      aria-pressed={selectedMethod === method.id}
                    >
                      <div className="flex items-center space-x-3">
                        {method.icon}
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{method.label}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{method.desc}</div>
                        </div>
                        {selectedMethod === method.id && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-5 h-5 text-green-500 ml-auto"><path d="M20 6 9 17l-5-5"></path></svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {errorMsg && <div className="text-red-500 text-sm mt-2">{errorMsg}</div>}
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 mb-8">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-5 h-5 text-green-500"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white text-sm">안전한 결제</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">모든 결제 정보는 SSL로 암호화되어 안전하게 처리됩니다</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={() => setStep(1)} type="button">이전</button>
                <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300" type="button" onClick={() => setStep(3)}>결제하기</button>
              </div>
            </>
          )}
          {/* step1: 플랜 선택/비교 */}
          {step === 1 && !showPlanTable && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">플랜 업그레이드</h2>
                <p className="text-slate-600 dark:text-slate-400">더 강력한 기능으로 노트 관리와 추천을 업그레이드하세요</p>
              </div>
              <div className="flex items-center justify-center mb-8">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-1 flex">
                  <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>월간 결제</button>
                  <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>연간 결제<span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">17% 할인</span></button>
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
                <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm" onClick={() => setShowPlanTable(true)}>플랜 상세 비교하기</button>
              </div>
              <div className="flex space-x-4">
                <button onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">나중에</button>
                <button className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 border-2 ${selectedPlan === '프로 플랜' ? 'border-blue-400' : selectedPlan === '팀 플랜' ? 'border-pink-400' : 'border-transparent'}`} onClick={() => setStep(2)}>
                  {selectedPlan} 업그레이드
                </button>
              </div>
            </>
          )}
          {/* 비교표 UI */}
          {showPlanTable && step === 1 && (
            <>
              <div className="text-center mb-6">
                <button
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-sm hover:opacity-80 transition-all mb-4"
                  onClick={() => setShowPlanTable(false)}
                >
                  비교표 닫기
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-8">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">기능 상세 비교</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 text-left font-semibold">기능</th>
                      <th className="py-2 text-center font-semibold">기본</th>
                      <th className="py-2 text-center font-semibold">프로</th>
                      <th className="py-2 text-center font-semibold">팀</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 font-medium">노트 작성</td>
                      <td className="py-2 text-center">무제한</td>
                      <td className="py-2 text-center">무제한</td>
                      <td className="py-2 text-center">무제한</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 font-medium">AI 추천</td>
                      <td className="py-2 text-center">기본</td>
                      <td className="py-2 text-center">고급</td>
                      <td className="py-2 text-center">고급</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 font-medium">외부 툴 연동</td>
                      <td className="py-2 text-center">-</td>
                      <td className="py-2 text-center">✓</td>
                      <td className="py-2 text-center">✓</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 font-medium">팀 협업</td>
                      <td className="py-2 text-center">-</td>
                      <td className="py-2 text-center">-</td>
                      <td className="py-2 text-center">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">고객 지원</td>
                      <td className="py-2 text-center">이메일</td>
                      <td className="py-2 text-center">우선 지원</td>
                      <td className="py-2 text-center">24/7 전담</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex space-x-4">
                <button onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">나중에</button>
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300">팀 플랜 업그레이드</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal; 