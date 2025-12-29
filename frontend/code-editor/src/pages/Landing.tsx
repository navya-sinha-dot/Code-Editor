import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Users,
  Terminal,
  Cpu,
  Globe,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";
import { getToken } from "../utils/token";
import Illustration from "../assets/Illustration.svg";

export default function Landing() {
  const isLoggedIn = !!getToken();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-800/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-800/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 sm:pt-30 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h1 className="text-7xl font-black mb-8">
                <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 text-transparent bg-clip-text">
                  Code Together.
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 text-transparent bg-clip-text">
                  Build Faster.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                A next-generation collaborative code editor. Experience seamless
                pair programming with real-time sync, built-in terminal, and
                instant chat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="group px-8 py-4 bg-[#4C1170] hover:from-violet-500 hover:to-indigo-500 text-white text-lg font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center gap-3 w-fit"
                  >
                    Go to Dashboard
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="group px-8 py-4 bg-[#4C1170] hover:from-violet-500 hover:to-indigo-500 text-white text-lg font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center gap-3 w-fit"
                    >
                      Start Coding Free
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-lg font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-3 w-fit"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md h-[360px]  flex items-center justify-center text-slate-400">
                <img
                  src={Illustration}
                  alt="Illustration"
                  className="w-86 md:w-[900px] object-contain transform transition duration-500 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#12121a] shadow-2xl shadow-violet-500/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0d0d12]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-sm text-slate-500 font-mono">
                  main.ts
                </div>
              </div>

              <div className="p-6 font-mono text-sm text-left">
                <div className="flex gap-4">
                  <div className="text-slate-600 select-none">
                    1<br />2<br />3<br />4<br />5<br />6<br />7
                  </div>
                  <div>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">greeting</span> ={" "}
                    <span className="text-amber-300">"Hello, World!"</span>;
                    <br />
                    <span className="text-purple-400">function</span>{" "}
                    <span className="text-yellow-400">main</span>() {"{"}
                    <br />
                    {"  "}
                    <span className="text-blue-400">console</span>.
                    <span className="text-yellow-400">log</span>(
                    <span className="text-blue-400">greeting</span>);
                    <br />
                    {"  "}
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-orange-400">0</span>;
                    <br />
                    {"}"}
                    <br />
                    <br />
                    <span className="text-yellow-400">main</span>();
                  </div>
                </div>
              </div>

              <div className="absolute top-24 right-20 flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500 text-white text-xs font-medium shadow-lg shadow-violet-500/50">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                John is typing...
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-transparent via-[#0d0d14] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Built for <span className="text-violet-400">developers</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Everything you need to collaborate on code in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Users className="text-violet-400" size={28} />}
              title="Real-time Collaboration"
              description="See your teammates' cursors and edits instantly."
            />
            <FeatureCard
              icon={<Terminal className="text-emerald-400" size={28} />}
              title="Integrated Terminal"
              description="Run your code directly in the browser."
            />
            <FeatureCard
              icon={<Code2 className="text-pink-400" size={28} />}
              title="Monaco Editor"
              description="Powered by VS Code editor."
            />
            <FeatureCard
              icon={<Zap className="text-amber-400" size={28} />}
              title="Lightning Fast"
              description="Sub-50ms WebSocket sync."
            />
            <FeatureCard
              icon={<Cpu className="text-cyan-400" size={28} />}
              title="Built-in Chat"
              description="Chat without leaving the editor."
            />
            <FeatureCard
              icon={<Globe className="text-indigo-400" size={28} />}
              title="Cloud Sync"
              description="Access projects anywhere."
            />
          </div>
        </div>
      </div>

      <footer className="relative z-10 py-12 border-t border-white/5 text-center text-slate-500">
        © {new Date().getFullYear()} CodeFlow. Crafted for developers who ship.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-violet-500/30 hover:bg-violet-500/[0.03]"
    >
      <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}
