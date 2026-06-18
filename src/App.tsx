import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { SetupQuiz } from './pages/SetupQuiz';
import { ActiveQuiz } from './pages/ActiveQuiz';
import { QuizResult } from './pages/QuizResult';
import { QuizReview } from './pages/QuizReview';
import { Bookmarks } from './pages/Bookmarks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="setup" element={<SetupQuiz />} />
          <Route path="quiz" element={<ActiveQuiz />} />
          <Route path="result" element={<QuizResult />} />
          <Route path="review" element={<QuizReview />} />
          <Route path="bookmarks" element={<Bookmarks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
