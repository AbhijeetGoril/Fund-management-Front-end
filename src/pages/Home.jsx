
import Navbar from '../components/Navbar/Navbar';
import HeroSection from '../components/HomePage/HeroSection';
import StatsSection from '../components/HomePage/StatsSection';
import FeaturesSection from '../components/HomePage/FeaturesSection';
import HowItWorks from '../components/HomePage/HowItWorks';
import Testimonials from '../components/HomePage/Testimonials';
import CTASection from '../components/HomePage/CTASection';
import Footer from '../components/HomePage/Footer';

const HomePage = () => {

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navbar />
      <HeroSection  />
      {/* <StatsSection stats={stats} /> */}
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;