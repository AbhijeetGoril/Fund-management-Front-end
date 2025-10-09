import { UserPlusIcon, CurrencyDollarIcon, ChartBarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlusIcon className="w-8 h-8" />,
      step: "01",
      title: "Create Your Society",
      description: "Sign up and set up your society profile in under 5 minutes"
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      step: "02",
      title: "Add Members & Funds",
      description: "Invite members and set up your first fund collection event"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      step: "03",
      title: "Track & Manage",
      description: "Monitor contributions and expenses in real-time dashboard"
    },
    {
      icon: <CheckBadgeIcon className="w-8 h-8" />,
      step: "04",
      title: "Grow Together",
      description: "Use insights to make better financial decisions for your society"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in four simple steps and transform how your society manages funds
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 mb-6 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;