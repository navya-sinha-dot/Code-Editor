import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken } from "../utils/token";
import { LogOut, LayoutDashboard, Code2, ChevronRight } from "lucide-react";

export default function Navbar() {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditorPage = location.pathname.startsWith("/editor");

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  if (isEditorPage) {
    return (
      <nav className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e2e] bg-[#0d0d14] text-slate-100 h-12">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text"
          >
            <Code2 size={20} className="text-violet-400" />
            CodeFlow
          </Link>
          <ChevronRight size={16} className="text-slate-600" />
          <Link
            to="/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl text-slate-100">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text"
      >
        <Code2 size={24} className="text-violet-400" />
        CodeFlow
      </Link>

      <div className="flex items-center gap-3">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-[#4C1170] hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-violet-500/20"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
