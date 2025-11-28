import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { publicApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

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

export const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCerts, setExpandedCerts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await publicApi.getCertificate();
      setCertificates(Array.isArray(response) ? response : []);
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

  const toggleExpand = (certId: string) => {
    setExpandedCerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(certId)) {
        newSet.delete(certId);
      } else {
        newSet.add(certId);
      }
      return newSet;
    });
  };

  return (
    <section id="certificates" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">Certifications</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
        <p className="text-center text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
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
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full px-4 sm:px-0"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {certificates.map((cert) => (
                <CarouselItem key={cert.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow group h-full">
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{cert.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{cert.issuer}</p>
                      {cert.description && (
                        <div className="text-xs sm:text-sm text-muted-foreground mb-3">
                          <p className={expandedCerts.has(cert.id) ? '' : 'line-clamp-3'}>
                            {cert.description}
                          </p>
                          {cert.description.length > 150 && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => toggleExpand(cert.id)}
                              className="p-0 h-auto text-primary text-xs sm:text-sm"
                            >
                              {expandedCerts.has(cert.id) ? 'Read Less' : 'Read More'}
                            </Button>
                          )}
                        </div>
                      )}
                      {cert.technologies && cert.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                          {cert.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </Badge>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-xs sm:text-sm"
                          >
                            View
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
};