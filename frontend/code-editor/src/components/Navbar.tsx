import { Link, useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../utils/token";

export default function Navbar() {
  const token = getToken();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 text-slate-100">
      <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
        CodeFlow
      </Link>

      <div className="space-x-4">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                clearToken();
                navigate("/login");
              }}
              className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 rounded transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
