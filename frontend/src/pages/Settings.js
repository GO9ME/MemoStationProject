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
  ArrowRight,
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
  // 플랜 상세 비교 팝업 상태
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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
        <div className="flex items-center justify-between bg-white rounded-2xl px-6 py-5 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-700/50 mb-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-700">
              <User className="w-7 h-7 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">기본 플랜</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">무료로 기본 기능을 이용 중입니다</div>
            </div>
          </div>
          {/* '지금 업그레이드' 버튼 재추가 */}
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors"
            onClick={() => setShowPremiumModal(true)}
          >
            <Sparkles className="w-4 h-4"/>
            <span>지금 업그레이드</span>
          </button>
        </div>
        {/* 프리미엄 혜택 미리보기 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-700/50 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500"/>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">프리미엄 혜택 미리보기</h3>
            </div>
            <span className="text-orange-500 dark:text-orange-400 text-xs font-medium">업그레이드 시 이용 가능</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">고급 AI 분석</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">더 정교한 감정 분석과 패턴 인식</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400"/>
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">외부 툴 연동</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">노션, 옵시디언 등과 무제한 연동</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <PenLine className="w-4 h-4 text-green-600 dark:text-green-400"/>
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">무제한 메모</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">메모 개수 제한 없이 자유롭게 작성</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-red-600 dark:text-red-400"/>
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">우선 고객 지원</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">24시간 내 답변 보장</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">₩9,900 <span className="text-sm font-normal text-slate-600 dark:text-white">/ 월</span></div>
            </div>
            <button
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center space-x-1"
              onClick={() => setShowDetailsModal(true)}
            >
              <span>자세히 알아보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {/* 외부 메모 툴 연동 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">외부 메모 툴 연동</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">기존에 사용하던 메모 툴에서 데이터를 가져와 AI 분석에 활용하세요.</p>
          <div className="space-y-4">
            {/* Notion */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/50 dark:bg-slate-800 dark:border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">📝</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-slate-100">Notion</span>
                    {/* 연동 성공 시 연결됨 표시 */}
                    {notionPages.length > 0 && !notionError ? (
                      <span className="flex items-center text-green-600 font-semibold ml-2 dark:text-green-400">
                        <CheckCircle className="w-5 h-5 mr-1" />연결됨
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">노션 페이지와 데이터베이스에서 메모를 가져옵니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">높은 보안</span>
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
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mt-2 shadow-inner">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">노션 메모 목록</h3>
              {notionLoading && <div className="text-blue-600 dark:text-blue-400">불러오는 중...</div>}
              {notionError && <div className="text-red-600 dark:text-red-400">{notionError}</div>}
              {!notionLoading && !notionError && notionPages.length === 0 && (
                <div className="text-slate-600 dark:text-slate-400">아직 불러온 메모가 없습니다.</div>
              )}
              <ul className="space-y-2 mt-2">
                {notionPages.map(page => (
                  <li key={page.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-900 dark:text-slate-100">
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
                {saveMessage && <span className="text-sm text-green-600 dark:text-green-400">{saveMessage}</span>}
              </div>
            </div>
            {/* Obsidian */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/50 dark:bg-slate-800 dark:border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">🔗</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-slate-100">Obsidian</span>
                    <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full font-medium dark:bg-purple-900/30 dark:text-purple-300">PRO</span>
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">연결됨</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">옵시디언 볼트에서 마크다운 파일을 동기화합니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">높은 보안</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl font-medium transition-colors bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/60 dark:text-green-300 dark:hover:bg-green-900/80">관리하기</button>
            </div>
            {/* Google Keep */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/50 dark:bg-slate-800 dark:border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">📌</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-slate-100">Google Keep</span>
                    <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full font-medium dark:bg-purple-900/30 dark:text-purple-300">PRO</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">구글 킵의 메모와 리스트를 가져옵니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-amber-600 dark:text-amber-400">보통 보안</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGoogleLogin}>연결하기</button>
            </div>
            {/* Roam Research */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/50 dark:bg-slate-800 dark:border-slate-700/50 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">🧠</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-slate-100">Roam Research</span>
                    <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full font-medium dark:bg-purple-900/30 dark:text-purple-300">PRO</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">로딩 리서치의 블록과 페이지를 연동합니다.</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">높은 보안</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white">연결하기</button>
            </div>
          </div>
          {/* 데이터 보안 안내 */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200/50 dark:bg-blue-950 dark:border-blue-900/50 mt-6">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"/>
            <p className="text-sm text-blue-800 dark:text-blue-200">모든 연동 데이터는 암호화되어 저장되며, 언제든지 연결을 해제할 수 있습니다. 데이터는 AI 분석 목적으로만 사용되며 제3자와 공유되지 않습니다.</p>
          </div>
        </div>
        {/* 프로필 및 개인 설정 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 프로필 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">프로필</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">이름</label>
                <input type="text" id="name" defaultValue="사용자" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">이메일</label>
                <input type="email" id="email" defaultValue="user@example.com" readOnly className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
            </div>
          </div>
          {/* 알림 설정 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">알림</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="newContent" className="text-slate-700 dark:text-slate-300">새 추천 콘텐츠</label>
                <input type="checkbox" id="newContent" className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="weeklyReport" className="text-slate-700 dark:text-slate-300">주간 리포트</label>
                <input type="checkbox" id="weeklyReport" className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="memoRemind" className="text-slate-700 dark:text-slate-300">메모 리마인드</label>
                <input type="checkbox" id="memoRemind" className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600" />
              </div>
            </div>
          </div>
          {/* 개인 정보 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">개인정보</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="dataAnalysis" className="text-slate-700 dark:text-slate-300">데이터 분석 허용</label>
                <input type="checkbox" id="dataAnalysis" className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="personalizedRecommendation" className="text-slate-700 dark:text-slate-300">개인화 추천</label>
                <input type="checkbox" id="personalizedRecommendation" className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600" defaultChecked />
              </div>
              <button className="text-red-500 hover:text-red-600 font-medium">계정 삭제</button>
            </div>
          </div>
          {/* 언어 및 지역 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">언어 및 지역</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">언어</label>
                <select id="language" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                  <option>한국어</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">시간대</label>
                <select id="timezone" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                  <option>Asia/Seoul</option>
                  <option>America/New_York</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 프리미엄 구독 모달 */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white"/>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">프리미엄 구독</h3>
              <p class="text-slate-600 dark:text-slate-400">월 ₩9,900으로 모든 프리미엄 기능을 이용하세요.</p>
            </div>
            <div class="space-y-4 mb-6">
              <div class="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-slate-900 dark:text-white">월간 구독</span>
                  <span class="text-xl font-bold text-slate-900 dark:text-white">₩9,900</span>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400">언제든지 취소 가능</p>
              </div>
              <div class="p-4 border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-slate-900 dark:text-white">연간 구독</span>
                    <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">20% 할인</span>
                  </div>
                  <div class="text-right">
                    <div class="text-xl font-bold text-slate-900 dark:text-white">₩95,000</div>
                    <div class="text-sm text-slate-500 line-through">₩118,800</div>
                  </div>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400">2개월 무료</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button class="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={() => setShowPremiumModal(false)}>취소</button>
              <button class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300">결제하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 플랜 상세 비교 팝업 */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-purple-500"/>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">플랜 업그레이드</span>
                </div>
                <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => setShowDetailsModal(false)}>
                  <X className="w-6 h-6"/>
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white"/>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">프리미엄으로 업그레이드</h2>
                <p class="text-slate-600 dark:text-slate-400">더 강력한 AI 기능과 무제한 연동으로 생산성을 극대화하세요</p>
              </div>
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 mb-8 border border-purple-200/50 dark:border-purple-800/50">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div class="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500"/>
                    <span class="text-slate-700 dark:text-slate-300">고급 AI 분석</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500"/>
                    <span class="text-slate-700 dark:text-slate-300">외부 툴 연동</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500"/>
                    <span class="text-slate-700 dark:text-slate-300">무제한 메모</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500"/>
                    <span class="text-slate-700 dark:text-slate-300">우선 고객 지원</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-center mb-8">
                <div class="bg-slate-100 dark:bg-slate-700 rounded-2xl p-1 flex">
                  <button class="px-6 py-3 rounded-xl font-medium transition-all duration-200 text-slate-600 dark:text-slate-400">월간 결제</button>
                  <button class="px-6 py-3 rounded-xl font-medium transition-all duration-200 relative bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm">연간 결제<span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">20% 할인</span></button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="relative p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 ">
                  <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span class="bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">현재 이용 중</span>
                  </div>
                  <div class="text-center mb-6">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">기본 플랜</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">개인 사용자를 위한 기본 기능</p>
                    <div class="mb-4">
                      <div class="text-3xl font-bold text-slate-900 dark:text-white">무료</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">노트 작성 무제한</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">기본 AI 추천</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">태그 및 검색</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">기본 리포트</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">모바일 앱 사용</span>
                    </div>
                  </div>
                </div>
                <div class="relative p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500 ring-opacity-20">
                  <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full">가장 인기</span>
                  </div>
                  <div class="text-center mb-6">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">프로 플랜</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">전문가를 위한 고급 기능</p>
                    <div class="mb-4">
                      <div class="text-3xl font-bold text-slate-900 dark:text-white">₩7,917</div>
                      <div class="text-sm text-slate-500 dark:text-slate-400">월 (연간 결제)</div>
                      <div class="text-xs text-green-600 dark:text-green-400 mt-1">연간 ₩95,000 (20% 할인)</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">모든 기본 플랜 기능</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">팀 워크스페이스</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">노트 공유 및 협업</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">팀 인사이트 대시보드</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">관리자 권한 설정</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">팀 활동 분석</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">무제한 게스트 초대</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">24/7 전담 지원</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">SSO 연동</span>
                    </div>
                  </div>
                  <div class="mt-6">
                    <div class="w-full bg-purple-600 text-white py-3 rounded-xl text-center font-medium">선택됨</div>
                  </div>
                </div>
                <div class="relative p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 ">
                  <div class="text-center mb-6">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">팀 플랜</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">팀과 조직을 위한 협업 기능</p>
                    <div class="mb-4">
                      <div class="text-3xl font-bold text-slate-900 dark:text-white">₩8,250</div>
                      <div class="text-sm text-slate-500 dark:text-slate-400">월 (연간 결제)</div>
                      <div class="text-xs text-green-600 dark:text-green-400 mt-1">연간 ₩99,000 (20% 할인)</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">모든 프로 플랜 기능</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">팀 워크스페이스</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">노트 공유 및 협업</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">팀 인사이트 대시보드</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">관리자 권한 설정</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">팀 활동 분석</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">무제한 게스트 초대</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">24/7 전담 지원</span>
                    </div>
                    <div class="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span class="text-sm text-slate-700 dark:text-slate-300">SSO 연동</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center mb-8">
                <button class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm">플랜 상세 비교하기</button>
              </div>
              <div class="flex space-x-4">
                <button class="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={() => setShowDetailsModal(false)}>나중에</button>
                <button class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300">프로 플랜 업그레이드</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 