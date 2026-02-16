import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    await register(form.name, form.email, form.password);

    navigate("/student"); // After register go to student dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 px-4">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition duration-300"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
