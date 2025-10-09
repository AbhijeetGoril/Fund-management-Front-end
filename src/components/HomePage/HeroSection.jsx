import { CurrencyDollarIcon, UserGroupIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const HeroSection = ({ stats, totalFunds }) => {
  const [fundsCounter, setFundsCounter] = useState(0);
  console.log(totalFunds)
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
    <section className="relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient"></div>
      
      {/* Floating Blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <SparklesIcon className="w-4 h-4" />
              Empowering 500+ Societies
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Smarter 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Fund Management </span>
              for Societies
            </h1>

            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Manage society finances with AI-powered insights, automated tracking, 
              and real-time collaboration. Save time, stay transparent, and grow smarter.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-8">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center">
                Use Free Forever
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 bg-white/70 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                100% Free to Use
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No credit card needed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Setup in 5 mins
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:scale-[1.02] transition-all duration-500">
              {/* Card header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-blue-100 text-sm">Total Funds Managed</p>
                    <CurrencyDollarIcon className="w-8 h-8" />
                  </div>
                  <p className="text-4xl font-bold">₹{fundsCounter.toLocaleString()}</p>
                  <span className="text-green-300 text-sm">↑ 12.5% this month</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-5">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/70 p-4 rounded-xl hover:bg-white transition-colors shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <div className="flex items-end justify-between mt-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="mt-6 p-3 bg-green-50 rounded-xl flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-800 text-sm font-medium">All systems operational</p>
              </div>
            </div>

            {/* Floating Shapes */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-2xl transform -rotate-12 opacity-10"></div>
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-400 rounded-full opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
