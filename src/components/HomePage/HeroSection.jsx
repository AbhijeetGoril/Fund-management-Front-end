import {
  CurrencyDollarIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axois";

const HeroSection = () => {
  const [fundsCounter, setFundsCounter] = useState(0);

  // ============================================
  // FETCH HOME STATS
  // ============================================

  const {
    data: homeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homeStats"],

    queryFn: async () => {
      const response = await axiosInstance.get("/home/stats");

      return response.data.data;
    },

    staleTime: 30 * 1000,
  });

  // ============================================
  // DATA
  // ============================================

  const totalFunds = homeData?.totalFunds || 0;

  const fundGrowth = homeData?.fundGrowth || 0;

  const totalSocieties = homeData?.totalSocieties || 0;

  const totalEvents = homeData?.totalEvents || 0;

  const totalMembers = homeData?.totalMembers || 0;

  const memberEngagementRate =
    homeData?.memberEngagementRate || 0;

  // ============================================
  // FUNDS COUNTER ANIMATION
  // ============================================

  useEffect(() => {
    let start = 0;

    const end = totalFunds;

    if (end === 0) {
      setFundsCounter(0);
      return;
    }

    const increment = end / 100;

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setFundsCounter(Math.floor(start));
    }, 20);

    return () => clearInterval(timer);
  }, [totalFunds]);

  // ============================================
  // LOADING
  // ============================================

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-base-100">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
          <div className="flex justify-center items-center min-h-[500px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (isError) {
    return (
      <section className="relative overflow-hidden bg-base-100">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
          <div className="alert alert-error">
            Failed to load dashboard statistics.
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // STATS
  // ============================================

  const stats = [
    {
      label: "Total Societies",
      value: totalSocieties,
      change: "Societies",
      trend: "up",
    },
    {
      label: "Total Events",
      value: totalEvents,
      change: "Events",
      trend: "up",
    },
    {
      label: "Total Members",
      value: totalMembers,
      change: "Members",
      trend: "up",
    },
    {
      label: "Member Engagement",
      value: `${memberEngagementRate}%`,
      change: "Active members",
      trend: "up",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-base-100">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>

      <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* ========================================
              LEFT SIDE
          ======================================== */}

          <div className="text-center lg:text-left">

            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-5 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">

              <SparklesIcon className="w-4 h-4" />

              Empowering {totalSocieties} Societies

            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-base-content leading-tight mb-6">

              Smarter{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Fund Management
              </span>{" "}

              for Societies

            </h1>

            <p className="text-lg text-base-content/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">

              Manage society finances with AI-powered insights,
              automated tracking, and real-time collaboration.
              Save time, stay transparent, and grow smarter.

            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-8">

              <button className="btn btn-primary btn-lg group">

                Use Free Forever

                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />

              </button>

              <button className="btn btn-outline btn-lg">
                Watch Demo
              </button>

            </div>

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

          {/* ========================================
              RIGHT SIDE
          ======================================== */}

          <div className="relative">

            <div className="relative bg-base-200 backdrop-blur-xl rounded-3xl shadow-2xl border border-base-300 p-8 hover:scale-[1.02] transition-all duration-500">

              {/* ====================================
                  TOTAL FUNDS
              ==================================== */}

              <div className="bg-gradient-to-r from-primary to-secondary text-primary-content p-6 rounded-2xl mb-8 relative overflow-hidden">

                <div className="absolute top-0 right-0 w-28 h-28 bg-base-100/20 rounded-full -translate-y-12 translate-x-12"></div>

                <div className="relative z-10">

                  <div className="flex items-center justify-between mb-2">

                    <p className="text-primary-content/80 text-sm">
                      Total Funds Managed
                    </p>

                    <CurrencyDollarIcon className="w-8 h-8" />

                  </div>

                  <p className="text-4xl font-bold">
                    ₹{fundsCounter.toLocaleString()}
                  </p>

                  <span
                    className={`text-sm ${
                      fundGrowth >= 0
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {fundGrowth >= 0 ? "↑" : "↓"}{" "}
                    {Math.abs(fundGrowth)}% in the last 30 days
                  </span>

                </div>

              </div>

              {/* ====================================
                  STATS
              ==================================== */}

              <div className="grid grid-cols-2 gap-5">

                {stats.map((stat, index) => (

                  <div
                    key={index}
                    className="bg-base-100 p-4 rounded-xl hover:bg-base-300 transition-colors shadow-sm"
                  >

                    <p className="text-base-content/70 text-sm font-medium">
                      {stat.label}
                    </p>

                    <div className="flex items-end justify-between mt-2">

                      <p className="text-2xl font-bold text-base-content">
                        {stat.value}
                      </p>

                      <span
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        {stat.change}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

              {/* ====================================
                  SYSTEM STATUS
              ==================================== */}

              <div className="mt-6 p-3 bg-success/20 rounded-xl flex items-center gap-3">

                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>

                <p className="text-success text-sm font-medium">
                  All systems operational
                </p>

              </div>

            </div>

            {/* Decorative elements */}

            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-warning rounded-2xl transform -rotate-12 opacity-10"></div>

            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary rounded-full opacity-10"></div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;