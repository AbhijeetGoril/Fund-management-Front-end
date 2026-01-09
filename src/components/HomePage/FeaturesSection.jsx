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
      color: "success"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Smart insights and predictive analytics for better financial decisions",
      color: "info"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Member Collaboration",
      description: "Real-time collaboration tools for committees and members",
      color: "secondary"
    },
    {
      icon: <BuildingLibraryIcon className="w-8 h-8" />,
      title: "Automated Events",
      description: "Smart fund event creation with automated reminders and tracking",
      color: "warning"
    },
    {
      icon: <BanknotesIcon className="w-8 h-8" />,
      title: "Multi-Payment Support",
      description: "UPI, Net Banking, Cards, and Wallet payments in one platform",
      color: "primary"
    },
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      title: "Mobile First",
      description: "Progressive web app that works seamlessly on all devices",
      color: "accent"
    }
  ];

  // DaisyUI theme color mappings
  const colorClasses = {
    primary: {
      bg: "bg-primary",
      text: "text-primary",
      from: "from-primary",
      to: "to-primary/80",
      light: "bg-primary/10",
      border: "border-primary/20"
    },
    secondary: {
      bg: "bg-secondary",
      text: "text-secondary",
      from: "from-secondary",
      to: "to-secondary/80",
      light: "bg-secondary/10",
      border: "border-secondary/20"
    },
    accent: {
      bg: "bg-accent",
      text: "text-accent",
      from: "from-accent",
      to: "to-accent/80",
      light: "bg-accent/10",
      border: "border-accent/20"
    },
    success: {
      bg: "bg-success",
      text: "text-success",
      from: "from-success",
      to: "to-success/80",
      light: "bg-success/10",
      border: "border-success/20"
    },
    info: {
      bg: "bg-info",
      text: "text-info",
      from: "from-info",
      to: "to-info/80",
      light: "bg-info/10",
      border: "border-info/20"
    },
    warning: {
      bg: "bg-warning",
      text: "text-warning",
      from: "from-warning",
      to: "to-warning/80",
      light: "bg-warning/10",
      border: "border-warning/20"
    }
  };

  return (
    <section className="py-24 bg-base-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="badge badge-primary badge-lg mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
            Everything Your Society <span className="text-primary">Needs</span>
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to automate and simplify society fund management 
            while ensuring complete transparency and security for all members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const color = colorClasses[feature.color] || colorClasses.primary;
            
            return (
              <div 
                key={index} 
                className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2"
              >
                {/* Card */}
                <div className={`card bg-base-100 shadow-lg hover:shadow-2xl border ${color.border} h-full transition-all duration-300 group-hover:border-primary/30`}>
                  <div className="card-body p-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${color.bg} text-primary-content flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="card-title text-2xl text-base-content mb-4">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-base-content/70 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Learn More Link */}
                    <div className="card-actions">
                      <button className="btn btn-ghost btn-sm gap-2 group-hover:text-primary transition-colors">
                        Learn more
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-8 border-t border-base-300">
          <p className="text-base-content/70 mb-6">
            Join thousands of housing societies already managing their funds efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-lg">
              Start Free Trial
            </button>
            <button className="btn btn-outline btn-lg">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;