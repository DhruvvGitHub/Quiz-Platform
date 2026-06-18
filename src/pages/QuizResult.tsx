import { Navigate, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { Target, CheckCircle2, XCircle, RotateCcw, Eye, Clock } from 'lucide-react';

export const QuizResult = () => {
  const navigate = useNavigate();
  const { settings, questions, userAnswers, timeElapsed, resetQuiz } = useQuizStore();

  if (!settings || questions.length === 0) {
    return <Navigate to="/setup" />;
  }

  // Calculate stats
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  questions.forEach((q, idx) => {
    const uA = userAnswers[idx];
    if (uA === undefined) unattempted++;
    else if (uA === q.correctAnswer) correct++;
    else wrong++;
  });

  const percentage = Math.round((correct / questions.length) * 100);

  // Determine feedback message
  let feedback = '';
  let colorClass = '';
  if (percentage >= 90) {
    feedback = 'Excellent Work!';
    colorClass = 'text-emerald-500';
  } else if (percentage >= 70) {
    feedback = 'Good Job!';
    colorClass = 'text-blue-400';
  } else if (percentage >= 50) {
    feedback = 'Keep Practicing.';
    colorClass = 'text-amber-400';
  } else {
    feedback = 'Needs Improvement.';
    colorClass = 'text-error';
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleFinish = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pt-8">
      
      <div className="glass-panel p-10 rounded-3xl text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${colorClass.replace('text-', 'bg-')}`}></div>
        
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-2">
          {settings.subject} • Quiz Complete
        </h2>
        
        <h1 className={`text-4xl md:text-5xl font-black mb-8 ${colorClass}`}>
          {feedback}
        </h1>

        <div className="flex justify-center items-end gap-2 mb-12">
          <span className="text-7xl font-bold leading-none">{percentage}</span>
          <span className="text-3xl text-text-muted font-medium mb-1">%</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <StatBox title="Score" value={`${correct} / ${questions.length}`} icon={<Target className="text-primary w-5 h-5" />} bg="bg-primary/10" />
          <StatBox title="Correct" value={correct.toString()} icon={<CheckCircle2 className="text-emerald-500 w-5 h-5" />} bg="bg-emerald-500/10" />
          <StatBox title="Wrong" value={wrong.toString()} icon={<XCircle className="text-error w-5 h-5" />} bg="bg-error/10" />
          <StatBox title="Time" value={formatTime(timeElapsed)} icon={<Clock className="text-amber-500 w-5 h-5" />} bg="bg-amber-500/10" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/review')}
          className="flex items-center justify-center gap-2 py-4 px-8 bg-surface hover:bg-surface-hover border border-white/10 text-white rounded-xl font-bold transition-all"
        >
          <Eye className="w-5 h-5" /> Review Answers
        </button>
        <button
          onClick={handleFinish}
          className="flex items-center justify-center gap-2 py-4 px-8 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <RotateCcw className="w-5 h-5" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, icon, bg }: { title: string, value: string, icon: React.ReactNode, bg: string }) => (
  <div className="bg-surface/50 border border-white/5 p-4 rounded-2xl flex flex-col items-start gap-3">
    <div className={`p-2 rounded-lg ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);
