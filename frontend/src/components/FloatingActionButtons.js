import React, { useState, useEffect } from 'react';

// 오른쪽 하단 단일 메시지 플로팅 버튼
const FloatingActionButtons = ({ onPanelOpen, onPanelClose }) => {
  const [open, setOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showConceptCard, setShowConceptCard] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showRemind, setShowRemind] = useState(false);
  const [showConceptCardResult, setShowConceptCardResult] = useState(false);
  const [showRemindResult, setShowRemindResult] = useState(false);
  const [chatInput, setChatInput] = useState(""); // AI 어시스턴트 입력값 상태

  // 패널 오픈/닫기 시 부모에 dim 처리 신호 전달
  useEffect(() => {
    if (showChat || showConceptCard || showAnalysis || showRemind || showConceptCardResult || showRemindResult) {
      onPanelOpen && onPanelOpen();
    } else {
      onPanelClose && onPanelClose();
    }
  }, [showChat, showConceptCard, showAnalysis, showRemind, showConceptCardResult, showRemindResult, onPanelOpen, onPanelClose]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 노트 인사이트 분석 패널 */}
      {showAnalysis && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-purple-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              <h3 className="font-bold text-slate-900 dark:text-white">AI 어시스턴트</h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowAnalysis(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blue-600 text-white">
                <p className="text-sm whitespace-pre-line">이 내용을 분석해줘</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <p className="text-sm whitespace-pre-line">"Design System Thoughts" 노트 분석 결과:

1. 핵심 주제: 창의성과 일관성의 균형
2. 감정 톤: 사색적, 분석적
3. 연결 가능한 주제: 디자인 시스템, 사용자 경험, 혁신
4. 실행 가능성: 중간 (구체적 적용 방안 필요)</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <textarea placeholder="메시지를 입력하세요..." className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm" rows={2}></textarea>
              <button disabled className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 개념 요약 카드 모달 */}
      {showConceptCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">개념 요약 카드</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowConceptCard(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Design System Thoughts</h4>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">요약 카드</div>
              </div>
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">핵심 개념</h5>
                <div className="bg-white/70 dark:bg-slate-700/30 rounded-xl p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300">디자인 시스템에서 일관성과 창의성의 균형을 유지하는 것은 사용자 경험의 예측 가능성과 혁신 사이의 적절한 지점을 찾는 과정입니다.</p>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">핵심 키워드</h5>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">디자인 시스템</span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">일관성</span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">창의성</span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">사용자 경험</span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">혁신</span>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">주요 포인트</h5>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-4 h-4 text-green-500 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <p className="text-xs text-slate-700 dark:text-slate-300">일관된 디자인 시스템은 사용자 경험의 예측 가능성을 높입니다.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-4 h-4 text-green-500 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <p className="text-xs text-slate-700 dark:text-slate-300">창의적 요소는 사용자 참여도와 만족도를 향상시킵니다.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-4 h-4 text-green-500 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <p className="text-xs text-slate-700 dark:text-slate-300">균형점을 찾는 것이 성공적인 디자인 시스템의 핵심입니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-4 h-4 text-green-600 dark:text-green-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <span className="text-sm font-bold text-green-900 dark:text-green-300">활용 방법</span>
              </div>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <p>• 학습 자료로 활용하여 빠르게 복습</p>
                <p>• 관련 프로젝트나 보고서에 첨부</p>
                <p>• 팀원들과 공유하여 지식 전파</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={() => setShowConceptCard(false)}>취소</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2" onClick={() => { setShowConceptCard(false); setShowConceptCardResult(true); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-4 h-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                <span>카드 생성하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 개념 요약 카드 생성 결과 패널 */}
      {showConceptCardResult && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-purple-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              <h3 className="font-bold text-slate-900 dark:text-white">AI 어시스턴트</h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowConceptCardResult(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blue-600 text-white">
                <p className="text-sm whitespace-pre-line">이 노트의 개념 요약 카드를 만들어줘</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <p className="text-sm whitespace-pre-line">개념 요약 카드가 생성되었습니다! 다운로드하거나 노트에 첨부하실 수 있습니다.</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <textarea placeholder="메시지를 입력하세요..." className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm" rows={2}></textarea>
              <button disabled className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI 어시스턴트 챗 패널 */}
      {showChat && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-purple-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              <h3 className="font-bold text-slate-900 dark:text-white">AI 어시스턴트</h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowChat(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-12 h-12 mx-auto mb-3 opacity-50"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585-.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
              <p className="text-sm">이 콘텐츠에 대해 질문해보세요</p>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <textarea
                placeholder="메시지를 입력하세요..."
                className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm"
                rows={2}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button
                disabled={!chatInput.trim()}
                className={`p-3 rounded-xl transition-colors ${chatInput.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-300 dark:bg-slate-600 text-white'}`}
                onClick={() => {
                  // 메시지 전송 로직(추후 구현)
                  setChatInput(""); // 입력창 비우기
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 나중에 다시 보기 팝업 */}
      {showRemind && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">나중에 다시 보기</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowRemind(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">이 노트를 나중에 다시 볼 수 있도록 리마인드를 설정해보세요.</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">날짜 선택</label>
                <input type="date" className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" value="" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">시간 선택</label>
                <input type="time" className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50" value="" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">메모 (선택사항)</label>
                <textarea placeholder="리마인드 받을 때 함께 볼 메모를 남겨보세요..." className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" rows={3}></textarea>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell w-4 h-4 text-blue-600 dark:text-blue-400"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-300">리마인드 방식</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">설정한 시간에 알림을 통해 이 노트를 다시 볼 수 있도록 안내해드립니다.</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onClick={() => setShowRemind(false)}>취소</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2" onClick={() => { setShowRemind(false); setShowRemindResult(true); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell w-4 h-4"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <span>리마인드 설정</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 리마인드 설정 결과 패널 */}
      {showRemindResult && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-purple-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              <h3 className="font-bold text-slate-900 dark:text-white">AI 어시스턴트</h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setShowRemindResult(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blue-600 text-white">
                <p className="text-sm whitespace-pre-line">Design System Thoughts 노트를 2025년 7월 2일 오후 12:42에 다시 알려줘</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <p className="text-sm whitespace-pre-line">알겠습니다! "Design System Thoughts" 노트를 2025년 7월 2일 오후 12:42에 리마인드 해드리겠습니다. 메모: 없음</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <textarea placeholder="메시지를 입력하세요..." className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm" rows={2}></textarea>
              <button disabled className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
          </button>
            </div>
          </div>
        </div>
      )}
      {/* 플로팅 버튼 그룹 */}
      {!showChat && !showAnalysis && !showRemind && !showConceptCardResult && !showRemindResult && open && (
        <div className="absolute bottom-20 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
        {/* 노트 인사이트 분석 */}
        <div className="flex items-center space-x-3">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-4 py-3 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap">
              <div className="font-medium text-sm">노트 인사이트 분석</div>
            </div>
            <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group" onClick={() => setShowAnalysis(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain w-6 h-6 group-hover:scale-110 transition-transform"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585-.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
            </button>
          </div>
          {/* 나중에 다시 보기 */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-4 py-3 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap">
              <div className="font-medium text-sm">나중에 다시 보기</div>
            </div>
            <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group" onClick={() => setShowRemind(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell w-6 h-6 group-hover:scale-110 transition-transform"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
            </button>
          </div>
          {/* 참고 콘텐츠 추천 */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-4 py-3 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap">
              <div className="font-medium text-sm">참고 콘텐츠 추천</div>
            </div>
            <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link w-6 h-6 group-hover:scale-110 transition-transform"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
            </button>
          </div>
          {/* 개념 요약 카드 생성 */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-4 py-3 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap">
              <div className="font-medium text-sm">개념 요약 카드 생성</div>
            </div>
            <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group" onClick={() => setShowConceptCard(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-6 h-6 group-hover:scale-110 transition-transform"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
          </button>
        </div>
        {/* AI와 대화하기 */}
        <div className="flex items-center space-x-3">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-4 py-3 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap">
              <div className="font-medium text-sm">AI와 대화하기</div>
            </div>
            <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group" onClick={() => setShowChat(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-6 h-6 group-hover:scale-110 transition-transform"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
          </button>
          </div>
        </div>
      )}
      {/* 플로팅 토글/닫기 버튼 */}
      <button
        className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        aria-label={open ? "플로팅 버튼 닫기" : "플로팅 버튼 열기"}
        onClick={() => { setOpen((v) => !v); setShowChat(false); setShowConceptCard(false); setShowAnalysis(false); setShowRemind(false); setShowConceptCardResult(false); setShowRemindResult(false); }}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-7 h-7 group-hover:rotate-90 transition-transform duration-200 relative z-10"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-7 h-7 group-hover:scale-110 transition-transform duration-200 relative z-10"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
        )}
      </button>
    </div>
  );
};

export default FloatingActionButtons; 