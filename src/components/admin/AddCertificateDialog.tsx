import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit } from 'lucide-react';
import { adminApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  technologies?: string[];
}

interface AddCertificateDialogProps {
  token: string;
  onSuccess: () => void;
  certificate?: Certificate;
}

export const AddCertificateDialog = ({ token, onSuccess, certificate }: AddCertificateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    technologies: '',
  });

  useEffect(() => {
    if (certificate && open) {
      setFormData({
        title: certificate.title,
        issuer: certificate.issuer,
        issueDate: certificate.issueDate,
        credentialId: certificate.credentialId || '',
        credentialUrl: certificate.credentialUrl || '',
        description: certificate.description || '',
        technologies: certificate.technologies?.join(', ') || '',
      });
    } else if (!certificate && open) {
      setFormData({
        title: '',
        issuer: '',
        issueDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        technologies: '',
      });
    }
  }, [certificate, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const certData = {
        ...formData,
        technologies: formData.technologies 
          ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) 
          : undefined,
      };
      
      if (certificate) {
        await adminApi.updateCertificate(certificate.id, certData, token);
        toast({ title: 'Success', description: 'Certificate updated successfully' });
      } else {
        await adminApi.addCertificate(certData, token);
        toast({ title: 'Success', description: 'Certificate added successfully' });
      }
      
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: `Failed to ${certificate ? 'update' : 'add'} certificate`, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {certificate ? (
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Certificate
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{certificate ? 'Edit Certificate' : 'Add New Certificate'}</DialogTitle>
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
            <Label htmlFor="issuer">Issuer *</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="issueDate">Issue Date *</Label>
            <Input
              id="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="credentialId">Credential ID</Label>
            <Input
              id="credentialId"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="credentialUrl">Credential URL</Label>
            <Input
              id="credentialUrl"
              type="url"
              placeholder="https://..."
              value={formData.credentialUrl}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              placeholder="AWS, Lambda, EC2"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (certificate ? 'Updating...' : 'Adding...') : (certificate ? 'Update Certificate' : 'Add Certificate')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
