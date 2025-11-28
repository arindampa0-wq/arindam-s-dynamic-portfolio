import { Code, Database, Server, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const About = () => {
  const specializations = [
    {
      icon: <Code className="h-6 w-6" />,
      title: 'API Development & Integration',
      color: 'text-primary',
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: 'Third-party Service Integration',
      color: 'text-accent',
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Scalable Backend Systems',
      color: 'text-primary',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Database Design & Optimization',
      color: 'text-accent',
    },
  ];

  const technologies = [
    { name: 'Java', category: 'Languages' },
    { name: 'Spring Boot', category: 'Frameworks' },
    { name: 'MySQL', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'Redis', category: 'Caching' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'AWS', category: 'Cloud' },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
          About Me
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto mb-8 sm:mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          <Card className="p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Backend Developer</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              I'm a passionate backend developer with a strong focus on building scalable,
              efficient systems and APIs. My expertise lies in creating robust backend
              architectures that power modern applications.
            </p>
          </Card>

          <Card className="p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Specialization</h3>
            <div className="space-y-2 sm:space-y-3">
              {specializations.map((spec, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <span className={spec.color}>{spec.icon}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{spec.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Technologies with horizontal scrolling */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Skills & Technologies</h3>
          <div className="relative overflow-hidden">
            <div className="flex gap-3 sm:gap-4 animate-scroll-left">
              {/* First set of technologies */}
              {technologies.map((tech, index) => (
                <div
                  key={`tech-1-${index}`}
                  className="flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 bg-card rounded-lg border border-border hover:border-primary hover:shadow-md transition-all cursor-default min-w-[120px] sm:min-w-[140px]"
                >
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">{tech.category}</div>
                  <div className="text-sm sm:text-base font-semibold">{tech.name}</div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {technologies.map((tech, index) => (
                <div
                  key={`tech-2-${index}`}
                  className="flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 bg-card rounded-lg border border-border hover:border-primary hover:shadow-md transition-all cursor-default min-w-[120px] sm:min-w-[140px]"
                >
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">{tech.category}</div>
                  <div className="text-sm sm:text-base font-semibold">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};