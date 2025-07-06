import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import NoteDetail from './pages/NoteDetail';
import ManageIntegration from './pages/ManageIntegration';
import StrategyContent from './pages/StrategyContent';
import PracticeDashboard from './pages/PracticeDashboard';
import FloatingActionButtons from './components/FloatingActionButtons';
import NoteNew from './pages/NoteNew';
import NoteEnhanced from './pages/NoteEnhanced';
import SemanticSearch from './pages/SemanticSearch';
import FeedbackHistory from './pages/FeedbackHistory';
import Reports from './pages/Reports';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // 다크모드 설정 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 다크모드 토글
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 플로팅 버튼을 보여줄 경로 목록 (정규식)
  const showFloating = [
    /^\/notes\/new$/,
    /^\/notes\/enhanced$/,
    /^\/notes\/[a-zA-Z0-9_-]+$/
  ];
  const shouldShowFloating = showFloating.some((regex) => regex.test(location.pathname));

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {shouldShowFloating && <FloatingActionButtons />}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:noteId" element={<NoteDetail />} />
          <Route path="/notes/new" element={<NoteNew />} />
          <Route path="/notes/enhanced" element={<NoteEnhanced />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/strategy-content" element={<StrategyContent />} />
            <Route path="/practice-dashboard" element={<PracticeDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integration/:integrationId" element={<ManageIntegration />} />
          <Route path="/semantic-search" element={<SemanticSearch />} />
          <Route path="/feedback-history" element={<FeedbackHistory />} />
          </Routes>
        </main>
      </div>
  );
}

export default App; 