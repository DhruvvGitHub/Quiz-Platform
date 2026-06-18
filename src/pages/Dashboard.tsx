import { Link } from 'react-router-dom';
import { useStatsStore } from '../store/useStatsStore';
import { Target, TrendingUp, Clock, BookOpen, ChevronRight } from 'lucide-react';

export const Dashboard = () => {
  const { attempts } = useStatsStore();

  const totalQuizzes = attempts.length;
  const totalQuestions = attempts.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const totalCorrect = attempts.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Calculate subject-wise performance
  const subjectStats = attempts.reduce((acc, curr) => {
    if (!acc[curr.subject]) {
      acc[curr.subject] = { attempts: 0, score: 0, max: 0 };
    }
    acc[curr.subject].attempts += 1;
    acc[curr.subject].score += curr.score;
    acc[curr.subject].max += curr.totalQuestions;
    return acc;
  }, {} as Record<string, { attempts: number, score: number, max: number }>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-text-muted">Track your progress and get ready for the MPSEDC GET 3.0 exam.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Quizzes" 
          value={totalQuizzes.toString()} 
          icon={<BookOpen className="text-blue-500" />} 
          color="bg-blue-500/10 border-blue-500/20" 
        />
        <StatCard 
          title="Avg. Accuracy" 
          value={`${accuracy}%`} 
          icon={<Target className="text-emerald-500" />} 
          color="bg-emerald-500/10 border-emerald-500/20" 
        />
        <StatCard 
          title="Questions Solved" 
          value={totalQuestions.toString()} 
          icon={<TrendingUp className="text-purple-500" />} 
          color="bg-purple-500/10 border-purple-500/20" 
        />
        <StatCard 
          title="Study Time" 
          value={`${Math.round(attempts.reduce((acc, c) => acc + c.timeElapsed, 0) / 60)}m`} 
          icon={<Clock className="text-amber-500" />} 
          color="bg-amber-500/10 border-amber-500/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Activity */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          
          {attempts.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <p>No quizzes attempted yet.</p>
              <Link to="/setup" className="text-primary hover:underline mt-2 inline-block">
                Start your first quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.slice().reverse().slice(0, 5).map((attempt, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/5 hover:border-primary/30 transition-colors">
                  <div>
                    <h3 className="font-semibold text-text">{attempt.subject}</h3>
                    <p className="text-xs text-text-muted">{new Date(attempt.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</p>
                    <p className="text-xs text-text-muted">{attempt.score}/{attempt.totalQuestions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject Performance */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Subject Performance</h2>
          
          {Object.keys(subjectStats).length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <p>Data will appear here once you take quizzes.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(subjectStats).map(([subject, stats]) => {
                const percentage = Math.round((stats.score / stats.max) * 100);
                return (
                  <div key={subject}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{subject}</span>
                      <span className="text-text-muted">{percentage}%</span>
                    </div>
                    <div className="w-full bg-surface-hover rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-blue-400 h-2.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-8">
            <Link 
              to="/setup" 
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            >
              Start New Quiz <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className={`glass-panel rounded-2xl p-6 border-l-4 ${color.replace('bg-', 'border-l-')}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-text-muted">{title}</h3>
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);
