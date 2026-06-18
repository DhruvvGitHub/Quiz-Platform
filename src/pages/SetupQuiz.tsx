import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, getAvailableSubjects } from '../utils/questionLoader';
import { prepareQuiz, getTopicsFromQuestions } from '../utils/quizEngine';
import { useQuizStore } from '../store/useQuizStore';
import { Play, Settings2, Loader2, AlertCircle } from 'lucide-react';
import type { Question } from '../types/quiz';

export const SetupQuiz = () => {
  const navigate = useNavigate();
  const startQuizStore = useQuizStore((state) => state.startQuiz);
  
  const subjects = getAvailableSubjects();
  
  const [subject, setSubject] = useState(subjects[0]);
  const [topics, setTopics] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [mode, setMode] = useState<'practice' | 'mock'>('practice');
  const [numQuestions, setNumQuestions] = useState(10);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rawQuestions, setRawQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      setIsLoading(true);
      setError('');
      try {
        const questions = await fetchQuestions(subject);
        if (questions.length === 0) {
          setError(`No questions found for ${subject}. Please ensure /data/${subject.toLowerCase()}.json exists.`);
          setAvailableTopics([]);
        } else {
          setRawQuestions(questions);
          setAvailableTopics(getTopicsFromQuestions(questions));
          setTopics([]); // reset selected topics on subject change
        }
      } catch (err) {
        setError('Failed to load subject data.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTopics();
  }, [subject]);

  const toggleTopic = (topic: string) => {
    setTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleStart = () => {
    if (rawQuestions.length === 0) return;
    
    const settings = {
      subject,
      topics,
      mode,
      difficulty: 'all' as const,
      numberOfQuestions: numQuestions,
    };
    
    const preparedQuestions = prepareQuiz(rawQuestions, topics, numQuestions);
    
    if (preparedQuestions.length === 0) {
      setError('No questions match the selected criteria.');
      return;
    }
    
    startQuizStore(settings, preparedQuestions);
    navigate('/quiz');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2">Configure Quiz</h1>
        <p className="text-text-muted">Customize your test environment for optimal preparation.</p>
      </header>

      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-8 relative overflow-hidden">
        {/* Decorator blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Subject Selection */}
        <div className="space-y-4">
          <label className="text-sm font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> 1. Select Subject
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  subject === s 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border-transparent' 
                    : 'bg-surface border border-white/5 hover:border-primary/50 text-text'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Topics Selection */}
        <div className="space-y-4">
          <label className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            2. Filter by Topics (Optional)
          </label>
          {isLoading ? (
            <div className="flex items-center gap-2 text-text-muted py-4">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading topics...
            </div>
          ) : availableTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`py-1.5 px-4 rounded-full text-sm transition-all border ${
                    topics.includes(topic)
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-surface border-white/10 hover:border-white/30 text-text-muted'
                  }`}
                >
                  {topic}
                </button>
              ))}
              {topics.length > 0 && (
                <button 
                  onClick={() => setTopics([])}
                  className="py-1.5 px-4 text-sm text-text-muted hover:text-white underline decoration-dashed underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mode Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              3. Select Mode
            </label>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all ${mode === 'practice' ? 'bg-primary/10 border-primary/50' : 'bg-surface border-white/5 hover:border-white/20'}`}>
                <input type="radio" name="mode" value="practice" checked={mode === 'practice'} onChange={() => setMode('practice')} className="mt-1 accent-primary" />
                <div>
                  <p className="font-medium text-white">Practice Mode</p>
                  <p className="text-xs text-text-muted mt-1">Immediate feedback and explanations after each question.</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all ${mode === 'mock' ? 'bg-primary/10 border-primary/50' : 'bg-surface border-white/5 hover:border-white/20'}`}>
                <input type="radio" name="mode" value="mock" checked={mode === 'mock'} onChange={() => setMode('mock')} className="mt-1 accent-primary" />
                <div>
                  <p className="font-medium text-white">Mock Test</p>
                  <p className="text-xs text-text-muted mt-1">Exam simulation with no feedback until submission.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              4. Questions Count
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[10, 20, 30, 50].map(num => (
                <button
                  key={num}
                  onClick={() => setNumQuestions(num)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    numQuestions === num 
                      ? 'bg-surface-hover border border-primary text-primary' 
                      : 'bg-surface border border-white/5 hover:border-white/20 text-text-muted'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-2">
              Available pool: {rawQuestions.length} questions
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={handleStart}
            disabled={isLoading || rawQuestions.length === 0}
            className="flex items-center gap-2 py-3 px-8 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          >
            <Play className="w-5 h-5 fill-current" /> Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
