import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

const StatsSection = ({ stats, title = "Our Impact" }) => {
  const containerRef = useRef(null);
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        stats.forEach((stat, i) => {
          let start = 0;
          let rawValue = typeof stat.value === "number" ? stat.value : 
            parseFloat(stat.value.toString().replace(/[^0-9.]/g, ""), 10);
          let end = rawValue || 0;
          const increment = end / 80;
          let dec = false;
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              start = end;
              clearInterval(timer);
              dec = true;
            }
            setCounters((prev) => {
              const newCounters = [...prev];
              newCounters[i] = dec ? parseFloat(start.toFixed(2)) : Math.floor(start);
              return newCounters;
            });
          }, 20);
        });
        observer.disconnect();
      }
    }, { threshold: 0.30 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [stats]);

  return (
    <section ref={containerRef} className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        {/* Optional Section Title */}
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">{title}</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Real-time statistics showing the impact of our platform on society management
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const isUp = stat.trend === "up";
            return (
              <div key={index} className="stat place-items-center bg-base-100 rounded-box shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="stat-title text-base-content/70">{stat.label}</div>
                <div className="stat-value text-primary">
                  {counters[index].toLocaleString()}
                  {stat.label.includes("Rate") && "%"}
                </div>
                <div className="stat-desc flex items-center gap-1">
                  {isUp ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-error" />
                  )}
                  <span className={isUp ? "text-success" : "text-error"}>
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;