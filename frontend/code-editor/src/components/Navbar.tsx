import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken } from "../utils/token";
import { LogOut, LayoutDashboard, Code2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
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
            <Button
              variant="ghost"
              asChild
              className="text-slate-300 hover:text-white hover:bg-white/5"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border-transparent hover:border-violet-500/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-[#4C1170] hover:bg-[#5a1d82]">
              <Link to="/signup">Get Started</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
