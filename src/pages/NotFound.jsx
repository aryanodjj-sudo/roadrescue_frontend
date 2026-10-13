import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Navbar from "../components/navbar/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="text-7xl font-extrabold text-primary-600">404</span>
        <h1 className="text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>
        <p className="text-slate-500 max-w-md">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold rounded-full px-6 py-3 hover:bg-primary-700 transition-colors"
        >
          <FaHome /> Back to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;