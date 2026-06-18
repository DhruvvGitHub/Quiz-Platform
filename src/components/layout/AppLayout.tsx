import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Home, Settings, Info, BookMarked } from 'lucide-react';

export const AppLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Setup Quiz', path: '/setup', icon: <Settings className="w-5 h-5" /> },
    { name: 'Bookmarks', path: '/bookmarks', icon: <BookMarked className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-background)]">
      {/* Sidebar/Top Navbar */}
      <nav className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-white/10 p-4 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            MPSEDC GET 3.0
          </h1>
        </div>

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text'
              }`}
            >
              {item.icon}
              <span className="font-medium whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="p-4 rounded-xl bg-gradient-to-br from-surface to-surface-hover border border-white/5 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-text-muted">
              Select a subject and test your knowledge before the objective exams.
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
