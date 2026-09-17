import {
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const FeaturesSection = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Secure Authentication",
      description:
        "Secure login and signup with email verification, JWT authentication, and Google sign-in.",
      color: "success",
    },
    {
      icon: <CalendarDaysIcon className="w-8 h-8" />,
      title: "Event Management",
      description:
        "Create and manage society events, track budgets, participants, fund collection, and event expenses.",
      color: "info",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Member Management",
      description:
        "Manage society members, roles, invitations, and join requests from one place.",
      color: "secondary",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Online & Offline Participants",
      description:
        "Add registered users or offline participants without an account and manage both through the same event system.",
      color: "warning",
    },
    {
      icon: <BanknotesIcon className="w-8 h-8" />,
      title: "Payment Tracking",
      description:
        "Track payments, partial payments, remaining amounts, payment history, and payment status for each participant.",
      color: "primary",
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Fund & Expense Management",
      description:
        "Monitor collected funds and manage event expenses to keep society finances organized and transparent.",
      color: "accent",
    },
  ];

  const colorClasses = {
    primary: {
      bg: "bg-primary",
      border: "border-primary/20",
    },
    secondary: {
      bg: "bg-secondary",
      border: "border-secondary/20",
    },
    accent: {
      bg: "bg-accent",
      border: "border-accent/20",
    },
    success: {
      bg: "bg-success",
      border: "border-success/20",
    },
    info: {
      bg: "bg-info",
      border: "border-info/20",
    },
    warning: {
      bg: "bg-warning",
      border: "border-warning/20",
    },
  };

  return (
    <section className="py-24 bg-base-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <div className="badge badge-primary badge-lg mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Powerful Features
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
            Everything Your Society{" "}
            <span className="text-primary">Needs</span>
          </h2>

          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Manage members, events, payments, funds, and expenses from one
            simple platform.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const color =
              colorClasses[feature.color] || colorClasses.primary;

            return (
              <div
                key={index}
                className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`card bg-base-100 shadow-lg hover:shadow-2xl border ${color.border} h-full transition-all duration-300 group-hover:border-primary/30`}
                >
                  <div className="card-body p-8">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl ${color.bg} text-primary-content flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                    >
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;