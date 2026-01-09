const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral text-neutral-content py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">💰</span>
              <span className="text-xl font-bold">SocietyFunds</span>
            </div>
            <p className="opacity-70 text-sm">
              Free and open-source fund management for housing societies worldwide.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li><a href="#" className="hover:opacity-100 transition">Features</a></li>
              <li><a href="#" className="hover:opacity-100 transition">Demo</a></li>
              <li><a href="#" className="hover:opacity-100 transition">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li><a href="#" className="hover:opacity-100 transition">Help Center</a></li>
              <li><a href="#" className="hover:opacity-100 transition">Community</a></li>
              <li><a href="#" className="hover:opacity-100 transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li><a href="#" className="hover:opacity-100 transition">Privacy</a></li>
              <li><a href="#" className="hover:opacity-100 transition">Terms</a></li>
              <li><a href="#" className="hover:opacity-100 transition">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-base-content/20 mt-8 pt-8 text-center opacity-70 text-sm">
          <p>© {currentYear} SocietyFunds. Open source and free forever.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;