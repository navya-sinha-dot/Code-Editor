import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Zap, Users, Terminal, Cpu, Globe } from "lucide-react";
import { getToken } from "../utils/token";
import { Component as EtheralShadow } from "../components/eternal-shadows";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const isLoggedIn = !!getToken();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:text-white overflow-hidden">
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EtheralShadow
            color="rgba(140, 90, 255, 1)"
            animation={{ scale: 100, speed: 90 }}
            noise={{ opacity: 1, scale: 1.2 }}
            sizing="fill"
          />
        </div>

        <div className="absolute inset-0 bg-black/30 z-[1]" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6"
          >
            <span className="bg-gray-300 text-transparent bg-clip-text">
              Code Flow
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed mb-10"
          >
            A next-generation collaborative code editor. Experience seamless
            pair programming with real-time sync, built-in terminal, and instant
            chat.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4">
            {isLoggedIn ? (
              <Button
                asChild
                size="lg"
                className="bg-[#4C1170] hover:bg-[#5a1d82] text-white px-8 h-14 rounded-xl text-lg font-semibold shadow-xl hover:scale-105 transition"
              >
                <Link to="/dashboard">Go to Dashboard →</Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-[#4C1170] hover:bg-[#5a1d82] text-white px-8 h-14 rounded-xl text-lg font-semibold shadow-xl hover:scale-105 transition"
              >
                <Link to="/signup">Start Coding Free →</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#12121a] shadow-violet-500/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0d0d12]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-700/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-700/80" />
                  <div className="w-3 h-3 rounded-full bg-green-700/80" />
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
                    <span className="text-purple-800">const</span>{" "}
                    <span className="text-blue-600">greeting</span> ={" "}
                    <span className="text-amber-600">"Hello, World!"</span>;
                    <br />
                    <span className="text-purple-600">function</span>{" "}
                    <span className="text-yellow-600">main</span>() {"{"}
                    <br />
                    {"  "}
                    <span className="text-blue-600">console</span>.
                    <span className="text-yellow-600">log</span>(
                    <span className="text-blue-600">greeting</span>);
                    <br />
                    {"  "}
                    <span className="text-purple-600">return</span>{" "}
                    <span className="text-orange-600">0</span>;
                    <br />
                    {"}"}
                    <br />
                    <br />
                    <span className="text-yellow-600">main</span>();
                  </div>
                </div>
              </div>

              <div className="absolute top-24 right-20 flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500 text-white text-xs font-medium shadow-violet-500/50">
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
              Built for <span className="text-violet-600">developers</span>
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
              icon={<Terminal className="text-violet-400" size={28} />}
              title="Integrated Terminal"
              description="Run your code directly in the browser."
            />
            <FeatureCard
              icon={<Code2 className="text-violet-400" size={28} />}
              title="Monaco Editor"
              description="Powered by VS Code editor."
            />
            <FeatureCard
              icon={<Zap className="text-violet-400" size={28} />}
              title="Lightning Fast"
              description="Sub-50ms WebSocket sync."
            />
            <FeatureCard
              icon={<Cpu className="text-violet-400" size={28} />}
              title="Built-in Chat"
              description="Chat without leaving the editor."
            />
            <FeatureCard
              icon={<Globe className="text-violet-400" size={28} />}
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
      className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-violet-500"
    >
      <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}
