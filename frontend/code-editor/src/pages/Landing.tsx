import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Zap, Users, Terminal, Cpu, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Code Together. <br /> Build Faster.
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              A premium real-time collaborative code editor. Experience seamless
              pair programming with built-in chat, instant sync, and powerful
              tools.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Start Coding for Free <Zap size={20} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white text-lg font-semibold rounded-full border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to build
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Packed with features to make your coding experience smooth and
              collaborative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="text-indigo-400" size={32} />}
              title="Real-time Collaboration"
              description="Edit code simultaneously with your team. See cursors and changes in real-time."
            />
            <FeatureCard
              icon={<Terminal className="text-purple-400" size={32} />}
              title="Monaco Editor"
              description="Powered by VS Code's editor engine for a familiar and powerful editing experience."
            />
            <FeatureCard
              icon={<Code2 className="text-pink-400" size={32} />}
              title="Syntax Highlighting"
              description="Support for multiple languages including TypeScript, JavaScript, Python, and C++."
            />
            <FeatureCard
              icon={<Zap className="text-yellow-400" size={32} />}
              title="Lightning Fast"
              description="Optimized performance with WebSocket connections for instant updates."
            />
            <FeatureCard
              icon={<Cpu className="text-emerald-400" size={32} />}
              title="Built-in Chat"
              description="Communicate with your team without leaving the editor. Context is key."
            />
            <FeatureCard
              icon={<Globe className="text-cyan-400" size={32} />}
              title="Cloud Sync"
              description="Your code is saved automatically to the cloud. Never lose your work."
            />
          </div>
        </div>
      </div>

      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-center text-slate-500">
        <p>© {new Date().getFullYear()} CodeFlow. Built for developers.</p>
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
      whileHover={{ y: -5 }}
      className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors"
    >
      <div className="mb-4 bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
