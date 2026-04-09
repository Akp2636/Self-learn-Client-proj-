import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import VideosSection from '../components/VideosSection';
import NotesSectionPreview from '../components/NotesSectionPreview';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <NotesSectionPreview />
      <VideosSection />
      <Footer />
    </>
  );
}
