// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import toast from "react-hot-toast";

// export default function Login() {
//   const [isSignup, setIsSignup] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const { login, register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       let user;

//       if (isSignup) {
//         user = await register(
//           formData.name,
//           formData.email,
//           formData.password
//         );
//         toast.success("Account Created");
//       } else {
//         user = await login(
//           formData.email,
//           formData.password
//         );
//         toast.success("Login Successful");
//       }

//       // 🔥 ROLE BASED REDIRECT
//       if (user.role === "admin") {
//         navigate("/admin");
//       } else if (user.role === "student") {
//         navigate("/student");
//       } else {
//         navigate("/recruiter");
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-5xl bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden"
//       >
//         {/* LEFT PANEL */}
//         <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10 flex-col justify-center">
//           <h1 className="text-4xl font-bold mb-4">
//             Avani Enterprises
//           </h1>
//           <p className="text-lg opacity-80">
//             Placement Management Portal
//           </p>

//           <button
//             onClick={() =>
//               setIsAdmin((prev) => !prev)
//             }
//             className="mt-8 px-4 py-2 bg-white/20 rounded-lg"
//           >
//             {isAdmin
//               ? "Switch to User"
//               : "Admin Login"}
//           </button>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="w-full md:w-1/2 p-10">
//           <h2 className="text-2xl font-bold text-white mb-6">
//             {isSignup
//               ? "Create Account"
//               : isAdmin
//               ? "Admin Login"
//               : "User Login"}
//           </h2>

//           <AnimatePresence mode="wait">
//             <motion.form
//               key={isSignup ? "signup" : "login"}
//               onSubmit={submitHandler}
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -40 }}
//             >
//               {isSignup && (
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Full Name"
//                   className="w-full p-3 mb-4 rounded-lg bg-white/30 text-white placeholder-white/70 outline-none"
//                   onChange={handleChange}
//                   required
//                 />
//               )}

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 className="w-full p-3 mb-4 rounded-lg bg-white/30 text-white placeholder-white/70 outline-none"
//                 onChange={handleChange}
//                 required
//               />

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 className="w-full p-3 mb-6 rounded-lg bg-white/30 text-white placeholder-white/70 outline-none"
//                 onChange={handleChange}
//                 required
//               />

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:scale-105 transition"
//               >
//                 {isSignup
//                   ? "Sign Up"
//                   : "Login"}
//               </button>
//             </motion.form>
//           </AnimatePresence>

//           <p className="mt-6 text-sm text-white">
//             {isSignup
//               ? "Already have account?"
//               : "Don't have account?"}
//             <button
//               onClick={() =>
//                 setIsSignup((prev) => !prev)
//               }
//               className="ml-2 underline"
//             >
//               {isSignup
//                 ? "Login"
//                 : "Sign Up"}
//             </button>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }




import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Briefcase, User, ShieldCheck } from "lucide-react";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [activeTab, setActiveTab] = useState("student"); // student | recruiter | admin

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  /* =============================
     HANDLE INPUT
  ============================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =============================
     SUBMIT
  ============================== */

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Fill all fields");
    }

    try {
      let user;

      if (isSignup) {
        if (activeTab === "admin") {
          return toast.error("Admin signup is disabled");
        }

        user = await register(
          formData.name,
          formData.email,
          formData.password,
          activeTab // Pass role (student or recruiter)
        );
      } else {
        user = await login(
          formData.email,
          formData.password
        );
      }

      if (!user) return;

      // Role check for security: ensure they are logging into the correct portal
      if (activeTab === "admin" && user.role !== "admin") {
        toast.error("Access Denied: You are not an Admin");
        return;
      }

      // Auto Redirect based on role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "recruiter") navigate("/recruiter");
      else navigate("/student");

    } catch {
      toast.error("Authentication failed");
    }
  };

  const tabs = [
    { id: "student", label: "Student", icon: User, color: "from-blue-600 to-indigo-600" },
    { id: "recruiter", label: "Recruiter", icon: Briefcase, color: "from-purple-600 to-pink-600" },
    { id: "admin", label: "Admin", icon: ShieldCheck, color: "from-slate-700 to-slate-900" }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${currentTab.color} p-4 transition-all duration-500`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden grid md:grid-cols-2 border border-white/20"
      >
        {/* ==================================
              LEFT PANEL (Brand + Tabs)
        =================================== */}
        <div className="hidden md:flex flex-col justify-between p-12 text-white bg-black/20 relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-2 tracking-tight"
            >
              Placement Portal
            </motion.h1>
            <p className="opacity-70 text-lg">Manage your career journey with ease.</p>
          </div>

          <div className="space-y-4 relative z-10">
            <p className="text-sm uppercase tracking-widest opacity-60 font-bold mb-2">Select Portal</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${activeTab === tab.id ? 'bg-white/20 border-white/40 shadow-lg translate-x-2' : 'hover:bg-white/10 border-transparent opacity-70 hover:opacity-100'}`}
              >
                <div className={`p-2 rounded-xl bg-white/10 ${activeTab === tab.id ? 'text-white' : ''}`}>
                  <tab.icon size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">{tab.label}</h3>
                  <p className="text-xs opacity-70">Login as {tab.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ==================================
              RIGHT PANEL (Form)
        =================================== */}
        <div className="p-8 sm:p-12 text-white flex flex-col justify-center bg-white/5">
          {/* Mobile Branding */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold">Placement Portal</h1>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex p-1 bg-black/20 rounded-2xl mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-white/70'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-full bg-white/10 mb-4 border border-white/20 shadow-inner">
              <currentTab.icon size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">
              {isSignup ? `Create ${currentTab.label} Account` : `${currentTab.label} Login`}
            </h2>
            <p className="text-white/60 mt-2">
              {isSignup ? "Join us and start your journey" : "Welcome back, please enter your details"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isSignup ? "signup" : "login"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={submitHandler}
              className="space-y-4"
            >
              {isSignup && (
                <div className="space-y-1">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    onChange={handleChange}
                    required
                    className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-bold ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold ml-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 mt-4 bg-white text-black font-extrabold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all"
              >
                {isSignup ? "Create Account" : "Access Portal"}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {activeTab !== "admin" && (
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                {isSignup ? "Already have an account?" : "New to the platform?"}
                <button
                  onClick={() => setIsSignup((prev) => !prev)}
                  className="ml-2 text-white font-bold hover:underline"
                >
                  {isSignup ? "Login here" : "Create account"}
                </button>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
