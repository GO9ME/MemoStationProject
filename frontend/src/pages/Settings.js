import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import UpgradeModal from '../components/UpgradeModal';
import PaymentModal from '../components/PaymentModal';
import { 
  User, 
  Crown, 
  Sparkles, 
  Link2, 
  Bell, 
  Palette,
  Lock,
  MessageSquare,
  LifeBuoy,
  FileText,
  Trash2,
  Database,
} from 'lucide-react';

// 향후 상태 관리를 위해 prop으로 데이터를 받을 수 있도록 컴포넌트 분리
// 예시: const PlanSummary = ({ planName, planDescription }) => ( ... );

const Settings = () => {
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  // Google 로그인 훅 초기화
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google 로그인 성공:', tokenResponse);
      // TODO: 백엔드로 토큰을 보내 인증 및 연동 처리를 해야 합니다.
      alert('Google 계정 연동에 성공했습니다!');
    },
    onError: (errorResponse) => {
      console.error('Login Failed:', errorResponse);
      alert('Google 계정 연동에 실패했습니다. 다시 시도해주세요.');
    },
    // scope: 'https://www.googleapis.com/auth/drive.readonly', // 필요한 scope 추가 가능
  });

  const integrations = [
    { id: 'google-drive', name: 'Google Drive', icon: Database, description: 'Google Drive에 노트를 백업하고 동기화합니다.', connected: false },
    { id: 'obsidian', name: 'Obsidian', icon: Link2, description: 'Obsidian Vault와 노트를 양방향으로 동기화합니다.', connected: true },
    { id: 'notion', name: 'Notion', icon: FileText, description: 'Notion 페이지를 노트로 가져오거나 내보냅니다.', connected: false },
  ];

  return (
    <>
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
                  <button onClick={() => setUpgradeModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2">
                    <Crown className="w-4 h-4" />
                    <span>지금 업그레이드</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 프리미엄 기능 */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full"></div>
                <div className="absolute -left-20 -bottom-24 w-60 h-60 bg-white/5 rounded-full"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white"/>
                        </div>
                        <h2 className="text-2xl font-bold">프리미엄 기능으로 업그레이드</h2>
                    </div>
                    <p className="text-purple-200 mb-6 max-w-2xl">
                        고급 AI 분석, 상세 인사이트 리포트, 외부 툴 연동 등 더 강력한 기능으로 노트 관리와 추천을 한 단계 업그레이드하세요.
                    </p>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-sm text-purple-200">월 구독</div>
                            <div className="text-3xl font-bold">₩9,900</div>
                        </div>
                        <button onClick={() => setPaymentModalOpen(true)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2">
                            <span>자세히 보기</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 연동 관리 */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">연동 관리</h2>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                  {integrations.map((item, index) => (
                    <li key={item.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                          <item.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      {item.connected ? (
                        <Link to={`/settings/integration/${item.id}`} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-medium transition-colors text-sm">
                          관리하기
                        </Link>
                      ) : (
                        <button onClick={handleGoogleLogin} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm">
                          연결하기
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 기타 설정 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">계정</h3>
                <div className="space-y-4">
                  <Link to="#" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><span>프로필 수정</span> <User className="w-4 h-4" /></Link>
                  <Link to="#" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><span>테마 변경</span> <Palette className="w-4 h-4" /></Link>
                  <Link to="#" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><span>알림 설정</span> <Bell className="w-4 h-4" /></Link>
                  <Link to="#" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><span>보안 및 개인정보</span> <Lock className="w-4 h-4" /></Link>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">기타</h3>
                <div className="space-y-4">
                  <Link to="#" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><span>피드백 보내기</span> <MessageSquare className="w-4 h-4" /></Link>
                  <Link to="#" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><span>도움말 및 지원</span> <LifeBuoy className="w-4 h-4" /></Link>
                  <Link to="#" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><span>서비스 약관</span> <FileText className="w-4 h-4" /></Link>
                  <Link to="#" className="flex items-center justify-between text-red-500 hover:text-red-600"><span>계정 삭제</span> <Trash2 className="w-4 h-4" /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} />
    </>
  );
};

export default Settings; 