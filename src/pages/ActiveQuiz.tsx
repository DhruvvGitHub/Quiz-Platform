import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { useStatsStore } from '../store/useStatsStore';
import { Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Flag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const ActiveQuiz = () => {
  const navigate = useNavigate();
  const { 
    isActive, settings, questions, currentIndex, userAnswers, timeElapsed, 
    answerQuestion, nextQuestion, prevQuestion, tickTimer, endQuiz 
  } = useQuizStore();
  const { addAttempt, toggleBookmark, bookmarks } = useStatsStore();
  
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      tickTimer();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, tickTimer]);

  // Reset explanation view when question changes
  useEffect(() => {
    if (settings?.mode === 'practice' && userAnswers[currentIndex] !== undefined) {
      setShowExplanation(true);
    } else {
      setShowExplanation(false);
    }
  }, [currentIndex, settings?.mode, userAnswers]);

  if (!isActive || !settings || questions.length === 0) {
    return <Navigate to="/setup" />;
  }

  const currentQuestion = questions[currentIndex];
  const selectedOptionIndex = userAnswers[currentIndex];
  const isAnswered = selectedOptionIndex !== undefined;
  const isPracticeMode = settings.mode === 'practice';
  const isBookmarked = (bookmarks || []).some(b => b.subject === settings.subject && b.question.id === currentQuestion.id);

  const handleOptionSelect = (index: number) => {
    if (isPracticeMode && isAnswered) return; // Prevent changing answer in practice mode
    answerQuestion(currentIndex, index);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    
    if (isPracticeMode) {
      setShowExplanation(true);
      
      if (isCorrect) {
        setTimeout(() => {
          nextQuestion();
        }, 1200); // Give user a moment to see they got it right
      }
    } else {
      // For mock mode, we apply the same logic since the user requested it specifically.
      // If they don't want it in mock mode, they can clarify, but we will auto advance in mock mode too to strictly follow instructions.
      if (isCorrect) {
        setTimeout(() => {
          nextQuestion();
        }, 1200);
      }
    }
  };

  const handleSubmit = () => {
    // Calculate Score
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    
    questions.forEach((q, idx) => {
      const uA = userAnswers[idx];
      if (uA === undefined) unattempted++;
      else if (uA === q.correctAnswer) correct++;
      else wrong++;
    });

    const attemptId = uuidv4();
    addAttempt({
      id: attemptId,
      timestamp: Date.now(),
      subject: settings.subject,
      score: correct,
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattempted,
      timeElapsed,
    });

    endQuiz(); // Turn off active state, but keep data in store for result page
    navigate('/result');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-surface-hover rounded-full text-xs font-semibold tracking-wider text-text-muted uppercase">
            {settings.subject} • {settings.mode}
          </span>
          <span className="text-sm font-medium text-text-muted hidden md:inline-block">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-primary font-mono text-lg bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          <Clock className="w-5 h-5" />
          {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto pb-24 space-y-6">
        <div className="glass-panel p-6 md:p-8 rounded-3xl relative">
          <button 
            onClick={() => toggleBookmark(settings.subject, currentQuestion)}
            className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
              isBookmarked ? 'bg-amber-500/20 text-amber-500' : 'bg-surface hover:bg-surface-hover text-text-muted'
            }`}
            title="Bookmark Question"
          >
            <Flag className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          
          <div className="pr-12 mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
              Topic: {currentQuestion.topic}
            </span>
            <h2 className="text-xl md:text-2xl font-medium leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              
              let stylingClass = 'bg-surface border-white/5 hover:border-primary/50 text-text hover:bg-surface-hover';
              
              if (isSelected) {
                stylingClass = 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(59,130,246,0.15)] text-white';
              }
              
              if (isPracticeMode && showExplanation) {
                if (isCorrect) {
                  stylingClass = 'bg-emerald-500/20 border-emerald-500 text-white';
                } else if (isSelected && !isCorrect) {
                  stylingClass = 'bg-error/20 border-error text-white opacity-70';
                } else {
                  stylingClass = 'bg-surface/50 border-white/5 opacity-50 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isPracticeMode && showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${stylingClass}`}
                >
                  <span>{option}</span>
                  {isPracticeMode && showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {isPracticeMode && showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-error" />}
                </button>
              );
            })}
          </div>

          {/* Explanation in Practice Mode */}
          {isPracticeMode && showExplanation && (
            <div className="mt-8 p-5 bg-surface-hover/80 border border-white/10 rounded-xl animate-in fade-in slide-in-from-top-2">
              <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <InfoIcon /> Explanation
              </h4>
              <p className="text-text-muted leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed md:absolute bottom-0 left-0 md:left-auto right-0 p-4 md:p-0 md:pt-4 bg-background md:bg-transparent border-t border-white/10 md:border-t-0 flex justify-between items-center z-10 w-full md:w-auto">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 py-3 px-5 rounded-xl font-medium text-text-muted hover:text-white hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        {/* Question Pallete Button (Mobile) - Could be expanded later */}
        <div className="md:hidden text-sm font-medium text-text-muted">
          {currentIndex + 1} / {questions.length}
        </div>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            Submit Quiz <CheckCircle2 className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={isPracticeMode && !showExplanation} // Force answer in practice mode
            className="flex items-center gap-2 py-3 px-6 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:bg-surface disabled:text-text-muted text-white rounded-xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
);
