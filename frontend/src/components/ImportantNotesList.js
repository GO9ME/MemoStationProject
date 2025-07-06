import React from 'react';
import { AlertCircle, Calendar, Eye, Heart, ArrowRight } from 'lucide-react';

// 다시 확인할 중요한 노트 리스트
export default function ImportantNotesList({ notes }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">📝 다시 확인할 중요한 노트</h2>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">더보기</button>
      </div>
      <div className="space-y-4">
        {notes.map((note, idx) => (
          <div key={idx} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{note.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{note.title}</h3>
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">{note.tag}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-1">{note.desc}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>작성일: {note.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                    <Eye className="w-3 h-3" />
                    <span>최근 열람: {note.lastViewed}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span>중요도: {note.importance}%</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500 self-center flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 