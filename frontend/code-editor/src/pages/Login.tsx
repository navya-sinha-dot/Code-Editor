import { useState } from "react";
import { setToken } from "../utils/token";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Code2 } from "lucide-react";
import { BACKEND_URL } from "../config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setToken(data.token);
      nav("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 pt-16">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text"
          >
            <Code2 size={28} className="text-violet-400" />
            CodeFlow
          </Link>
        </div>

        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
              <LogIn size={28} className="text-violet-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-slate-500">
              Sign in to continue to your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    className="pl-12"
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                  />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    className="pl-12"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                  />
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={loading}
                className="w-full bg-[#4C1170] hover:bg-[#5a1d82] h-12"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-center text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
