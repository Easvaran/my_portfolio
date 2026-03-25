import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { getInitialProjects } from '@/lib/data-fetchers';

export default async function Home() {
  const initialProjects = await getInitialProjects();

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects initialProjects={initialProjects} />
      <Contact />
      <Footer />
    </main>
  );
}
