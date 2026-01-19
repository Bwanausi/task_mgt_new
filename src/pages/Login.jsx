import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", {
        username,
        password,
        rememberMe,
      });

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4">
        <div className="w-full max-w-md">
          <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to continue
              </p>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
                  {error}
                </div>
            )}

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-60"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-lg border px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-60"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded border-gray-300"
                />
                Remember me
              </label>

              <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-brand-70 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-950 hover:bg-teal-800 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Don’t have an account?{" "}
              <span
                  onClick={() => navigate("/register")}
                  className="text-brand-70 cursor-pointer hover:underline"
              >
              Sign up
            </span>
            </div>
          </form>
        </div>
      </div>
  );
}
