import React, { useState, useEffect, useRef } from 'react';

// 향상된 노트 에디터 페이지
export default function NoteEnhanced() {
  // 입력값 상태 관리
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [autoSaved, setAutoSaved] = useState(false); // 자동 저장 상태
  const debounceRef = useRef(null);

  // 추천 콘텐츠 상태
  const [recommendList, setRecommendList] = useState([]);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState('');

  // 추천 콘텐츠 불러오기
  const fetchRecommendations = async () => {
    if (!content.trim()) {
      setRecommendList([]);
      return;
    }
    
    setRecommendLoading(true);
    setRecommendError('');
    
    try {
      const response = await fetch(`http://121.171.194.10:8000/api/recommendations/사용자_001?content_type=blog`);
      const data = await response.json();
      
      if (data.content && data.content.blogs) {
        const formattedBlogs = data.content.blogs.slice(0, 6).map(blog => ({
          title: blog.title,
          desc: blog.content ? blog.content.substring(0, 80) + '...' : '',
          url: blog.url || '#',
          image_url: blog.thumbnailUrl || blog.thumbNailUrl || 'https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg?auto=compress&w=1260&h=750&dpr=1',
          category: blog.data_source ? blog.data_source.replace('.json', '').replace(/[생활노하우쇼핑_엔터테인먼트예술_지식동향_취미여가여행_]/g, ' ') : '블로그',
          type: 'article',
          score: blog.recommendation_score ? Math.min(Math.round(blog.recommendation_score * 15), 95) : Math.floor(Math.random() * 15) + 80
        }));
        setRecommendList(formattedBlogs);
      } else if (data.message) {
        setRecommendError(data.message);
        setRecommendList([]);
      } else {
        setRecommendList([]);
      }
    } catch (error) {
      console.error('추천 콘텐츠 로드 오류:', error);
      setRecommendError('내용을 더 작성하시면 추천 콘텐츠를 보여드리겠습니다.');
      setRecommendList([]);
    } finally {
      setRecommendLoading(false);
    }
  };

  // 콘텐츠 변경 시 추천 콘텐츠 업데이트 (디바운스)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRecommendations();
    }, 1000);
    
    return () => clearTimeout(debounceTimer);
  }, [content]);

  // 자동 저장: 입력값 변경 시 debounce로 로컬스토리지에 임시 저장
  useEffect(() => {
    setAutoSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const tempNote = { title, tags, content };
      localStorage.setItem('tempNoteEnhanced', JSON.stringify(tempNote));
      setAutoSaved(true);
    }, 1500);
    return () => clearTimeout(debounceRef.current);
  }, [title, tags, content]);

  // 페이지 진입 시 임시 저장된 값 불러오기
  useEffect(() => {
    const temp = localStorage.getItem('tempNoteEnhanced');
    if (temp) {
      try {
        const { title: t, tags: tg, content: c } = JSON.parse(temp);
        if (t) setTitle(t);
        if (Array.isArray(tg)) setTags(tg);
        if (c) setContent(c);
      } catch {}
    }
  }, []);

  // 태그 추가
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  // 태그 삭제
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 저장 핸들러(실제 API 연동 필요)
  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // 실제 API 엔드포인트에 맞게 수정 필요
      // await fetch(...)
      window.location.href = '/notes';
    } catch (err) {
      setError('노트 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 에디터 툴바 버튼 핸들러(간단 마크다운 삽입)
  const insertAtCursor = (before, after = '') => {
    const textarea = document.getElementById('enhanced-content');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const newValue = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

  // mock 추천 콘텐츠/연관 노트/작성팁
  const recommended = [
    { id: 1, title: '효과적인 메모 습관', desc: '짧고 명확하게 기록하는 습관을 들이세요.' },
    { id: 2, title: 'AI가 추천하는 오늘의 키워드', desc: '실행, 성장, 목표, 루틴' },
  ];
  const related = [
    { id: 101, title: '목표 달성 전략', date: '2024. 6. 1.' },
    { id: 102, title: '실행력 높이는 루틴', date: '2024. 5. 28.' },
  ];
  const writeTips = [
    '핵심 아이디어를 먼저 작성하세요',
    '구체적인 예시와 사례를 포함하세요',
    '질문을 통해 생각을 확장해보세요',
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* 상단 고정 바 */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={()=>window.location.href='/notes'}>
                {/* X 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
              {/* 자동 저장 상태 표시 */}
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 inline mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {autoSaved ? '자동 저장됨' : '자동 저장 중...'}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving || !title.trim() || !content.trim()}
                onClick={handleSave}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                <span>{saving ? '저장 중...' : '저장'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 본문 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* 메인 에디터 카드 */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-start space-x-4 mb-6">
              <div className="relative">
                <button className="text-3xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl w-12 h-12 flex items-center justify-center transition-colors">🤔</button>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="제목을 입력하세요..."
                  className="w-full text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-400 dark:placeholder-slate-500"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag w-4 h-4 text-slate-400"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span key={tag} className="inline-flex items-center bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 rounded px-2 py-0.5 mr-1">
                          {tag}
                          <button type="button" className="ml-1 text-slate-400 hover:text-red-400" onClick={()=>handleRemoveTag(tag)}>&times;</button>
                        </span>
                      ))}
                      <div className="inline-flex items-center">
                        <input
                          id="tag-input"
                          type="text"
                          placeholder="태그 추가..."
                          className="bg-transparent border-none text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-0 placeholder-slate-400 dark:placeholder-slate-500 w-24"
                          value={tagInput}
                          onChange={e=>setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 에디터 툴바 */}
            <div className="flex items-center space-x-2 border-t border-b border-slate-200 dark:border-slate-700 py-2 mb-4 overflow-x-auto">
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="굵게" onClick={()=>insertAtCursor('**','**')}>B</button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="기울임" onClick={()=>insertAtCursor('*','*')}>I</button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="헤더1" onClick={()=>insertAtCursor('# ')}><b>H1</b></button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="헤더2" onClick={()=>insertAtCursor('## ')}><b>H2</b></button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="헤더3" onClick={()=>insertAtCursor('### ')}><b>H3</b></button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="리스트" onClick={()=>insertAtCursor('- ')}>&bull; 리스트</button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="코드" onClick={()=>insertAtCursor('`','`')}>{'<>'}</button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="링크" onClick={()=>insertAtCursor('[텍스트](url)')}>🔗</button>
              <button className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="이미지" onClick={()=>insertAtCursor('![이미지](url)')}>🖼️</button>
            </div>
            <textarea
              id="enhanced-content"
              placeholder="내용을 입력하세요..."
              className="w-full min-h-[400px] text-slate-700 dark:text-slate-300 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-400 dark:placeholder-slate-500 resize-none leading-relaxed"
              value={content}
              onChange={e=>setContent(e.target.value)}
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
          {/* 추천 콘텐츠 */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {/* 책 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open w-5 h-5 text-blue-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                <h3 className="font-bold text-slate-900 dark:text-white">추천 콘텐츠</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4"><path d="m18 15-6-6-6 6"></path></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendLoading ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 col-span-full">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">추천 콘텐츠를 찾고 있습니다...</span>
                  </div>
                </div>
              ) : recommendError ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 col-span-full">
                  <p className="text-sm">{recommendError}</p>
                </div>
              ) : recommendList.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 col-span-full">
                  <p className="text-sm">노트를 더 작성하면 관련 콘텐츠를 추천해드릴게요</p>
                </div>
              ) : (
                recommendList.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover rounded-lg" onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }} />
                        <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-600 dark:text-blue-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{item.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 dark:text-slate-500">{item.category}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-green-600 dark:text-green-400">{item.score}%</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => item.url !== '#' && window.open(item.url, '_blank')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium transition-colors"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div className="col-span-full mt-2 flex justify-end">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors">피드백 남기기</button>
              </div>
            </div>
          </div>
          {/* 연관 노트 */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {/* 링크 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link2 w-5 h-5 text-purple-500"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
                <h3 className="font-bold text-slate-900 dark:text-white">연관 노트</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4"><path d="m18 15-6-6-6 6"></path></svg>
              </button>
            </div>
            <div>
              {/* 연관 노트가 없을 때 안내 */}
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-12 h-12 mx-auto mb-3 opacity-50"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                <p className="text-sm">노트를 더 작성하면 관련 노트를 찾아드릴게요</p>
              </div>
            </div>
          </div>
        </div>
        {/* 우측 작성 팁 */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-6 mb-6">
            <h3 className="text-blue-700 dark:text-blue-300 font-bold mb-3">효과적인 노트 작성 팁</h3>
            <ol className="list-decimal ml-5 text-slate-700 dark:text-slate-300 text-sm space-y-1">
              {writeTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 