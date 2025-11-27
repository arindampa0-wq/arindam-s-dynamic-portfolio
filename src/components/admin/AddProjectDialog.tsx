import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit } from 'lucide-react';
import { adminApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  overview: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  isTeamProject: boolean;
  githubUrl?: string;
}

interface AddProjectDialogProps {
  token: string;
  onSuccess: () => void;
  project?: Project;
}

export const AddProjectDialog = ({ token, onSuccess, project }: AddProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    teamProj: false,
    gitHubUrl: '',
  });

  useEffect(() => {
    if (project && open) {
      setFormData({
        title: project.title,
        overview: project.overview,
        description: project.description,
        technologies: project.technologies.join(', '),
        startDate: project.startDate,
        endDate: project.endDate,
        teamProj: project.isTeamProject,
        gitHubUrl: project.githubUrl || '',
      });
    } else if (!project && open) {
      setFormData({
        title: '',
        overview: '',
        description: '',
        technologies: '',
        startDate: '',
        endDate: '',
        teamProj: false,
        gitHubUrl: '',
      });
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      
      if (project) {
        await adminApi.updateProject(project.id, projectData, token);
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        await adminApi.addProject(projectData, token);
        toast({ title: 'Success', description: 'Project added successfully' });
      }
      
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: `Failed to ${project ? 'update' : 'add'} project`, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {project ? (
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="overview">Overview *</Label>
            <Input
              id="overview"
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="technologies">Technologies (comma-separated) *</Label>
            <Input
              id="technologies"
              placeholder="React, TypeScript, Node.js"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="gitHubUrl">GitHub URL</Label>
            <Input
              id="gitHubUrl"
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.gitHubUrl}
              onChange={(e) => setFormData({ ...formData, gitHubUrl: e.target.value })}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="teamProj"
              checked={formData.teamProj}
              onCheckedChange={(checked) => setFormData({ ...formData, teamProj: checked })}
            />
            <Label htmlFor="teamProj">Team Project</Label>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (project ? 'Updating...' : 'Adding...') : (project ? 'Update Project' : 'Add Project')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
