import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  User, 
  Crown, 
  Check, 
  Sparkles, 
  Link2, 
  CheckCircle, 
  Shield, 
  Bell, 
  Globe 
} from 'lucide-react';

// 향후 상태 관리를 위해 prop으로 데이터를 받을 수 있도록 컴포넌트 분리
// 예시: const PlanSummary = ({ planName, planDescription }) => ( ... );

const Settings = () => {
  // Google 로그인 훅 초기화
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google 로그인 성공:', tokenResponse);
      // TODO: 백엔드로 토큰을 보내 인증 및 연동 처리를 해야 합니다.
      alert('Google 계정 연동에 성공했습니다!');
    },
    onError: () => {
      console.error('Google 로그인 실패');
      alert('Google 계정 연동에 실패했습니다. 다시 시도해주세요.');
    },
    // scope: 'https://www.googleapis.com/auth/drive.readonly', // 필요한 scope 추가 가능
  });

  return (
    <div className="pt-16"> {/* Navbar height 만큼 padding 추가 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">설정</h1>
          <p className="text-slate-600 dark:text-slate-400">계정 및 서비스 설정을 관리하세요</p>
        </div>
        
        <div className="space-y-8">
          {/* 현재 플랜 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                  <User className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">기본 플랜</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">무료로 기본 기능을 이용 중입니다</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2">
                  <Crown className="w-4 h-4" />
                  <span>지금 업그레이드</span>
                </button>
              </div>
            </div>
          </div>

          {/* 프리미엄 업그레이드 */}
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

          {/* 외부 메모 툴 연동 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <Link2 className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">외부 메모 툴 연동</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">기존에 사용하던 메모 툴에서 데이터를 가져와 AI 분석에 활용하세요.</p>
            <div className="space-y-4">
              {/* Notion */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📝</div>
                  <div>
                    <div className="flex items-center space-x-2"><h4 className="font-medium text-slate-900 dark:text-white">Notion</h4></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">노션 페이지와 데이터베이스에서 메모를 가져옵니다.</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-xs text-slate-500 dark:text-slate-400">높은 보안</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3"><button onClick={() => handleGoogleLogin()} className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white">연결하기</button></div>
              </div>
              {/* Obsidian */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🔗</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-900 dark:text-white">Obsidian</h4>
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">PRO</span>
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">연결됨</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">옵시디언 볼트에서 마크다운 파일을 동기화합니다.</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-xs text-slate-500 dark:text-slate-400">높은 보안</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3"><button className="px-4 py-2 rounded-xl font-medium transition-colors bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50">관리하기</button></div>
              </div>
              {/* Google Keep */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📌</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-900 dark:text-white">Google Keep</h4>
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">PRO</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">구글 킵의 메모와 리스트를 가져옵니다.</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-xs text-slate-500 dark:text-slate-400">표준 보안</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3"><button onClick={() => handleGoogleLogin()} className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white">연결하기</button></div>
              </div>
              {/* Roam Research */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-900 dark:text-white">Roam Research</h4>
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">PRO</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">로암 리서치의 블록과 페이지를 연동합니다.</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-xs text-slate-500 dark:text-slate-400">높은 보안</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3"><button onClick={() => handleGoogleLogin()} className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white">연결하기</button></div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">데이터 보안</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">모든 연동 데이터는 암호화되어 저장되며, 언제든지 연결을 해제할 수 있습니다. 데이터는 AI 분석 목적으로만 사용되며 제3자와 공유되지 않습니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 프로필, 알림, 개인정보, 언어 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 프로필 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4"><User className="w-5 h-5 text-blue-500" /><h3 className="font-bold text-slate-900 dark:text-white">프로필</h3></div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">이름</label>
                  <input type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" defaultValue="사용자" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">이메일</label>
                  <input type="email" className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" defaultValue="user@example.com" />
                </div>
              </div>
            </div>
            {/* 알림 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4"><Bell className="w-5 h-5 text-green-500" /><h3 className="font-bold text-slate-900 dark:text-white">알림</h3></div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-700 dark:text-slate-300">새 추천 콘텐츠</span><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked /></label>
                <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-700 dark:text-slate-300">주간 리포트</span><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked /></label>
                <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-700 dark:text-slate-300">메모 리마인드</span><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></label>
              </div>
            </div>
            {/* 개인정보 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4"><Shield className="w-5 h-5 text-purple-500" /><h3 className="font-bold text-slate-900 dark:text-white">개인정보</h3></div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-700 dark:text-slate-300">데이터 분석 허용</span><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked /></label>
                <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-700 dark:text-slate-300">개인화 추천</span><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked /></label>
                <button className="text-red-600 dark:text-red-400 text-sm hover:underline">계정 삭제</button>
              </div>
            </div>
            {/* 언어 및 지역 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4"><Globe className="w-5 h-5 text-orange-500" /><h3 className="font-bold text-slate-900 dark:text-white">언어 및 지역</h3></div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">언어</label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option>한국어</option><option>English</option><option>日本語</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">시간대</label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option>Asia/Seoul</option><option>UTC</option><option>America/New_York</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 고객 지원 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">고객 지원</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                <div className="font-medium text-slate-900 dark:text-white text-sm mb-1">도움말 센터</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">자주 묻는 질문과 가이드</div>
              </button>
              <button className="p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                <div className="font-medium text-slate-900 dark:text-white text-sm mb-1">문의하기</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">이메일로 문의 보내기</div>
              </button>
              <button className="p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                <div className="font-medium text-slate-900 dark:text-white text-sm mb-1">피드백</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">서비스 개선 의견 보내기</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 