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

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [isAdminMode, setIsAdminMode] =
    useState(false);

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
        user = await register(
          formData.name,
          formData.email,
          formData.password
        );
      } else {
        user = await login(
          formData.email,
          formData.password
        );
      }

      if (!user) return;

      if (user.role === "admin")
        navigate("/admin");
      else if (user.role === "student")
        navigate("/student");
      else navigate("/recruiter");
    } catch {
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-6xl bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2"
      >
        {/* ==================================
              LEFT PANEL (Hidden on small)
        =================================== */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white bg-gradient-to-br from-indigo-600/90 to-purple-700/90">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Avani Enterprises
          </motion.h1>

          <p className="text-lg opacity-80">
            Placement Management Portal
          </p>

          <div className="mt-10">
            <button
              onClick={() =>
                setIsAdminMode(
                  (prev) => !prev
                )
              }
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition"
            >
              {isAdminMode
                ? "Switch to User Login"
                : "Admin Login"}
            </button>
          </div>
        </div>

        {/* ==================================
              RIGHT PANEL
        =================================== */}
        <div className="p-8 sm:p-12 text-white">
          {/* Mobile Branding */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold">
              Avani Enterprises
            </h1>
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            {isSignup
              ? "Create Account"
              : isAdminMode
              ? "Admin Login"
              : "User Login"}
          </h2>

          <AnimatePresence mode="wait">
            <motion.form
              key={isSignup ? "signup" : "login"}
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -40,
              }}
              transition={{ duration: 0.3 }}
              onSubmit={submitHandler}
              className="space-y-5"
            >
              {isSignup && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full p-3 rounded-xl bg-white/25 placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={
                  handleChange
                }
                required
                className="w-full p-3 rounded-xl bg-white/25 placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={
                  handleChange
                }
                required
                className="w-full p-3 rounded-xl bg-white/25 placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
              />

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg"
              >
                {isSignup
                  ? "Sign Up"
                  : "Login"}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-6 text-sm text-center">
            {isSignup
              ? "Already have account?"
              : "Don't have account?"}
            <button
              onClick={() =>
                setIsSignup(
                  (prev) => !prev
                )
              }
              className="ml-2 underline font-semibold"
            >
              {isSignup
                ? "Login"
                : "Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
