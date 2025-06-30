import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Tag,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  TrendingUp,
  Users
} from 'lucide-react';

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // 가상 노트 데이터
  const notes = [
    {
      id: 1,
      title: '창의성에 대한 고민',
      content: '창의적인 아이디어가 나오지 않을 때의 답답함과 그것을 극복하는 방법에 대해 생각해보았다. 때로는 휴식이 필요하고, 새로운 환경에서의 영감이 중요하다는 것을 깨달았다.',
      tags: ['창의성', '문제해결', '성장'],
      emoji: '🤔',
      importance: 85,
      relatedNotes: 3,
      createdAt: '12일 전',
      lastModified: '5일 전',
      starred: true,
      readTime: 3
    },
    {
      id: 2,
      title: '새로운 도전에 대한 두려움',
      content: '안전한 길과 도전적인 길 사이에서의 고민, 실패에 대한 두려움을 어떻게 극복할 것인가? 작은 성취들을 쌓아가며 자신감을 키워나가는 것이 중요하다.',
      tags: ['도전', '두려움', '성장', '자신감'],
      emoji: '😰',
      importance: 92,
      relatedNotes: 5,
      createdAt: '8일 전',
      lastModified: '2일 전',
      starred: true,
      readTime: 4
    },
    {
      id: 3,
      title: '오늘의 영감 노트',
      content: '산책 중에 떠오른 아이디어들을 빠르게 기록한다. 자연에서 얻는 평온함과 새로운 관점들이 마음을 정리하는데 도움이 된다.',
      tags: ['영감', '아이디어', '자연', '평온'],
      emoji: '💡',
      importance: 78,
      relatedNotes: 2,
      createdAt: '1일 전',
      lastModified: '1일 전',
      starred: false,
      readTime: 2
    },
    {
      id: 4,
      title: '학습 방법론 정리',
      content: '효과적인 학습을 위한 여러 방법론들을 정리했다. 포모도로 기법, 능동적 복습, 교차 학습 등이 특히 효과적임을 확인했다.',
      tags: ['학습', '방법론', '효율성'],
      emoji: '📚',
      importance: 88,
      relatedNotes: 4,
      createdAt: '3일 전',
      lastModified: '1일 전',
      starred: true,
      readTime: 5
    },
    {
      id: 5,
      title: '마음챙김 연습 일지',
      content: '명상과 마음챙김 연습을 통해 얻은 인사이트들을 기록한다. 현재 순간에 집중하는 것의 중요성과 감정을 관찰하는 방법들.',
      tags: ['마음챙김', '명상', '감정', '현재'],
      emoji: '🧘',
      importance: 82,
      relatedNotes: 3,
      createdAt: '6일 전',
      lastModified: '4일 전',
      starred: false,
      readTime: 3
    }
  ];

  // 필터링된 노트
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'starred') return matchesSearch && note.starred;
    if (selectedFilter === 'recent') return matchesSearch && note.createdAt.includes('일');
    return matchesSearch;
  });

  // 새 노트 생성
  const handleCreateNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      // 여기서 실제로는 API 호출
      console.log('새 노트 생성:', { title: newNoteTitle, content: newNoteContent });
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNewNoteModal(false);
    }
  };

  const filters = [
    { key: 'all', label: '전체', count: notes.length },
    { key: 'starred', label: '즐겨찾기', count: notes.filter(n => n.starred).length },
    { key: 'recent', label: '최근', count: notes.filter(n => n.createdAt.includes('일')).length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">내 노트</h1>
              <p className="text-gray-600 dark:text-gray-400">생각을 기록하고 정리하세요</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNewNoteModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>새 노트</span>
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색바 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="노트 제목, 내용, 태그로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-colors text-gray-900 dark:text-white"
              />
            </div>

            {/* 필터 버튼들 */}
            <div className="flex items-center space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedFilter === filter.key
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 노트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card p-6 hover:shadow-md transition-shadow group">
              {/* 노트 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{note.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{note.createdAt}</span>
                      <span>•</span>
                      <span>{note.readTime}분 읽기</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {note.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* 노트 내용 */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {note.content}
              </p>

              {/* 태그 */}
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* 노트 통계 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>중요도 {note.importance}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{note.relatedNotes}개 연관</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Edit className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredNotes.length === 0 && (
          <div className="card p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? '검색 결과가 없습니다' : '노트가 없습니다'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? '다른 검색어로 시도해보세요' : '첫 번째 노트를 작성해보세요'}
              </p>
              <button 
                onClick={() => setShowNewNoteModal(true)}
                className="btn-primary"
              >
                새 노트 작성
              </button>
            </div>
          </div>
        )}

        {/* 새 노트 모달 */}
        {showNewNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">새 노트 작성</h2>
                <button 
                  onClick={() => setShowNewNoteModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="노트 제목을 입력하세요"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    내용
                  </label>
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="생각을 자유롭게 기록하세요..."
                    rows={8}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowNewNoteModal(false)}
                  className="btn-secondary"
                >
                  취소
                </button>
                <button 
                  onClick={handleCreateNote}
                  className="btn-primary"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes; 