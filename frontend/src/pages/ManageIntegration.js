import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Settings, RefreshCw, Eye } from 'lucide-react';

// 각 연동 서비스의 특화된 정보를 담는 객체
const integrationDetails = {
  obsidian: {
    name: 'Obsidian',
    icon: '🔗',
    description: '옵시디언 볼트와 동기화된 메모를 관리합니다.',
  },
  // 향후 다른 서비스 추가 가능
  // notion: { ... }
};

const ManageIntegration = () => {
  const { integrationId } = useParams();
  const details = integrationDetails[integrationId] || { 
    name: '연동 서비스', 
    icon: '⚙️', 
    description: '연동 상태를 관리합니다.' 
  };

  return (
    <div className="pt-16"> {/* Navbar height */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{details.icon}</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{details.name} 연동 관리</h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">연결됨</span>
            </div>
          </div>
          
          {/* 연동 상태 정보 */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8 border border-green-200/50 dark:border-green-800/50">
            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-4">연동 상태</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700 dark:text-green-400">마지막 동기화</span>
                <div className="font-medium text-green-900 dark:text-green-300">방금 전</div>
              </div>
              <div>
                <span className="text-green-700 dark:text-green-400">동기화된 메모</span>
                <div className="font-medium text-green-900 dark:text-green-300">127개</div>
              </div>
              <div>
                <span className="text-green-700 dark:text-green-400">동기화 주기</span>
                <div className="font-medium text-green-900 dark:text-green-300">매일</div>
              </div>
              <div>
                <span className="text-green-700 dark:text-green-400">상태</span>
                <div className="font-medium text-green-900 dark:text-green-300">정상</div>
              </div>
            </div>
          </div>
          
          {/* 액션 버튼 */}
          <div className="space-y-4 mb-8">
            <button className="w-full p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">동기화 설정 변경</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">주기, 카테고리 매핑 등 수정</p>
              </div>
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
            <button className="w-full p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">수동 동기화</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">지금 즉시 동기화 실행</p>
              </div>
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
            <button className="w-full p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">동기화된 노트 확인</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">가져온 메모 목록 보기</p>
              </div>
              <Eye className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          {/* 연동 해제 */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200/50 dark:border-red-800/50">
            <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">연동 해제</h3>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">연동을 해제하면 동기화가 중단되지만, 이미 가져온 메모는 유지됩니다.</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">연동 해제</button>
          </div>

          <div className="flex space-x-4 mt-8">
            <Link to="/settings" className="w-full text-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              설정 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageIntegration; 