import { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/NavBar';
import HeroSection from '../components/HomePage/HeroSection';
import StatsSection from '../components/HomePage/StatsSection';
import FeaturesSection from '../components/HomePage/FeaturesSection';
import HowItWorks from '../components/HomePage/HowItWorks';
import Testimonials from '../components/HomePage/Testimonials';
import CTASection from '../components/HomePage/CTASection';
import Footer from '../components/HomePage/Footer';

const HomePage = () => {
  const events = useSelector(state => state.events);
  const [members] = useState([
    { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com" },
    { id: 3, name: "Amit Patel", email: "amit@example.com" },
    { id: 4, name: "Sneha Gupta", email: "sneha@example.com" },
  ]);

  const totalFunds = events.reduce((sum, event) => sum + (event.collectedAmount || 0), 0);
  const activeEvents = events.filter(event => event.status === 'active').length;

  const stats = [
    { label: "Total Members", value: members.length, change: "+12%", trend: "up" },
    { label: "Active Events", value: activeEvents, change: "+5", trend: "up" },
    { label: "Total Funds", value: `₹${totalFunds.toLocaleString()}`, change: "+23%", trend: "up" },
    { label: "Success Rate", value: "98%", change: "+2%", trend: "up" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <HeroSection stats={stats} totalFunds={totalFunds} members={members} />
      <StatsSection stats={stats} />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;