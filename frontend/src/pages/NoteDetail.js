import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Share2, Bookmark, Calendar, Link2, Users, Tag, Brain, ChevronUp, Star, PenLine, Copy, Plus, Search, Heart, Compass, ChevronDown, BarChart3, Zap, Target, BookOpen, Lightbulb, Eye, CheckCircle, ExternalLink, MessageSquare, Video, FileText
} from 'lucide-react';
import FloatingActionButtons from '../components/FloatingActionButtons';

const NoteDetail = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState('');
  const [recommendList, setRecommendList] = useState([]);
  const [recommendYoutubeList, setRecommendYoutubeList] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showDim, setShowDim] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackStep, setFeedbackStep] = useState('choice');
  const [feedbackSelected, setFeedbackSelected] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState([]);
  const [feedbackBadSelected, setFeedbackBadSelected] = useState('');
  const [feedbackBadSubmitted, setFeedbackBadSubmitted] = useState([]);
  const [feedbackBadEtcText, setFeedbackBadEtcText] = useState('');

  useEffect(() => {
    const fetchNoteDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://121.171.194.10:8000/api/memos/${noteId}`);
        if (!response.ok) throw new Error('노트 정보를 불러오지 못했습니다.');
        const data = await response.json();
        setNote(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNoteDetail();
  }, [noteId]);

  useEffect(() => {
    // 추천 콘텐츠 불러오기
    if (!note) return;
    setRecommendLoading(true);
    setRecommendError('');
    
    // 새로운 API 엔드포인트 사용
    fetch(`http://121.171.194.10:8000/api/recommendations/${note.id}?content_type=all`)
      .then(res => res.json())
      .then(data => {
        console.log('Recommendation API response:', data);
        
        // API 응답 구조에 맞게 데이터 처리
        if (data.content && data.content.blogs) {
          // 블로그 데이터를 UI 형식으로 변환
          const formattedBlogs = data.content.blogs.map(blog => ({
            title: blog.title,
            desc: blog.content ? blog.content.substring(0, 100) + '...' : '',
            url: blog.url || '#',
            image_url: blog.thumbnailUrl || blog.thumbNailUrl || 'https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg?auto=compress&w=1260&h=750&dpr=1',
            category: blog.data_source ? blog.data_source.replace('.json', '').replace('_', ' ') : '블로그',
            type: 'article',
            score: blog.recommendation_score ? Math.round(blog.recommendation_score * 10) : Math.floor(Math.random() * 20) + 80
          }));
          setRecommendList(formattedBlogs);
        } else {
          setRecommendList([]);
        }
        // 유튜브 추천 데이터 파싱
        if (data.content && data.content.youtube) {
          const formattedYoutube = data.content.youtube.map(video => ({
            title: video.title,
            desc: video.description ? video.description.substring(0, 80) + '...' : '',
            url: video.url || `https://www.youtube.com/watch?v=${video.video_id}`,
            image_url: `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`,
            type: 'youtube',
            video_id: video.video_id
          }));
          setRecommendYoutubeList(formattedYoutube);
        } else {
          setRecommendYoutubeList([]);
        }
        if (data.message) {
          setRecommendError(data.message);
        }
        setRecommendLoading(false);
      })
      .catch(error => {
        console.error('Recommendation API error:', error);
        setRecommendError('추천 콘텐츠를 불러오지 못했습니다.');
        setRecommendLoading(false);
      });
  }, [note]);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!note) return <div className="p-8 text-center">노트 정보가 없습니다.</div>;

  // 새 테이블 구조에 맞게 필드 매핑
  const {
    id,
    memo_type,
    persona_id,
    persona_age,
    persona_profession,
    date,
    content,
    interests,
    pain_points,
    style,
    keyword,
    summary
  } = note;
  
  const keywordList = typeof keyword === 'string' ? keyword.split(',').map(k => k.trim()) : (keyword || []);
  const interestsList = typeof interests === 'string' ? interests.split(',').map(i => i.trim()) : (interests || []);
  const painPointsList = typeof pain_points === 'string' ? pain_points.split(',').map(p => p.trim()) : (pain_points || []);
  
  // 메모 타입에 따른 이모지
  const getEmojiByType = (type) => {
    const typeMap = {
      '자기개발': '💡',
      '업무': '💼', 
      '일상': '📔',
      '학습': '📚',
      '목표': '🎯',
      '아이디어': '🌟',
      '회고': '🤔',
      '계획': '📋'
    };
    return typeMap[type] || '📝';
  };
  
  const emoji = getEmojiByType(memo_type);
  const title = summary ? summary.slice(0, 80) : content ? content.slice(0, 80) + '...' : '제목 없음';

  // 수정 버튼 클릭 시 모달 오픈 및 내용 세팅
  const handleEditOpen = () => {
    setEditContent(content);
    setEditModalOpen(true);
    setEditError('');
  };
  // 수정 취소
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditError('');
  };
  // 수정 저장
  const handleEditSave = async () => {
    setEditSaving(true);
    setEditError('');
    try {
      const res = await fetch(`http://121.171.194.10:8000/api/memos/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });
      if (!res.ok) throw new Error('업데이트 실패');
      setEditModalOpen(false);
      // 성공 시 새로고침(또는 setNote({...note, content: editContent}))
      setNote({ ...note, content: editContent });
    } catch (err) {
      setEditError('노트 업데이트에 실패했습니다.');
    } finally {
      setEditSaving(false);
    }
  };

  // 복사 버튼 클릭 시 실행되는 함수
  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content); // 클립보드에 노트 내용 복사
      setCopySuccess(true); // 복사 성공 상태 변경
      setTimeout(() => setCopySuccess(false), 1500); // 1.5초 후 복사 성공 메시지 숨김
    } catch (err) {
      alert('클립보드 복사에 실패했습니다.'); // 에러 발생 시 알림
    }
  };

  // 피드백 모달 닫기 핸들러
  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setFeedbackTarget(null);
    setFeedbackStep('choice');
    setFeedbackSelected('');
  };

  // 피드백 제출 핸들러(좋아요)
  const handleFeedbackSubmit = () => {
    if (!feedbackTarget) return;
    setFeedbackSubmitted(prev => [...prev, feedbackTarget.url || feedbackTarget.id || feedbackTarget.title]);
    closeFeedbackModal();
  };

  // 피드백 제출 핸들러(별로예요)
  const handleBadFeedbackSubmit = () => {
    if (!feedbackTarget) return;
    setFeedbackBadSubmitted(prev => [...prev, feedbackTarget.url || feedbackTarget.id || feedbackTarget.title]);
    closeFeedbackModal();
  };

  // 별로예요 상세 사유 목록
  const badReasons = [
    { key: 'no_interest', label: '주제에 관심 없음', icon: '⛔' },
    { key: 'not_me', label: '나와 맞지 않음', icon: '🚫' },
    { key: 'already_seen', label: '이미 본 콘텐츠', icon: '👀' },
    { key: 'too_hard', label: '너무 어려움', icon: '📖' },
    { key: 'bad_timing', label: '타이밍 안 맞음', icon: '⏰' },
    { key: 'etc', label: '기타 (직접 입력)', icon: '✏️' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {showDim && (
        <div className="fixed inset-0 bg-black/30 z-50 transition-opacity" />
      )}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>돌아가기</span>
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                <span>{emoji}</span>
                <span>{memo_type || '분류 없음'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{emoji}</span>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">{memo_type || '분류 없음'}</div>
                    {persona_profession && (
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium">{persona_profession}</div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{title}</h1>
                  <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{date ? new Date(date).toLocaleDateString() : ''}</span></div>
                    <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>연령: {persona_age}세</span></div>
                    <div className="flex items-center space-x-2"><Tag className="w-4 h-4" /><span>{style || '스타일 미지정'}</span></div>
                  </div>
                  
                  {/* 키워드 섹션 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {keywordList.map((kw, idx) => (
                        <span key={idx} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>#{kw}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 관심사 섹션 */}
                  {interestsList.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">관심사</h4>
                      <div className="flex flex-wrap gap-2">
                        {interestsList.map((interest, idx) => (
                          <span key={idx} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 페인 포인트 섹션 */}
                  {painPointsList.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">고민 사항</h4>
                      <div className="flex flex-wrap gap-2">
                        {painPointsList.map((pain, idx) => (
                          <span key={idx} className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                            {pain}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 요약 섹션 */}
                  {summary && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2"><Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" /><span className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide">요약</span></div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{summary}</p>
                    </div>
                  )}
                </div>
                <div className="ml-8 text-center">
                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI 평가</div>
                    <div className="flex items-center space-x-1 justify-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">4/5</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">내 평가</div>
                    <div className="flex items-center space-x-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <button key={i} className="w-4 h-4 transition-colors text-slate-300 dark:text-slate-600 hover:text-blue-400">
                          <Star className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">평가하기</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">노트 내용</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                    onClick={handleEditOpen}
                  >
                    <PenLine className="w-4 h-4" />
                    <span>수정</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                    onClick={handleCopyContent}
                    disabled={copySuccess}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copySuccess ? '복사됨!' : '복사'}</span>
                  </button>
                </div>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap cursor-text">
                  {content}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Link2 className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">연결된 생각들</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">3개 연관 노트</span>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    <span>더 연결하기</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group cursor-pointer p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">💡</span>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">창의성 향상 방법론</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium text-blue-500 bg-blue-100 dark:bg-blue-900/30">키워드 연결</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">3일 전</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">94%</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">연관도</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">창의적 사고를 기르기 위한 체계적 접근법과 일상 습관들...</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                            <Search className="w-3 h-3" />
                            <span>창의성, 사고법 키워드 일치</span>
                        </div>
                        <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">바로가기 →</button>
                    </div>
                </div>
                <div className="group cursor-pointer p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">🎯</span>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">디자인 시스템 구축 경험</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium text-purple-500 bg-purple-100 dark:bg-purple-900/30">가치 연결</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">7일 전</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">87%</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">연관도</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">실무에서 디자인 시스템을 구축하며 겪은 시행착오와 교훈들...</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                            <Heart className="w-3 h-3" />
                            <span>자기 개발 가치 연결</span>
                        </div>
                        <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">바로가기 →</button>
                    </div>
                </div>
                <div className="group cursor-pointer p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">📚</span>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">효율적 학습 루틴</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium text-orange-500 bg-orange-100 dark:bg-orange-900/30">주제 연결</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">5일 전</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">82%</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">연관도</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">지속 가능한 학습 습관을 만들기 위한 개인적 실험과 결과...</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                            <Compass className="w-3 h-3" />
                            <span>성장 주제 연관성</span>
                        </div>
                        <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">바로가기 →</button>
                    </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">다음에 할 수 있는 행동</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                        <Target className="w-8 h-8 mb-3" />
                        <h3 className="font-semibold mb-2">실천 계획으로 연결하기</h3>
                        <p className="text-sm text-purple-100">이 노트를 바탕으로 구체적인 실행 계획을 수립해보세요</p>
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-6 rounded-2xl transition-all duration-200 text-left group">
                        <Eye className="w-8 h-8 mb-3" />
                        <h3 className="font-semibold mb-2">다시 읽기만 하기</h3>
                        <p className="text-sm text-purple-100">내용을 다시 한번 천천히 읽어보며 생각을 정리해보세요</p>
                    </button>
                </div>
            </div>

            {/* 연결된 생각 아래 추천 콘텐츠 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">관련 추천 콘텐츠</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ChevronUp className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="animate-in slide-in-from-top-2 duration-200">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50 mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-300">AI 추천 안내</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">이 노트의 내용을 분석하여 관련성 높은 콘텐츠를 추천해드립니다. 더 깊은 학습과 지식 확장에 도움이 될 수 있습니다.</p>
                </div>
                {/* 추천 콘텐츠 필터/탭 */}
                <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    전체
                    <span className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">{recommendList.length + recommendYoutubeList.length}</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
                    블로그 포스트
                  </button>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
                    생활 노하우
                  </button>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
                    지식 동향
                  </button>
                </div>
                {/* 추천 콘텐츠 목록 */}
                {recommendLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center space-x-2 text-slate-400">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span>AI가 관련 콘텐츠를 분석 중입니다...</span>
                    </div>
                  </div>
                ) : recommendError ? (
                  <div className="text-center py-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <p className="text-red-700 dark:text-red-400 text-sm">{recommendError}</p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline"
                      >
                        다시 시도
                      </button>
                    </div>
                  </div>
                ) : recommendList.length === 0 && recommendYoutubeList.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                      <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">추천할 콘텐츠가 없습니다</p>
                      <p className="text-slate-500 dark:text-slate-500 text-xs">더 많은 메모를 작성하시면 개인화된 추천을 받을 수 있습니다</p>
                    </div>
                  </div>
                ) : (
                  <>
                  {/* 블로그 추천 리스트 */}
                  {recommendList.length > 0 && (
                    <div className="space-y-3 mb-8">
                      <div className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-500" />블로그/포스트 추천</div>
                      {recommendList.map((item, idx) => {
                        const itemId = item.url || item.id || item.title;
                        const isFeedbackDone = feedbackSubmitted.includes(itemId);
                        const isBadFeedbackDone = feedbackBadSubmitted.includes(itemId);
                        return (
                          <div
                            key={idx}
                            className="group cursor-pointer bg-white dark:bg-slate-700/30 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 flex items-start space-x-3 p-3 relative"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={e => {
                                  e.target.src = 'https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg?auto=compress&w=1260&h=750&dpr=1';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                              </div>
                              <div className="absolute top-1 right-1 bg-white/90 dark:bg-slate-800/90 rounded-full p-1">
                                <FileText className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                                  {item.category}
                                </span>
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full">
                                  {item.score}% 매치
                                </span>
                              </div>
                              <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                {item.desc}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
                                    <ExternalLink className="w-3 h-3" />
                                    <span>원문 보기</span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {/* 피드백 남기기/완료/별로예요 표시 */}
                                  {isFeedbackDone ? (
                                    <span className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up w-4 h-4 mr-1"><path d="M7 10v12"></path><path d="M15.5 10.5 17 4.5A2 2 0 0 0 15 2h-2.5a2 2 0 0 0-2 2v6"></path><path d="M7 22h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H7"></path></svg>
                                      피드백 완료
                                    </span>
                                  ) : isBadFeedbackDone ? (
                                    <span className="flex items-center text-red-500 dark:text-red-400 text-xs font-bold">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-4 h-4 mr-1"><path d="M17 14V2"></path><path d="M8.5 13.5 7 19.5A2 2 0 0 0 9 22h2.5a2 2 0 0 0 2-2v-6"></path><path d="M17 2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10"></path></svg>
                                      별로예요
                                    </span>
                                  ) : (
                                    <button
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setFeedbackTarget(item);
                                        setFeedbackModalOpen(true);
                                        setFeedbackStep('choice');
                                        setFeedbackSelected('');
                                        setFeedbackBadSelected('');
                                      }}
                                    >
                                      피드백 남기기
                                    </button>
                                  )}
                                  <button
                                    className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                    onClick={e => {
                                      e.stopPropagation();
                                      // 북마크 기능 추가 가능
                                    }}
                                  >
                                    <Bookmark className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* 유튜브 추천 리스트 */}
                  {recommendYoutubeList.length > 0 && (
                    <div className="space-y-3">
                      <div className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center"><Video className="w-5 h-5 mr-2 text-red-500" />유튜브 추천 영상</div>
                      {/* 유튜브 추천은 최대 5개만 표시 */}
                      {recommendYoutubeList.slice(0, 5).map((item, idx) => {
                        const itemId = item.url || item.video_id || item.title;
                        const isFeedbackDone = feedbackSubmitted.includes(itemId);
                        const isBadFeedbackDone = feedbackBadSubmitted.includes(itemId);
                        return (
                          <div
                            key={idx}
                            className="group cursor-pointer bg-white dark:bg-slate-700/30 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-600/50 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all duration-200 flex items-start space-x-3 p-3 relative"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={e => {
                                  e.target.src = 'https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg?auto=compress&w=1260&h=750&dpr=1';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Video className="w-7 h-7 text-white" />
                              </div>
                              <div className="absolute top-1 right-1 bg-white/90 dark:bg-slate-800/90 rounded-full p-1">
                                <Video className="w-4 h-4 text-red-500" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-red-500 dark:text-red-400 font-medium capitalize">YouTube</span>
                              </div>
                              <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-tight">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                {item.desc}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-red-500 dark:text-red-400 hover:underline flex items-center space-x-1">
                                    <ExternalLink className="w-3 h-3" />
                                    <span>유튜브로 보기</span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {/* 피드백 남기기/완료/별로예요 표시 */}
                                  {isFeedbackDone ? (
                                    <span className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up w-4 h-4 mr-1"><path d="M7 10v12"></path><path d="M15.5 10.5 17 4.5A2 2 0 0 0 15 2h-2.5a2 2 0 0 0-2 2v6"></path><path d="M7 22h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H7"></path></svg>
                                      피드백 완료
                                    </span>
                                  ) : isBadFeedbackDone ? (
                                    <span className="flex items-center text-red-500 dark:text-red-400 text-xs font-bold">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-4 h-4 mr-1"><path d="M17 14V2"></path><path d="M8.5 13.5 7 19.5A2 2 0 0 0 9 22h2.5a2 2 0 0 0 2-2v-6"></path><path d="M17 2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10"></path></svg>
                                      별로예요
                                    </span>
                                  ) : (
                                    <button
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setFeedbackTarget(item);
                                        setFeedbackModalOpen(true);
                                        setFeedbackStep('choice');
                                        setFeedbackSelected('');
                                        setFeedbackBadSelected('');
                                      }}
                                    >
                                      피드백 남기기
                                    </button>
                                  )}
                                  <button
                                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    onClick={e => {
                                      e.stopPropagation();
                                      // 북마크 기능 추가 가능
                                    }}
                                  >
                                    <Bookmark className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  </>
                )}
                {recommendList.length > 0 && recommendYoutubeList.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                        <Brain className="w-4 h-4" />
                        <span>총 {recommendList.length + recommendYoutubeList.length}개의 관련 콘텐츠를 찾았습니다</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">AI 분석</h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ChevronUp className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">핵심 키워드</h4>
                  <div className="flex flex-wrap gap-2">
                    {keywordList.length > 0 ? (
                      keywordList.map((kw, idx) => (
                        <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">{kw}</span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">키워드 정보 없음</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">연관 주제</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>생산성</span></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>학습</span></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>성장</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">제안 행동</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>실행 계획 수립하기</span>
                    </div>
                     <div className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>관련 콘텐츠 탐색하기</span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>후속 노트 작성하기</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-green-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white">가치 흐름</h3>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-green-900 dark:text-green-300">실행 제안</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white/70 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">실천 계획 작성</span>
                  </div>
                </button>
                <button className="w-full p-3 bg-white/70 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">루틴화 제안</span>
                  </div>
                </button>
                <button className="w-full p-3 bg-white/70 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left">
                    <div className="flex items-center space-x-3">
                        <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">추천 노트 보기</span>
                    </div>
                </button>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
              <Target className="w-5 h-5" />
              <span>실천 계획으로 전환하기</span>
            </button>
          </div>
        </div>
      </div>
      {/* 노트 수정 모달 */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">노트 업데이트</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">현재 생각을 반영하여 노트를 업데이트해보세요.</p>
            <textarea
              className="w-full p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              rows={12}
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
            />
            {editError && <div className="text-red-500 text-sm mt-2">{editError}</div>}
            <div className="flex space-x-3 mt-4">
              <button
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                onClick={handleEditCancel}
                disabled={editSaving}
              >취소</button>
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                onClick={handleEditSave}
                disabled={editSaving || !editContent.trim()}
              >{editSaving ? '저장 중...' : '업데이트 저장'}</button>
            </div>
          </div>
        </div>
      )}
      {/* 피드백 모달 */}
      {feedbackModalOpen && feedbackTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">콘텐츠 피드백</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={closeFeedbackModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            {/* 1단계: 좋아요/별로예요 선택 */}
            {feedbackStep === 'choice' && (
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  <span className="font-medium text-slate-900 dark:text-white">"{feedbackTarget.title || '노트 관련 추천 콘텐츠'}"</span>에 대한 피드백을 남겨주세요.<br />더 나은 추천을 위해 소중한 의견을 활용하겠습니다.
                </p>
                <div className="space-y-4">
                  <button
                    className="w-full flex items-center space-x-3 p-4 border rounded-xl transition-colors text-left bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 hover:bg-green-100 dark:hover:bg-green-900/30"
                    onClick={() => setFeedbackStep('good')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up w-6 h-6 text-green-600 dark:text-green-400" style={{minWidth:'24px'}}><path d="M7 10v12"></path><path d="M15.5 10.5 17 4.5A2 2 0 0 0 15 2h-2.5a2 2 0 0 0-2 2v6"></path><path d="M7 22h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H7"></path></svg>
                    <div>
                      <div className="font-bold text-green-700 dark:text-green-300">좋아요</div>
                      <div className="text-sm text-green-700 dark:text-green-300">이 콘텐츠가 도움이 되었어요</div>
                    </div>
                  </button>
                  <button
                    className="w-full flex items-center space-x-3 p-4 border rounded-xl transition-colors text-left bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => setFeedbackStep('bad_detail')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-6 h-6 text-red-500 dark:text-red-400" style={{minWidth:'24px'}}><path d="M17 14V2"></path><path d="M8.5 13.5 7 19.5A2 2 0 0 0 9 22h2.5a2 2 0 0 0 2-2v-6"></path><path d="M17 2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10"></path></svg>
                    <div>
                      <div className="font-bold text-red-500 dark:text-red-400">별로예요</div>
                      <div className="text-sm text-red-500 dark:text-red-400">이 콘텐츠가 적합하지 않아요</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {/* 2단계: 상세 피드백(좋아요) */}
            {feedbackStep === 'good' && (
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  <span className="font-medium text-slate-900 dark:text-white">"{feedbackTarget.title || '노트 관련 추천 콘텐츠'}"</span>에 대한 피드백을 남겨주세요. 더 나은 추천을 위해 소중한 의견을 활용하겠습니다.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="font-medium text-slate-900 dark:text-white">어떤 점이 좋았나요?</span>
                  </div>
                  <button
                    className={`w-full flex items-center space-x-3 p-4 border rounded-xl transition-colors text-left ${feedbackSelected === 'like' ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-400' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:bg-green-50/50 dark:hover:bg-green-900/10 hover:border-green-200 dark:hover:border-green-800/50'}`}
                    onClick={() => setFeedbackSelected('like')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open w-5 h-5 text-green-600 dark:text-green-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    <div className="font-medium text-slate-900 dark:text-white">이런 콘텐츠 더 보고 싶어요</div>
                  </button>
                  <button
                    className={`w-full flex items-center space-x-3 p-4 border rounded-xl transition-colors text-left ${feedbackSelected === 'remind' ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-400' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:bg-green-50/50 dark:hover:bg-green-900/10 hover:border-green-200 dark:hover:border-green-800/50'}`}
                    onClick={() => setFeedbackSelected('remind')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-5 h-5 text-green-600 dark:text-green-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <div className="font-medium text-slate-900 dark:text-white">나중에 다시 보고 싶어요</div>
                  </button>
                  <button
                    className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${feedbackSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                    disabled={!feedbackSelected}
                    onClick={handleFeedbackSubmit}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5 inline-block mr-2 align-middle"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                    피드백 제출
                  </button>
                </div>
              </div>
            )}
            {/* 2단계: 상세 피드백(별로예요) */}
            {feedbackStep === 'bad_detail' && (
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  <span className="font-medium text-slate-900 dark:text-white">"{feedbackTarget.title || '노트 관련 추천 콘텐츠'}"</span>에 대한 피드백을 남겨주세요. 더 나은 추천을 위해 소중한 의견을 활용하겠습니다.
                </p>
                <div className="mb-4 font-medium text-slate-900 dark:text-white">어떤 점이 별로였나요?</div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {badReasons.map(reason => (
                    <button
                      key={reason.key}
                      className={`flex items-center space-x-2 p-3 rounded-xl border transition-colors text-sm font-medium justify-center ${feedbackBadSelected === reason.key ? 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-400 text-red-600 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:bg-red-50/50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800/50 text-slate-700 dark:text-slate-300'}`}
                      onClick={() => setFeedbackBadSelected(reason.key)}
                    >
                      <span className="text-lg">{reason.icon}</span>
                      <span>{reason.label}</span>
                    </button>
                  ))}
                </div>
                {/* '기타(직접 입력)' 선택 시에만 의견 입력란 노출 */}
                {feedbackBadSelected === 'etc' && (
                  <textarea
                    className="w-full p-3 mb-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    rows={3}
                    placeholder="의견을 자유롭게 입력해주세요..."
                    value={feedbackBadEtcText}
                    onChange={e => setFeedbackBadEtcText(e.target.value)}
                  />
                )}
                <button
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 ${feedbackBadSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                  disabled={!feedbackBadSelected}
                  onClick={handleBadFeedbackSubmit}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5 inline-block mr-2 align-middle"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                  피드백 제출
                </button>
              </div>
            )}
            {/* 3단계: 별로예요(간단 메시지 or 닫기) */}
            {feedbackStep === 'bad' && (
              <div className="p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-10 h-10 mx-auto mb-4 text-red-500 dark:text-red-400"><path d="M17 14V2"></path><path d="M8.5 13.5 7 19.5A2 2 0 0 0 9 22h2.5a2 2 0 0 0 2-2v-6"></path><path d="M17 2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10"></path></svg>
                <div className="font-bold text-red-500 dark:text-red-400 mb-2">아쉬운 콘텐츠였군요</div>
                <div className="text-slate-600 dark:text-slate-400 mb-6">더 나은 추천을 위해 의견을 반영하겠습니다.</div>
                <button className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={closeFeedbackModal}>닫기</button>
              </div>
            )}
          </div>
        </div>
      )}
      <FloatingActionButtons onPanelOpen={() => setShowDim(true)} onPanelClose={() => setShowDim(false)} />
    </div>
  );
};

export default NoteDetail; 