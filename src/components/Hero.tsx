import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypewriterText } from './TypewriterText';
import { publicApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const Hero = () => {
  const { toast } = useToast();
  const roles = [
    'Backend Developer',
    'Java Developer',
    'Spring Boot Expert',
    'Problem Solver',
    'Code Enthusiast',
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadResume = async () => {
    try {
      await publicApi.downloadResume();
      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up leading-tight">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient-x">
              Arindam
            </span>
          </h1>

          <div className="text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 animate-fade-in-up animation-delay-200 text-code-accent font-semibold min-h-[40px] sm:min-h-[48px]">
            <TypewriterText texts={roles} />
          </div>

          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-400 px-4">
            I specialize in building scalable backend systems, developing robust APIs,
            and integrating third-party services. Passionate about creating efficient,
            maintainable solutions that power modern applications.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 animate-fade-in-up animation-delay-600 px-4">
            <Button size="lg" onClick={() => scrollToSection('projects')} className="gap-2 w-full sm:w-auto">
              View My Work
            </Button>
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" onClick={handleDownloadResume}>
              <Download className="h-4 w-4" />
              Download Resume
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 sm:gap-8 justify-center animate-fade-in-up animation-delay-600">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Github className="h-6 w-6 sm:h-7 sm:w-7" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6 sm:h-7 sm:w-7" />
            </a>
            <a href="mailto:arindampal669@gmail.com" className="hover:text-primary transition-colors">
              <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={() => scrollToSection('about')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};
