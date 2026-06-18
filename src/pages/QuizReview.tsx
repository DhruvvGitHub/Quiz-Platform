import { Navigate, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { CheckCircle2, XCircle, ArrowLeft, Info } from 'lucide-react';

export const QuizReview = () => {
  const navigate = useNavigate();
  const { settings, questions, userAnswers } = useQuizStore();

  if (!settings || questions.length === 0) {
    return <Navigate to="/setup" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/result')}
          className="p-2 hover:bg-surface-hover rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Review Answers</h1>
          <p className="text-sm text-text-muted">{settings.subject} • {questions.length} Questions</p>
        </div>
      </header>

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const uA = userAnswers[idx];
          const isCorrect = uA === q.correctAnswer;
          const isUnattempted = uA === undefined;

          return (
            <div key={q.id} className="glass-panel p-6 rounded-2xl border-t-4 border-t-surface relative overflow-hidden">
              {/* Top border color indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                isCorrect ? 'bg-emerald-500' : isUnattempted ? 'bg-amber-500' : 'bg-error'
              }`} />

              <div className="flex gap-4 mb-6">
                <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                  isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 
                  isUnattempted ? 'bg-amber-500/20 text-amber-400' : 'bg-error/20 text-error'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-medium leading-relaxed">{q.question}</h3>
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-surface-hover rounded text-text-muted">
                    Topic: {q.topic}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pl-12 mb-6">
                {q.options.map((opt, optIdx) => {
                  const isUserSelection = uA === optIdx;
                  const isActualCorrect = q.correctAnswer === optIdx;

                  let style = "bg-surface border-white/5 text-text-muted";
                  let icon = null;

                  if (isActualCorrect) {
                    style = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium";
                    icon = <CheckCircle2 className="w-5 h-5" />;
                  } else if (isUserSelection && !isActualCorrect) {
                    style = "bg-error/10 border-error/50 text-error/90 line-through";
                    icon = <XCircle className="w-5 h-5" />;
                  }

                  return (
                    <div key={optIdx} className={`p-3 rounded-lg border flex justify-between items-center ${style}`}>
                      <span>{opt}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>

              <div className="ml-12 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <h4 className="flex items-center gap-2 text-primary font-semibold mb-2">
                  <Info className="w-4 h-4" /> Explanation
                </h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
