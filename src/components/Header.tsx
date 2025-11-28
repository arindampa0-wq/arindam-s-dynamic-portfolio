import { useState } from 'react';
import { Code2, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith('/admin');

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
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

          {/* Desktop Navigation */}
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in-up">
            {!isAdminPage && (
              <>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="block w-full text-left py-2 hover:text-primary transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('projects')} 
                  className="block w-full text-left py-2 hover:text-primary transition-colors"
                >
                  Projects
                </button>
                <button 
                  onClick={() => scrollToSection('certificates')} 
                  className="block w-full text-left py-2 hover:text-primary transition-colors"
                >
                  Certificate
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="block w-full text-left py-2 hover:text-primary transition-colors"
                >
                  Contact
                </button>
                <div className="pt-2 border-t border-border">
                  {isAuthenticated ? (
                    <Button onClick={handleLogout} variant="destructive" className="w-full">
                      Logout
                    </Button>
                  ) : (
                    <Button onClick={() => { navigate('/admin/login'); setMobileMenuOpen(false); }} className="w-full">
                      Admin
                    </Button>
                  )}
                </div>
              </>
            )}
            {isAdminPage && (
              <div className="pt-2">
                {isAuthenticated ? (
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    Logout
                  </Button>
                ) : (
                  <Button onClick={() => { navigate('/admin/login'); setMobileMenuOpen(false); }} className="w-full">
                    Admin
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};