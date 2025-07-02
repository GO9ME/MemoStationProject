import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Explore from './pages/Explore';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NoteDetail from './pages/NoteDetail';
import ManageIntegration from './pages/ManageIntegration';
import FloatingActionButtons from './components/FloatingActionButtons';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <FloatingActionButtons />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:noteId" element={<NoteDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integration/:integrationId" element={<ManageIntegration />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 