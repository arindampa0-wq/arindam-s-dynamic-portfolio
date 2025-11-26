import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { publicApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
  credentialUrl?: string;
}

export const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getCertificates();
      setCertificates(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load certificates. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="certificates" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Certifications</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Professional certifications demonstrating my commitment to continuous learning.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certificates available.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                {cert.imageUrl && (
                  <div className="h-48 overflow-hidden bg-muted">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                  <p className="text-muted-foreground mb-3">{cert.issuer}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{new Date(cert.date).toLocaleDateString()}</Badge>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        View
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
