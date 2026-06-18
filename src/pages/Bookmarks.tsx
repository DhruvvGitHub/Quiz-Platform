import { useStatsStore } from '../store/useStatsStore';
import { BookMarked, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Bookmarks = () => {
  const { bookmarks, toggleBookmark } = useStatsStore();

  const safeBookmarks = bookmarks || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookMarked className="w-8 h-8 text-primary" /> Bookmarked Questions
        </h1>
        <p className="text-text-muted">Review questions you've saved for later study.</p>
      </header>

      {safeBookmarks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center mt-12">
          <BookMarked className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-medium text-text mb-2">No bookmarks yet</h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">You haven't saved any questions. Start a quiz and click the flag icon to bookmark important questions.</p>
          <Link to="/setup" className="inline-flex items-center gap-2 py-3 px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            Start a Quiz <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {safeBookmarks.map((bookmark, idx) => (
            <div key={`${bookmark.subject}-${bookmark.question.id}-${idx}`} className="glass-panel p-6 rounded-2xl relative">
              <button 
                onClick={() => toggleBookmark(bookmark.subject, bookmark.question)}
                className="absolute top-6 right-6 p-2 bg-error/10 hover:bg-error/20 text-error rounded-full transition-colors"
                title="Remove Bookmark"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="pr-12 mb-6">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-bold bg-surface-hover px-2 py-1 rounded text-text-muted uppercase tracking-wider">
                    {bookmark.subject}
                  </span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider py-1 block">
                    Topic: {bookmark.question.topic}
                  </span>
                </div>
                <h3 className="text-xl font-medium leading-relaxed">{bookmark.question.question}</h3>
              </div>

              <div className="space-y-2 mb-6">
                {bookmark.question.options.map((opt, optIdx) => {
                  const isCorrect = bookmark.question.correctAnswer === optIdx;
                  return (
                    <div key={optIdx} className={`p-3 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium' : 'bg-surface border-white/5 text-text-muted'}`}>
                      {opt}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <h4 className="font-semibold text-primary mb-1">Explanation</h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  {bookmark.question.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
