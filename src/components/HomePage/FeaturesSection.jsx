import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  BuildingLibraryIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const FeaturesSection = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Bank-Grade Security",
      description: "End-to-end encryption and secure payment processing with RBI compliance",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50/50"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Smart insights and predictive analytics for better financial decisions",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50/50"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Member Collaboration",
      description: "Real-time collaboration tools for committees and members",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50/50"
    },
    {
      icon: <BuildingLibraryIcon className="w-8 h-8" />,
      title: "Automated Events",
      description: "Smart fund event creation with automated reminders and tracking",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50/50"
    },
    {
      icon: <BanknotesIcon className="w-8 h-8" />,
      title: "Multi-Payment Support",
      description: "UPI, Net Banking, Cards, and Wallet payments in one platform",
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50/50"
    },
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      title: "Mobile First",
      description: "Progressive web app that works seamlessly on all devices",
      gradient: "from-teal-500 to-blue-600",
      bgGradient: "from-teal-50 to-blue-50/50"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200/50 text-blue-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Everything Your Society <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Needs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Powerful features designed to automate and simplify society fund management 
            while ensuring complete transparency and security for all members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
            >
              {/* Animated Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl p-[1px]">
                <div className={`w-full h-full bg-gradient-to-r ${feature.gradient} rounded-3xl`}></div>
              </div>
              
              {/* Main Card */}
              <div className={`relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/80 group-hover:border-transparent h-full backdrop-blur-sm bg-gradient-to-br ${feature.bgGradient}`}>
                {/* Icon Container */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 font-light text-lg">
                  {feature.description}
                </p>
                
                {/* Animated Button */}
                <div className="mt-auto pt-6 border-t border-gray-100/60 group-hover:border-gray-200/40 transition-colors duration-300">
                  <button className="group/btn flex items-center gap-2 text-gray-700 font-medium text-sm hover:text-gray-900 transition-all duration-300">
                    <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover/btn:from-blue-600 group-hover/btn:to-purple-600">
                      Learn more
                    </span>
                    <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </button>
                </div>
                
                {/* Hover Effect Dot */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500"></div>
              </div>
              
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-10 -z-10 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200/50">
          <p className="text-gray-600 mb-6 font-light">
            Join thousands of housing societies already managing their funds efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 hover:border-gray-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;