import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Certificates } from '@/components/Certificates';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { BackgroundAnimation } from '@/components/BackgroundAnimation';

const Portfolio = () => {
  return (
    <div className="min-h-screen relative">
      <BackgroundAnimation />
      <Header />
      <Hero />
      <About />
      <Projects />
      <Certificates />
      <Contact />
      <Footer />
    </div>
  );
};

export default Portfolio;
