import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload } from 'lucide-react';
import { adminApi, publicApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      loadData();
    }
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      const [projectsData, certificatesData, messagesData] = await Promise.all([
        publicApi.getProjects(),
        publicApi.getCertificates(),
        token ? adminApi.getMessages(token) : Promise.resolve([]),
      ]);
      setProjects(projectsData);
      setCertificates(certificatesData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setLoading(true);
      await adminApi.deleteProject(id, token);
      toast({ title: 'Success', description: 'Project deleted successfully' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (id: number) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      setLoading(true);
      await adminApi.deleteCertificate(id, token);
      toast({ title: 'Success', description: 'Certificate deleted successfully' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete certificate', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      setLoading(true);
      await adminApi.deleteMessage(id, token);
      toast({ title: 'Success', description: 'Message deleted successfully' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Projects Management</h2>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </div>
              {projects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No projects yet.</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                          <p className="text-muted-foreground mb-2">{project.description}</p>
                          <div className="flex gap-2">
                            {project.technologies?.map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No messages yet.</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message: any) => (
                    <Card key={message.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{message.name}</span>
                            <span className="text-muted-foreground">({message.email})</span>
                          </div>
                          <p className="text-muted-foreground">{message.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(message.date).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Resume Tab */}
          <TabsContent value="resume">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Resume Management</h2>
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Click to upload your resume</p>
                <p className="text-sm text-muted-foreground">PDF files only (MAX. 10MB)</p>
                <Button className="mt-4" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Download Current Resume
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Certificates Management</h2>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Certificate
                </Button>
              </div>
              {certificates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No certificates yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{cert.title}</h3>
                          <p className="text-muted-foreground mb-2">{cert.issuer}</p>
                          <Badge variant="outline">{new Date(cert.date).toLocaleDateString()}</Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteCertificate(cert.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
