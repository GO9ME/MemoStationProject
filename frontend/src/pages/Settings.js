import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download, 
  Trash2, 
  Eye,
  EyeOff,
  Mail,
  Phone,
  Globe,
  Sun,
  Moon,
  Monitor,
  Save,
  Camera,
  Edit
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    insights: true,
    weekly: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: false,
    analyticsEnabled: true
  });

  const tabs = [
    { key: 'profile', label: '프로필', icon: User },
    { key: 'notifications', label: '알림', icon: Bell },
    { key: 'privacy', label: '개인정보', icon: Shield },
    { key: 'appearance', label: '테마', icon: Palette },
    { key: 'data', label: '데이터', icon: Database }
  ];

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* 프로필 이미지 */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-gray-600">
            <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">프로필 사진</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG 파일만 업로드 가능합니다</p>
          <div className="flex space-x-2 mt-2">
            <button className="btn-secondary text-sm">업로드</button>
            <button className="btn-secondary text-sm text-red-600">삭제</button>
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            이름
          </label>
          <input
            type="text"
            defaultValue="김지혜"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            사용자 이름
          </label>
          <input
            type="text"
            defaultValue="@jihye_notes"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          이메일
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            defaultValue="jihye@example.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          자기소개
        </label>
        <textarea
          rows={4}
          defaultValue="AI와 함께하는 지식 탐험가입니다. 새로운 것을 배우고 연결하는 것을 좋아합니다."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          비밀번호 변경
        </label>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="새 비밀번호"
              className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">알림 설정</h3>
        <div className="space-y-4">
          {Object.entries({
            email: '이메일 알림',
            push: '푸시 알림',
            insights: 'AI 인사이트 알림',
            weekly: '주간 리포트'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'email' && '중요한 업데이트를 이메일로 받기'}
                  {key === 'push' && '즉시 알림을 브라우저로 받기'}
                  {key === 'insights' && 'AI가 발견한 패턴과 인사이트 알림'}
                  {key === 'weekly' && '매주 학습 성과 요약 리포트'}
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({...prev, [key]: !prev[key]}))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[key] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">알림 시간</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              시작 시간
            </label>
            <input
              type="time"
              defaultValue="09:00"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              종료 시간
            </label>
            <input
              type="time"
              defaultValue="22:00"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">개인정보 설정</h3>
        <div className="space-y-4">
          {Object.entries({
            profileVisible: '프로필 공개',
            activityVisible: '활동 내역 공개',
            analyticsEnabled: '분석 데이터 수집 허용'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'profileVisible' && '다른 사용자가 내 프로필을 볼 수 있습니다'}
                  {key === 'activityVisible' && '내 학습 활동을 다른 사용자가 볼 수 있습니다'}
                  {key === 'analyticsEnabled' && '서비스 개선을 위한 익명 데이터 수집에 동의합니다'}
                </div>
              </div>
              <button
                onClick={() => setPrivacy(prev => ({...prev, [key]: !prev[key]}))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy[key] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">데이터 관리</h3>
        <div className="space-y-3">
          <button className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">데이터 다운로드</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">내 모든 데이터를 다운로드합니다</div>
              </div>
            </div>
          </button>
          <button className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-medium text-red-900 dark:text-red-100">계정 삭제</div>
                <div className="text-sm text-red-700 dark:text-red-300">모든 데이터가 영구적으로 삭제됩니다</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const AppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">테마 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'light', label: '라이트 모드', icon: Sun },
            { key: 'dark', label: '다크 모드', icon: Moon },
            { key: 'system', label: '시스템 설정', icon: Monitor }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">색상 테마</h3>
        <div className="grid grid-cols-6 gap-3">
          {[
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
          ].map((color) => (
            <button
              key={color}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">인터페이스</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dark:text-white">컴팩트 모드</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dark:text-white">애니메이션 효과</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">데이터 사용량</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">47개</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 노트 수</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">2.3MB</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">사용 중인 저장소</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">156</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">AI 분석 수</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">백업 및 동기화</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">자동 백업</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">매일 자동으로 데이터를 백업합니다</div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">클라우드 동기화</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">여러 기기에서 데이터를 동기화합니다</div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">내보내기 및 가져오기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            데이터 내보내기
          </button>
          <button className="btn-secondary">
            <Edit className="w-4 h-4 mr-2" />
            데이터 가져오기
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'privacy': return <PrivacyTab />;
      case 'appearance': return <AppearanceTab />;
      case 'data': return <DataTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center space-x-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">설정</h1>
            <p className="text-gray-600 dark:text-gray-400">계정 및 환경 설정을 관리하세요</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 탭 네비게이션 */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              {renderTabContent()}
              
              {/* 저장 버튼 */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="btn-secondary">취소</button>
                <button className="btn-primary flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 