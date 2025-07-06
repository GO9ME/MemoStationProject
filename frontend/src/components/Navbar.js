import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  BarChart3, 
  Settings, 
  Sun,
  Moon, 
  Monitor,
  Bell,
  User
} from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [themeMode, setThemeMode] = useState('system');
  // 검색 드롭다운 상태
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  // 검색 결과/로딩 상태
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');
  // 디바운스 타이머
  const debounceTimer = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    }
    if (showSearchDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchDropdown]);

  // 컴포넌트 언마운트 시 디바운스 타이머 클리어
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // 테마 초기화
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setThemeMode(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // 테마 적용 함수
  const applyTheme = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system 모드
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // 테마 변경 핸들러
  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('theme', mode);
    applyTheme(mode);
  };

  const navItems = [
    // { path: '/', label: '홈', icon: Home, emoji: '🏠' }, // 홈 버튼 제거
    { path: '/notes', label: '내 노트', icon: FileText, emoji: '📝' },
    // { path: '/explore', label: '추천', icon: Search, emoji: '🔍' }, // 추천 메뉴 제거
    { path: '/reports', label: '리포트', icon: BarChart3, emoji: '📊' },
    { path: '/settings', label: '설정', icon: Settings, emoji: '⚙️' },
  ];

  const isActivePath = (path) => location.pathname === path;

  // 검색 API 호출 함수
  const searchMemos = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    
    setSearchLoading(true);
    try {
      const response = await fetch(`http://121.171.194.10:8000/api/search-suggestions?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        // API 응답을 UI 형식에 맞게 변환
        const formattedResults = data.suggestions.map(item => ({
          id: item.id,
          icon: getMemoIcon(item.memo_type),
          color: getMemoColor(item.memo_type),
          title: item.title,
          type: item.memo_type || '메모',
          desc: item.content,
          relevance: Math.min(100, item.relevance_score * 30 + 70),
          relevanceType: '연관성',
          keyword: item.keyword,
          interests: item.interests,
          date: item.date
        }));
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('검색 API 오류:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 메모 타입에 따른 아이콘 반환
  const getMemoIcon = (memoType) => {
    switch (memoType) {
      case '기쁨':
      case '즐거움':
        return 'brain';
      case '슬픔':
      case '우울':
        return 'file';
      case '분노':
      case '화남':
        return 'file';
      default:
        return 'book';
    }
  };

  // 메모 타입에 따른 색상 반환
  const getMemoColor = (memoType) => {
    switch (memoType) {
      case '기쁨':
      case '즐거움':
        return 'green';
      case '슬픔':
      case '우울':
        return 'blue';
      case '분노':
      case '화남':
        return 'purple';
      default:
        return 'blue';
    }
  };

  // 검색어 입력 핸들러 (디바운스 적용)
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // 이전 타이머 클리어
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // 300ms 후 검색 실행
    debounceTimer.current = setTimeout(() => {
      searchMemos(query);
    }, 300);
  };

  // 추천 검색어 클릭 핸들러
  const handleRecommendedSearch = () => {
    setSearchQuery('기억력 향상');
    searchMemos('기억력 향상');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              {/* 뇌 아이콘 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain text-white"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-purple-700">노트 스테이션</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">초개인화 AI 큐레이션</span>
            </div>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center space-x-2 ml-12">
            {navItems.map((item) => {
              const active = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-base font-semibold transition-all duration-150 select-none
                    ${active
                      ? 'bg-blue-50 text-blue-700 shadow ring-2 ring-blue-200'
                      : 'bg-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'}
                  `}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  {/* 아이콘/이모지 */}
                  {item.icon === FileText && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5 text-blue-400 mr-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  )}
                  <span className="leading-none">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* 검색바 */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="노트, 콘텐츠, 인사이트 검색..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => setShowSearchDropdown(true)}
              />
              {/* 검색 드롭다운 */}
              {showSearchDropdown && (
                <div ref={searchDropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
                  {/* 검색 결과/로딩/추천 검색어 */}
                  {searchLoading ? (
                    // 로딩 UI
                    <div className="flex flex-col items-center justify-center py-16">
                      <svg className="animate-spin h-8 w-8 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      <div className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">의미 기반 검색 중...</div>
                      <div className="flex items-center space-x-2 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-4 h-4 text-amber-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">검색 팁</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">자연어 질문이나 문장으로 검색해보세요. 예: "집중력 떨어질 때 대처법"</p>
                    </div>
                  ) : searchResults ? (
                    // 검색 결과 UI
                    <div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-4 h-4 text-blue-500"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">검색 결과</h3>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{searchResults.length}개 결과</span>
                        </div>
                        {searchResults.length > 0 ? (
                          <div className="space-y-3">
                            {searchResults.map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
                                onClick={() => {
                                  // 클릭 시 노트 상세로 이동
                                  window.location.href = `http://121.171.194.10:3000/notes/${item.id}`;
                                }}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : item.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                                  {item.icon === 'book' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open w-5 h-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                  )}
                                {item.icon === 'file' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                )}
                                {item.icon === 'brain' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-5 h-5"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-1">{item.title}</h4>
                                  <div className={`px-1.5 py-0.5 rounded-full text-xs ${item.type === '의미 기반' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : item.type === '키워드 기반' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'}`}>{item.type}</div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">{item.desc}</p>
                                <div className="flex items-center justify-between">
                                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-xs">{item.relevance}% {item.relevanceType}</div>
                                  <button className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-4 h-4 "><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        ) : (
                          <div className="text-center py-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-x w-12 h-12 text-slate-400 mx-auto mb-4"><path d="m13.5 8.5-5 5"></path><path d="m8.5 8.5 5 5"></path><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">검색 결과가 없습니다</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">다른 키워드로 시도해보세요</p>
                          </div>
                        )}
                      </div>
                      {/* 검색 팁 */}
                      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-4 h-4 text-amber-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">검색 팁</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">자연어 질문이나 문장으로 검색해보세요. 예: "집중력 떨어질 때 대처법"</p>
                      </div>
                    </div>
                  ) : (
                  // 추천/최근 검색어 기본 UI
                  <>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-4 h-4 text-blue-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">추천 검색어</h3>
                    </div>
                    <div className="space-y-2">
                      <button onClick={handleRecommendedSearch} className="w-full flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left focus:ring-2 ring-blue-200">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-slate-700 dark:text-slate-300">최근 작성한 노트와 관련된 콘텐츠 찾기</span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">최근 검색어</div>
                        </div>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-4 h-4"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-slate-700 dark:text-slate-300">실행력 향상을 위한 방법론</span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">개인 관심사 기반</div>
                        </div>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-4 h-4"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-slate-700 dark:text-slate-300">창의적 사고 기법 추천</span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">인기 검색어</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  {/* 최근 검색어 */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-slate-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">최근 검색어</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <span className="text-xs text-slate-700 dark:text-slate-300">창의적 사고 기법 추천</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <span className="text-xs text-slate-700 dark:text-slate-300">실행력 향상을 위한 방법론</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <span className="text-xs text-slate-700 dark:text-slate-300">최근 작성한 노트와 관련된 콘텐츠 찾기</span>
                      </button>
                    </div>
                  </div>
                  {/* 검색 팁 */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-4 h-4 text-amber-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">검색 팁</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">자연어 질문이나 문장으로 검색해보세요. 예: "집중력 떨어질 때 대처법"</p>
                  </div>
                  </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 우측 컨트롤 */}
          <div className="flex items-center space-x-2">
            {/* 테마 토글 */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-1.5 rounded-md transition-colors ${
                  themeMode === 'light' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title="라이트 모드"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-1.5 rounded-md transition-colors ${
                  themeMode === 'dark' 
                    ? 'bg-gray-700 shadow-sm text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title="다크 모드"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-1.5 rounded-md transition-colors ${
                  themeMode === 'system' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title="시스템 설정 따르기"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* 알림 */}
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* 프로필 */}
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 네비게이션 */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 text-xs font-medium transition-colors ${
                isActivePath(item.path)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 