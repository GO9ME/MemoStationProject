import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  User, 
  Crown, 
  Sparkles, 
  Link2, 
  Bell, 
  Check,
  CheckCircle,
  Shield,
  Globe,
  PenLine,
  Brain,
  MessageCircle,
  X,
  Plus,
} from 'lucide-react';

// 향후 상태 관리를 위해 prop으로 데이터를 받을 수 있도록 컴포넌트 분리
// 예시: const PlanSummary = ({ planName, planDescription }) => ( ... );

// const NOTION_TOKEN = process.env.REACT_APP_NOTION_TOKEN;
// const NOTION_DATABASE_ID = process.env.REACT_APP_NOTION_DATABASE_ID;

const NOTION_PROXY_URL = 'http://localhost:8000/api/notion';

// Notion 페이지에서 제목 속성을 자동으로 추출하는 함수
function getNotionPageTitle(page) {
  if (!page.properties) return "(제목 없음)";
  const titleProp = Object.values(page.properties).find(
    prop => prop.type === "title"
  );
  if (
    titleProp &&
    titleProp.title &&
    titleProp.title.length > 0 &&
    titleProp.title[0].plain_text
  ) {
    return titleProp.title[0].plain_text;
  }
  return "(제목 없음)";
}

const Settings = () => {
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  // 프리미엄 구독 팝업 상태
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // 노션 메모 목록 상태
  const [notionPages, setNotionPages] = useState([]);
  const [notionLoading, setNotionLoading] = useState(false);
  const [notionError, setNotionError] = useState(null);
  // 노션 메모 저장 상태
  const [saveMessage, setSaveMessage] = useState("");

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

  // Notion에서 메모(페이지) 목록 가져오기 (프록시 서버 사용)
  const fetchNotionPages = async () => {
    setNotionLoading(true);
    setNotionError(null);
    try {
      const res = await fetch(NOTION_PROXY_URL, {
        method: "POST"
      });
      const data = await res.json();
      if (data.results) {
        setNotionPages(data.results);
      } else {
        setNotionPages([]);
        setNotionError(data.message || "데이터를 불러올 수 없습니다.");
      }
    } catch (err) {
      setNotionError("노션 API 오류: " + err.message);
    } finally {
      setNotionLoading(false);
    }
  };

  // 노션 메모를 백엔드에 저장하는 함수
  const saveNotionPages = async () => {
    setSaveMessage("");
    try {
      const res = await fetch('http://localhost:8000/api/notion-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notionPages)
      });
      const result = await res.json();
      if (result.success) {
        setSaveMessage("노션 메모가 성공적으로 저장되었습니다.");
      } else {
        setSaveMessage("저장 실패: " + (result.error || "알 수 없는 오류"));
      }
    } catch (err) {
      setSaveMessage("저장 중 오류 발생: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">설정</h1>
        <p className="text-slate-600 dark:text-slate-400">계정 및 서비스 설정을 관리하세요</p>
      </div>
      {/* 상단 플랜/업그레이드 카드 */}
      <div className="mb-8">
        {/* 기본 플랜 카드 */}
        <div className="flex items-center justify-between bg-slate-800 rounded-2xl px-6 py-5 border border-slate-700/50 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-700">
              <User className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <div className="font-bold text-slate-100">기본 플랜</div>
              <div className="text-sm text-slate-400">무료로 기본 기능을 이용 중입니다</div>
            </div>
          </div>
        </div>
        {/* 프리미엄 업그레이드 카드 */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden mb-2">
          <div className="flex items-center space-x-3 mb-2">
            <Crown className="w-6 h-6" />
            <span className="text-xl font-bold">프리미엄으로 업그레이드</span>
          </div>
          <div className="mb-4 text-base">더 강력한 AI 기능과 무제한 연동으로 생산성을 극대화하세요.</div>
          <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
            <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-green-200" /><span><span className="font-bold">고급 AI 분석</span><br />더 정교한 감정 분석과 패턴 인식</span></div>
            <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-green-200" /><span><span className="font-bold">외부 툴 연동</span><br />노션, 옵시디언 등과 무제한 연동</span></div>
            <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-green-200" /><span><span className="font-bold">무제한 메모</span><br />메모 개수 제한 없이 자유롭게 작성</span></div>
            <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-green-200" /><span><span className="font-bold">우선 고객 지원</span><br />24시간 내 답변 보장</span></div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">₩9,900</div>
              <div className="text-sm text-purple-100">월 구독</div>
            </div>
            <button
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              onClick={() => setShowPremiumModal(true)}
            >
              <Sparkles className="w-5 h-5 mr-1" />
              <span>지금 업그레이드</span>
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {/* 외부 메모 툴 연동 */}
        <div className="bg-slate-900/60 dark:bg-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <Link2 className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-slate-100">외부 메모 툴 연동</span>
          </div>
          <p className="text-sm text-slate-300 mb-6">기존에 사용하던 메모 툴에서 데이터를 가져와 AI 분석에 활용하세요.</p>
          <div className="space-y-4">
            {/* Notion */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">📝</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-100">Notion</span>
                    {/* 연동 성공 시 연결됨 표시 */}
                    {notionPages.length > 0 && !notionError ? (
                      <span className="flex items-center text-green-400 font-semibold ml-2">
                        <CheckCircle className="w-5 h-5 mr-1" />연결됨
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-400">노션 페이지와 데이터베이스에서 메모를 가져옵니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-400">높은 보안</span>
                  </div>
                </div>
              </div>
              {/* 연동 안 됐을 때만 연결하기 버튼 */}
              {notionPages.length === 0 || notionError ? (
                <button
                  className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={fetchNotionPages}
                >
                  연결하기
                </button>
              ) : null}
            </div>
            {/* 노션 메모 목록 출력 */}
            <div className="bg-slate-900/60 dark:bg-slate-800 rounded-2xl p-6 border border-slate-700/50 mt-2">
              <h3 className="text-lg font-bold text-slate-100 mb-3">노션 메모 목록</h3>
              {notionLoading && <div className="text-blue-400">불러오는 중...</div>}
              {notionError && <div className="text-red-400">{notionError}</div>}
              {!notionLoading && !notionError && notionPages.length === 0 && (
                <div className="text-slate-400">아직 불러온 메모가 없습니다.</div>
              )}
              <ul className="space-y-2 mt-2">
                {notionPages.map(page => (
                  <li key={page.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700/50 text-slate-100">
                    {getNotionPageTitle(page)}
                  </li>
                ))}
              </ul>
              {/* 노션 메모 목록 출력 아래에 저장 버튼 및 메시지 */}
              <div className="flex items-center space-x-3 mt-4">
                <button
                  className="px-4 py-2 rounded-xl font-medium transition-colors bg-green-600 hover:bg-green-700 text-white"
                  onClick={saveNotionPages}
                  disabled={notionPages.length === 0}
                >
                  노션 메모 저장하기
                </button>
                {saveMessage && <span className="text-sm text-green-400">{saveMessage}</span>}
              </div>
            </div>
            {/* Obsidian */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">🔗</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-100">Obsidian</span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">PRO</span>
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">연결됨</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">옵시디언 볼트에서 마크다운 파일을 동기화합니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-400">높은 보안</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl font-medium transition-colors bg-green-900/60 text-green-300 hover:bg-green-900/80">관리하기</button>
            </div>
            {/* Google Keep */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">📌</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-100">Google Keep</span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">PRO</span>
                  </div>
                  <p className="text-sm text-slate-400">구글 킵의 메모와 리스트를 가져옵니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-yellow-400">표준 보안</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGoogleLogin}>연결하기</button>
            </div>
            {/* Roam Research */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">🧠</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-100">Roam Research</span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">PRO</span>
                  </div>
                  <p className="text-sm text-slate-400">로암 리서치의 블록과 페이지를 연동합니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-400">높은 보안</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGoogleLogin}>연결하기</button>
            </div>
          </div>
          {/* 데이터 보안 안내 */}
          <div className="mt-6 p-4 bg-slate-800 rounded-xl border border-blue-800/50">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-200 mb-1">데이터 보안</h4>
                <p className="text-sm text-blue-400">모든 연동 데이터는 암호화되어 저장되며, 언제든지 연결을 해제할 수 있습니다. 데이터는 AI 분석 목적으로만 사용되며 제3자와 공유되지 않습니다.</p>
              </div>
            </div>
          </div>
        </div>
        {/* 2단 그리드: 프로필/알림/개인정보/언어 및 지역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 프로필 */}
          <div className="bg-slate-900/60 dark:bg-slate-800 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-slate-100">프로필</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">이름</label>
                <input type="text" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100" value="사용자" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">이메일</label>
                <input type="email" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100" value="user@example.com" readOnly />
              </div>
            </div>
          </div>
          {/* 알림 */}
          <div className="bg-slate-900/60 dark:bg-slate-800 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-green-400" />
              <span className="font-bold text-slate-100">알림</span>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-300">새 추천 콘텐츠</span><input type="checkbox" className="rounded border-slate-600 text-blue-600 focus:ring-blue-500" checked readOnly /></label>
              <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-300">주간 리포트</span><input type="checkbox" className="rounded border-slate-600 text-blue-600 focus:ring-blue-500" checked readOnly /></label>
              <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-300">메모 리마인드</span><input type="checkbox" className="rounded border-slate-600 text-blue-600 focus:ring-blue-500" readOnly /></label>
            </div>
          </div>
          {/* 개인정보 */}
          <div className="bg-slate-900/60 dark:bg-slate-800 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-slate-100">개인정보</span>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-300">데이터 분석 허용</span><input type="checkbox" className="rounded border-slate-600 text-blue-600 focus:ring-blue-500" checked readOnly /></label>
              <label className="flex items-center justify-between cursor-pointer"><span className="text-slate-300">개인화 추천</span><input type="checkbox" className="rounded border-slate-600 text-blue-600 focus:ring-blue-500" checked readOnly /></label>
              <button className="text-red-400 text-sm hover:underline">계정 삭제</button>
            </div>
          </div>
          {/* 언어 및 지역 */}
          <div className="bg-slate-900/60 dark:bg-slate-800 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-slate-100">언어 및 지역</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">언어</label>
                <select className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100">
                  <option>한국어</option>
                  <option>English</option>
                  <option>日本語</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">시간대</label>
                <select className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100">
                  <option>Asia/Seoul</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* 고객 지원 */}
        <div className="bg-slate-900/60 dark:bg-slate-800 rounded-2xl p-6 border border-slate-700/50 mt-8">
          <span className="font-bold text-slate-100 mb-4 block">고객 지원</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-left">
              <div className="font-medium text-slate-100 text-sm mb-1">도움말 센터</div>
              <div className="text-xs text-slate-400">자주 묻는 질문과 가이드</div>
            </button>
            <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-left">
              <div className="font-medium text-slate-100 text-sm mb-1">문의하기</div>
              <div className="text-xs text-slate-400">이메일로 문의 보내기</div>
            </button>
            <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-left">
              <div className="font-medium text-slate-100 text-sm mb-1">피드백</div>
              <div className="text-xs text-slate-400">서비스 개선 의견 보내기</div>
            </button>
          </div>
        </div>
      </div>
      {/* 프리미엄 구독 팝업 (오버레이 포함) */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">프리미엄 구독</h3>
              <p className="text-slate-600 dark:text-slate-400">월 ₩9,900으로 모든 프리미엄 기능을 이용하세요.</p>
            </div>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900 dark:text-white">월간 구독</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">₩9,900</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">언제든지 취소 가능</p>
              </div>
              <div className="p-4 border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-900 dark:text-white">연간 구독</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">20% 할인</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">₩95,000</div>
                    <div className="text-sm text-slate-500 line-through">₩118,800</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">2개월 무료</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setShowPremiumModal(false)}
              >취소</button>
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300">결제하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 