import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { Tuple } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';

const StatsSection = ({ stats }) => {
  const containerRef = useRef(null)
  // For animated numbers
  const [counters, setCounters] = useState(stats.map(() => 0));
  useEffect(() => {
  const observe= new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
     stats.forEach((stat,i) => {
      let start=0;
      let rawValue= typeof stat.value==="number"?stat.value: parseFloat(stat.value.toString().replace(/[^0-9.]/g, ""),10);
      let end=rawValue||0;
      const increment = end / 80;
      let dec=false
      let timer=setInterval(()=>{
        start+=increment;
        if(start>=end){
          start=end;
          clearInterval(timer)
          dec=true
        }
        setCounters((prev)=>{
          const newCounter=[...prev]
          newCounter[i]=dec?parseFloat(start.toFixed(2)):Math.floor(start)
          return newCounter
        })
      },20)
    });
      observe.disconnect()
    }
  },{threshold:0.30})
    observe.observe(containerRef.current)
}, [stats]);

  
  

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, index) => {
            const isUp = stat.trend === "up";
            return (
              <div key={index} className="text-center group">
                <div className="bg-white/70 backdrop-blur-sm border border-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  
                  {/* Value */}
                  <div className="text-4xl font-extrabold text-gray-900 mb-3">
                    {counters[index].toLocaleString()}{stat.label==="Success Rate"&& "%"}
                  </div>

                  {/* Label */}
                  <div className="text-gray-600 font-medium mb-3">{stat.label}</div>

                  {/* Change */}
                  <div className={`flex items-center justify-center gap-1 text-sm font-medium ${isUp ? "text-green-600" : "text-red-600"}`}>
                    {isUp ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    {stat.change}
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

export default StatsSection;
