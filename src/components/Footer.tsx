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
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Arindam</span>
            </div>
            <p className="text-muted-foreground">
              Backend Developer specializing in API development, third-party integrations,
              and scalable backend systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button onClick={() => scrollToSection('about')} className="block hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('projects')} className="block hover:text-primary transition-colors">
                Projects
              </button>
              <button onClick={() => scrollToSection('certificates')} className="block hover:text-primary transition-colors">
                Certificates
              </button>
              <button onClick={() => scrollToSection('contact')} className="block hover:text-primary transition-colors">
                Contact
              </button>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Arindam
          </div>

          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="mailto:arindampal669@gmail.com" className="hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2025 Arindam. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
