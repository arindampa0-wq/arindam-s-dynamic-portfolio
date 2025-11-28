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
import { Trash2, Upload } from 'lucide-react';
import { adminApi, publicApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { AddProjectDialog } from '@/components/admin/AddProjectDialog';
import { AddCertificateDialog } from '@/components/admin/AddCertificateDialog';
import { BackgroundAnimation } from '@/components/BackgroundAnimation';

const AdminDashboard = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      loadData();
    }
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    if (!token) return;
    try {
      const [projectsData, certificatesData, messagesData] = await Promise.all([
        adminApi.getAllProjects(token),
        adminApi.getAllCertificates(token),
        adminApi.getMessages(token),
      ]);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
      setMessages(messagesData.content || []);
      
      // Try to load resume URL
      try {
        const url = await adminApi.getResumeUrl(token);
        setResumeUrl(url);
      } catch (error) {
        console.log('No resume uploaded yet');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
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

  const handleDeleteCertificate = async (id: string) => {
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

  const handleDeleteMessage = async (id: string) => {
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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      toast({ title: 'Error', description: 'Please upload a PDF file', variant: 'destructive' });
      return;
    }

    try {
      setResumeLoading(true);
      await adminApi.uploadResume(file, token);
      toast({ title: 'Success', description: 'Resume uploaded successfully' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload resume', variant: 'destructive' });
    } finally {
      setResumeLoading(false);
    }
  };

  const handleResumeDownload = async () => {
    if (!token) return;
    
    try {
      setResumeLoading(true);
      await adminApi.downloadResume(token);
      toast({ title: 'Success', description: 'Resume downloaded successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download resume', variant: 'destructive' });
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8 relative">
      <BackgroundAnimation />
      <Header />
      <div className="container mx-auto px-4 pt-20 sm:pt-24">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 gap-1">
            <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm">Messages</TabsTrigger>
            <TabsTrigger value="resume" className="text-xs sm:text-sm">Resume</TabsTrigger>
            <TabsTrigger value="certificates" className="text-xs sm:text-sm">Certificates</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Projects Management</h2>
                {token && <AddProjectDialog token={token} onSuccess={loadData} />}
              </div>
              {projects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm sm:text-base">No projects yet.</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold mb-2">{project.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {project.technologies?.map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-[10px] sm:text-xs">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
                          {token && <AddProjectDialog token={token} onSuccess={loadData} project={project} />}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={loading}
                            className="h-8 w-8 sm:h-10 sm:w-10"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Messages</h2>
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm sm:text-base">No messages yet.</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((message: any) => (
                    <Card key={message.id} className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                            <span className="font-semibold text-sm sm:text-base">{message.name}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground break-all">({message.email})</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">{message.message}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {new Date(message.date).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={loading}
                          className="h-8 w-8 sm:h-10 sm:w-10 self-end sm:self-start flex-shrink-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Resume Management</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-12 text-center">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                  <p className="text-sm sm:text-base text-muted-foreground mb-2">Upload your resume</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">PDF files only (MAX. 10MB)</p>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    disabled={resumeLoading}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button asChild disabled={resumeLoading} className="text-xs sm:text-sm">
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {resumeLoading ? 'Uploading...' : 'Upload Resume'}
                    </label>
                  </Button>
                </div>
                
                {resumeUrl && (
                  <div className="border border-border rounded-lg p-4 sm:p-6">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Current Resume</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Resume is uploaded and available</p>
                    <Button 
                      onClick={handleResumeDownload} 
                      disabled={resumeLoading}
                      variant="outline"
                      className="text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {resumeLoading ? 'Downloading...' : 'Download Current Resume'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Certificates Management</h2>
                {token && <AddCertificateDialog token={token} onSuccess={loadData} />}
              </div>
              {certificates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm sm:text-base">No certificates yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold mb-1">{cert.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">{cert.issuer}</p>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
                          {token && <AddCertificateDialog token={token} onSuccess={loadData} certificate={cert} />}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteCertificate(cert.id)}
                            disabled={loading}
                            className="h-8 w-8 sm:h-10 sm:w-10"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
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
