import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../sections/Hero';
import About from '../../sections/About';
import HowItWorks from '../../sections/HowItWorks';
import Contact from '../../sections/Contact';
import Footer from '../../components/Footer';

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'how-it-works', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -80px 0px',
      threshold: 0.3,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="relative w-full">
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
