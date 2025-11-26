import { Code2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xl font-bold transition-colors hover:text-primary"
          >
            <Code2 className="h-6 w-6 text-primary" />
            <span>Arindam</span>
          </button>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!isAdminPage && (
              <>
                <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">
                  About
                </button>
                <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">
                  Projects
                </button>
                <button onClick={() => scrollToSection('certificates')} className="hover:text-primary transition-colors">
                  Certificate
                </button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">
                  Contact
                </button>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              !isAdminPage && (
                <Button onClick={() => navigate('/admin/login')}>
                  Admin
                </Button>
              )
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
