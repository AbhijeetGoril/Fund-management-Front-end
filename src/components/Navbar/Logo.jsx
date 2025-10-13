import { Link } from "react-router-dom";

const Logo = ({ homeTo = "/", logo = "🏠", title = "Society Manager", onClick }) => (
  <Link
    to={homeTo}
    className="flex items-center hover:opacity-80 transition-opacity group"
    onClick={onClick}
  >
    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
      <div className="w-6 h-6 flex items-center justify-center">{logo}</div>
    </div>
    <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
      {title}
    </h1>
  </Link>
);

export default Logo;
