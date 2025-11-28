import { Code2, Heart, Github, Linkedin, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Footer = () => {
  const technologies = ['Java', 'Spring Boot', 'Cloudinary', 'MySQL'];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold">Arindam</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Backend Developer specializing in API development, third-party integrations,
              and scalable backend systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <div className="space-y-2">
              <button onClick={() => scrollToSection('about')} className="block text-sm hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('projects')} className="block text-sm hover:text-primary transition-colors">
                Projects
              </button>
              <button onClick={() => scrollToSection('certificates')} className="block text-sm hover:text-primary transition-colors">
                Certificates
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-sm hover:text-primary transition-colors">
                Contact
              </button>
            </div>
          </div>

          {/* Technologies */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Technologies</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            Made with <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-red-500" /> by Arindam
          </div>

          <div className="flex gap-4 sm:gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Github className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="mailto:arindampal669@gmail.com" className="hover:text-primary transition-colors">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground">
            © 2025 Arindam. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};