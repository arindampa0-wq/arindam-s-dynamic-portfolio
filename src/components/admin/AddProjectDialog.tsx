import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { adminApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AddProjectDialogProps {
  token: string;
  onSuccess: () => void;
}

export const AddProjectDialog = ({ token, onSuccess }: AddProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    description: '',
    technologies: '',
    starDate: '',
    endDate: '',
    isTeamProj: false,
    gitHubUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      
      await adminApi.addProject(projectData, token);
      toast({ title: 'Success', description: 'Project added successfully' });
      setOpen(false);
      setFormData({
        title: '',
        overview: '',
        description: '',
        technologies: '',
        starDate: '',
        endDate: '',
        isTeamProj: false,
        gitHubUrl: '',
      });
      onSuccess();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add project', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
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
              <Label htmlFor="starDate">Start Date *</Label>
              <Input
                id="starDate"
                type="date"
                value={formData.starDate}
                onChange={(e) => setFormData({ ...formData, starDate: e.target.value })}
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
              id="isTeamProj"
              checked={formData.isTeamProj}
              onCheckedChange={(checked) => setFormData({ ...formData, isTeamProj: checked })}
            />
            <Label htmlFor="isTeamProj">Team Project</Label>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
