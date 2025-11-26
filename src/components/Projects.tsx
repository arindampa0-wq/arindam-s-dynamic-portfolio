import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { publicApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  title: string;
  description: string;
  type: 'team' | 'solo';
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  date: string;
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'team' | 'solo'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getProjects();
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) => filter === 'all' || project.type === filter
  );

  return (
    <section id="projects" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Projects</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of the projects I've worked on, showcasing my expertise in backend
          development and system design.
        </p>

        {/* Filter Buttons */}
        <div className="flex gap-4 justify-center mb-12">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Projects
          </Button>
          <Button
            variant={filter === 'team' ? 'default' : 'outline'}
            onClick={() => setFilter('team')}
          >
            Team Projects
          </Button>
          <Button
            variant={filter === 'solo' ? 'default' : 'outline'}
            onClick={() => setFilter('solo')}
          >
            Solo Projects
          </Button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found for the selected filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                {project.imageUrl && (
                  <div className="h-48 overflow-hidden bg-muted">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <Badge variant={project.type === 'team' ? 'default' : 'secondary'}>
                      {project.type === 'team' ? 'Team' : 'Solo'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button size="sm" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
