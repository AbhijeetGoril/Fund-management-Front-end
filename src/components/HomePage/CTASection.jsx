import { SparklesIcon } from "@heroicons/react/24/outline";

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-base-200">

      {/* Soft background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <SparklesIcon className="w-4 h-4" />
          Built for Modern Societies
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-5">
          Manage Your Society
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Smarter & Transparently
          </span>
        </h2>

        {/* Description */}
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          Keep your funds, events, members, and society activities
          organized in one simple platform.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 text-sm text-base-content/60">

          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full" />
            Secure & Transparent
          </span>

          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full" />
            Easy Fund Tracking
          </span>

          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full" />
            Real-time Updates
          </span>

        </div>

      </div>
    </section>
  );
};

export default CTASection;