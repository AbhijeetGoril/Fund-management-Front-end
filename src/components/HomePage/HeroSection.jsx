import { CurrencyDollarIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const HeroSection = ({ stats, totalFunds }) => {
  const [fundsCounter, setFundsCounter] = useState(0);

  // Counter animation
  useEffect(() => {
    let start = 0;
    const end = totalFunds;
    if (start === end) return;

    let increment = end / 100;
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setFundsCounter(Math.floor(start));
    }, 20);
  }, [totalFunds]);

  return (
    <section className="relative overflow-hidden bg-base-100">
      {/* ✅ CORRECT: bg-base-100 for theme background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
      
      {/* ✅ CORRECT: Using primary/secondary with opacity */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* ✅ CORRECT: Using primary/20 for light background */}
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-5 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <SparklesIcon className="w-4 h-4" />
              Empowering 500+ Societies
            </div>

            {/* ✅ CORRECT: text-base-content for main text */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-base-content leading-tight mb-6">
              Smarter 
              {/* ✅ CORRECT: Using primary to secondary gradient */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Fund Management </span>
              for Societies
            </h1>

            {/* ✅ CORRECT: text-base-content/70 for secondary text */}
            <p className="text-lg text-base-content/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Manage society finances with AI-powered insights, automated tracking, 
              and real-time collaboration. Save time, stay transparent, and grow smarter.
            </p>

            {/* Buttons */}
            {/* ✅ CORRECT: Using btn classes with DaisyUI */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-8">
              <button className="btn btn-primary btn-lg group">
                Use Free Forever
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn btn-outline btn-lg">
                Watch Demo
              </button>
            </div>

            {/* Trust badges */}
            {/* ✅ CORRECT: Using success color */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                100% Free to Use
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                No credit card needed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Setup in 5 mins
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            {/* ✅ CORRECT: bg-base-200 for card background */}
            <div className="relative bg-base-200 backdrop-blur-xl rounded-3xl shadow-2xl border border-base-300 p-8 hover:scale-[1.02] transition-all duration-500">
              {/* Card header */}
              {/* ✅ CORRECT: Gradient with primary to secondary */}
              <div className="bg-gradient-to-r from-primary to-secondary text-primary-content p-6 rounded-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-base-100/20 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-primary-content/80 text-sm">Total Funds Managed</p>
                    <CurrencyDollarIcon className="w-8 h-8" />
                  </div>
                  <p className="text-4xl font-bold">₹{fundsCounter.toLocaleString()}</p>
                  {/* ✅ CORRECT: success color for positive indicator */}
                  <span className="text-success text-sm">↑ 12.5% this month</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-5">
                {stats?.map((stat, index) => (
                  <div key={index} className="bg-base-100 p-4 rounded-xl hover:bg-base-300 transition-colors shadow-sm">
                    <p className="text-base-content/70 text-sm font-medium">{stat.label}</p>
                    <div className="flex items-end justify-between mt-2">
                      <p className="text-2xl font-bold text-base-content">{stat.value}</p>
                      {/* ✅ CORRECT: success/error colors for trends */}
                      <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-success' : 'text-error'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Status */}
              {/* ✅ CORRECT: success/20 for light background */}
              <div className="mt-6 p-3 bg-success/20 rounded-xl flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <p className="text-success-content text-sm font-medium">All systems operational</p>
              </div>
            </div>

            {/* Floating Shapes */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-warning rounded-2xl transform -rotate-12 opacity-10"></div>
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary rounded-full opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;