const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Mehta",
      role: "Chairman, Sunshine Apartments",
      content: "This platform reduced our administrative work by 80%. Collections that used to take weeks now happen in days.",
      avatar: "RM"
    },
    {
      name: "Priya Sharma",
      role: "Treasurer, Green Valley Society",
      content: "The transparency and real-time tracking have built incredible trust among our 200+ members.",
      avatar: "PS"
    },
    {
      name: "Amit Patel",
      role: "Secretary, Royal Residency",
      content: "From managing maintenance funds to event collections, everything is now automated and error-free.",
      avatar: "AP"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
            Trusted by Society Leaders
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Join 500+ societies that have transformed their financial management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-content font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-base-content">{testimonial.name}</h4>
                  <p className="text-base-content/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-base-content/80 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div className="flex text-warning mt-4">
                {"★".repeat(5)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;