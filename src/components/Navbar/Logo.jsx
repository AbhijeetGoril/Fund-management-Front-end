import { Link } from "react-router-dom";

const Logo = ({ homeTo = "/", logo = "🏠", title = "Society Manager", onClick }) => (
  <Link
    to={homeTo}
    className="flex items-center hover:opacity-80 transition-opacity group"
    onClick={onClick}
  >
    {/* Using DaisyUI theme-aware classes */}
    <div className="bg-primary/20 text-primary p-2 rounded-lg mr-3 group-hover:bg-primary/30 transition-colors">
      <div className="w-6 h-6 flex items-center justify-center">{logo}</div>
    </div>
    
    {/* Theme-aware text color */}
    <h1 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
      {title}
    </h1>
  </Link>
);

export default Logo;