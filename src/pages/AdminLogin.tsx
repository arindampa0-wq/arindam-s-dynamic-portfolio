import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code2, Lock, User } from 'lucide-react';
import { adminApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await adminApi.login(credentials);
      login(response.token);
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-center text-muted-foreground mb-8">
            Access the dashboard to manage your portfolio
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate('/')}>
              Back to Portfolio
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
