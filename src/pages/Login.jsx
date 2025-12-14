import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../firebase";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const useTypewriter = (words, typingSpeed = 80, deletingSpeed = 40) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const i = loopNum % words.length;
    const fullText = words[i];

    const handleTyping = () => {
      setText(isDeleting ? fullText.substring(0, text.length - 1): fullText.substring(0, text.length + 1))
      if (!isDeleting && text === fullText){
        setTimeout(() => setIsDeleting(true), 1000);
        setTyping(false);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTyping(true);
      } else {
        setTyping(true);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed]);

  return text;
};

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const typingText = useTypewriter([
    "Type like a beast, or a donkey",
    "Continue your typing journey",
    "Climb the global leaderboard"
  ]);

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
      await refreshUser();
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

  const cardClasses = "w-full max-w-3xl bg-white rounded-2xl shadow-xl p-12 transition-all duration-500 hover:shadow-2xl";
  const inputCls = `mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 transition-all duration-300 ease-out placeholder:text-gray-400mhover:bg-white hover:border-gray-300 focus:bg-white focus:-translate-y-1 focus:border-[#f76f53] focus:ring-4 focus:ring-[#f76f53]/15 focus:outline-none`;

  return (
    <div className="font-display flex items-start justify-center bg-[#f2f0e3] text-gray-800 py-16 ">
      <div className={cardClasses}>
        <div className="text-center mb-8">
          <h1 className="text-6xl font-instrument font-semibold mb-2">
            Welcome to <span className="text-[#f76f53] italic">donkeyType</span>
          </h1>
          
          <p className="font-display h-6 text-gray-500 font-medium text-lg">
            {typingText}
            <span className="animate-pulse text-[#f76f53]">|</span>
          </p>
        </div>

        <div className="flex justify-between rounded-xl gap-1 m-10 bg-gray-100 p-1.5 border border-gray-200">
          <button
            onClick={() => { setTab("login"); setError(null); }}
            className={`py-3 rounded-lg w-[50%] text-sm font-bold tracking-wide transition-all duration-300 ${
              tab === "login" 
              ? "bg-gray-700 hover:bg-gray-800 text-white shadow-md transform scale-[1.02]"
              : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => {setTab("register"); setError(null)}}
            className={`px-4 py-3 rounded-lg w-[50%] text-sm font-bold tracking-wide transition-all duration-300 ${
              tab=== "register"
              ? "bg-gray-700 hover:bg-gray-800 text-white shadow-md transform scale-[1.02]"
              : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {error && <div className="font-display mb-6 text-sm text-red-700 bg-red-50 border border-red-100 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">{error}</div>}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tab === "login" && (
            <form onSubmit={submitLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className={inputCls}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform active:scale-[0.98] ${
                  loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gray-700 hover:bg-gray-800 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5"
                }`}
              >
                <Zap size={18} strokeWidth={2.5} className={loading ? "animate-spin" : ""} />
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={submitRegister}>
              <div>
                <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="your username"
                  className={inputCls}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={inputCls}
                  value={rEmail}
                  onChange={(e) => setREmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 chars"
                    className={inputCls}
                    value={rPassword}
                    onChange={(e) => setRPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Confirm</label>
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
                className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform active:scale-[0.98] ${
                  loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gray-700 hover:bg-gray-800 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5"
                }`}
              >
                <Zap size={18} strokeWidth={2.5} className={loading ? "animate-spin" : ""} />
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}