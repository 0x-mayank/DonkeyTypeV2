import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../firebase";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userName, setUserName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rConfirm, setRConfirm] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      
      navigate("/test", { replace: true });
    } catch (err) {
      console.error(err);
      let msg = "Login failed";
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (!userName.trim() || !rEmail.trim() || !rPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (rPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (rPassword !== rConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, rEmail.trim(), rPassword);
      await api.post("/auth/register", {
        userName: userName.trim(),
      });
      await refreshUser();

      navigate("/test", { replace: true });
    } catch (err) {
      console.error(err);
      let msg = "Registration failed";
      
      if (err.response?.data?.error === 'user_exists') msg = "Username already taken.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (err.code === 'auth/weak-password') msg = "Password is too weak.";
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const cardClasses = "w-full max-w-3xl bg-white rounded-xl shadow-md p-12";
  const inputCls = "mt-2 block w-full rounded-md border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="font-display min-h-screen flex items-start justify-center bg-[#f2f0e3] text-gray-800 py-16">
      <div className={cardClasses}>
        <div className="text-center mb-6">
          <h1 className="text-6xl font-instrument font-semibold">
            Welcome to <span className="text-[#f76f53] italic">donkeyType</span>
          </h1>
          <p className="font-display mt-2 text-gray-500">Continue your typing journey</p>
        </div>

        <div className=" flex justify-between rounded-xl gap-1 m-10 bg-gray-200 p-1">
          <button
            onClick={() => { setTab("login"); setError(null); }}
            className={`py-3 rounded-lg w-[50%] text-sm font-medium  transition ${
              tab === "login" ? "bg-gray-700 text-white shadow hover:bg-gray-800": "text-gray-700 hover:bg-gray-300"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => { setTab("register"); setError(null); }}
            className={`px-4 py-3 rounded-lg w-[50%] text-sm font-medium transition ${
              tab=== "register"? "bg-gray-700 text-white shadow hover:bg-gray-800": "text-gray-700 hover:bg-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {error && <div className="font-display mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

        {tab === "login" && (
          <form onSubmit={submitLogin}>
            <label className=" block text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

            <label className="block text-sm text-gray-700 mt-4">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-md text-white ${
                loading ? "bg-gray-500" : "bg-gray-700 hover:bg-gray-800"
              }`}
            >
              <Zap size={16} strokeWidth={2} />
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={submitRegister}>
            <label className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              placeholder="your username"
              className={inputCls}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
              required
            />

            <label className="block text-sm text-gray-700 mt-4">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className={inputCls}
              value={rEmail}
              onChange={(e) => setREmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className={inputCls}
                  value={rPassword}
                  onChange={(e) => setRPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Confirm</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  className={inputCls}
                  value={rConfirm}
                  onChange={(e) => setRConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-md text-white ${
                loading ? "bg-gray-500" : "bg-gray-700 hover:bg-gray-800"
              }`}
            >
              <Zap size={16} strokeWidth={2} />
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}