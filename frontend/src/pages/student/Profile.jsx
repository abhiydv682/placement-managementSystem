


// import { useState, useEffect } from "react";
// import Layout from "../../components/layout/Layout";
// import axiosInstance from "../../services/axiosInstance";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";
// import {
//   UploadCloud,
//   Save,
//   Moon,
//   Sun,
//   X,
//   GraduationCap,
//   Code2,
//   Eye,
//   User as UserIcon,
//   Camera,
//   Link as LinkIcon,
//   Github,
//   Linkedin,
//   Globe,
//   FileText
// } from "lucide-react";

// export default function Profile() {
//   const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

//   const [form, setForm] = useState({
//     phone: "",
//     course: "",
//     college: "",
//     branch: "",
//     cgpa: "",
//     batch: "",
//     bio: "",
//     linkedIn: "",
//     github: "",
//     website: "",
//   });

//   const [skills, setSkills] = useState([]);
//   const [skillInput, setSkillInput] = useState("");
//   const [resume, setResume] = useState(null);
//   const [profilePic, setProfilePic] = useState(null);

//   const [resumePreview, setResumePreview] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [dark, setDark] = useState(false);

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data } = await axiosInstance.get("/auth/me");
//         const user = data.user;

//         setForm({
//           phone: user.phone || "",
//           course: user.course || "",
//           college: user.college || "",
//           branch: user.branch || "",
//           cgpa: user.cgpa || "",
//           batch: user.batch || "",
//           bio: user.bio || "",
//           linkedIn: user.linkedIn || "",
//           github: user.github || "",
//           website: user.website || "",
//         });

//         setSkills(user.skills || []);

//         if (user.profilePic?.secure_url) {
//           const imgUrl = user.profilePic.secure_url.startsWith("http")
//             ? user.profilePic.secure_url
//             : BASE_URL + user.profilePic.secure_url;
//           setImagePreview(imgUrl);
//         }

//         if (user.resume?.secure_url) {
//           const resUrl = user.resume.secure_url.startsWith("http")
//             ? user.resume.secure_url
//             : BASE_URL + user.resume.secure_url;
//           setResumePreview(resUrl);
//         }
//       } catch (err) {
//         toast.error("Profile load failed");
//       }
//     };
//     fetchProfile();
//   }, []);

//   /* ================= HANDLERS ================= */
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleFileChange = (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (type === "image") {
//       setProfilePic(file);
//       setImagePreview(URL.createObjectURL(file));
//     } else {
//       setResume(file);
//       setResumePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSkill = (e) => {
//     e.preventDefault();
//     if (skillInput.trim() && !skills.includes(skillInput.trim())) {
//       setSkills([...skills, skillInput.trim()]);
//       setSkillInput("");
//     }
//   };

//   const removeSkill = (skill) =>
//     setSkills(skills.filter((s) => s !== skill));

//   /* ================= SAVE PROFILE ================= */
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const formData = new FormData();
//       Object.keys(form).forEach((key) => {
//         formData.append(key, form[key]);
//       });
//       formData.append("skills", skills.join(","));
//       if (resume) formData.append("resume", resume);
//       if (profilePic) formData.append("profilePic", profilePic);

//       await axiosInstance.put("/auth/profile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Profile Saved Successfully 🚀");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Save failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className={`min-h-screen py-10 ${dark ? "bg-slate-900" : "bg-slate-50"}`}>
//         <div className="max-w-5xl mx-auto p-4">
//           <motion.form
//             onSubmit={submitHandler}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl space-y-10 border border-slate-100 dark:border-slate-700"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center">
//               <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
//                 <GraduationCap className="text-indigo-600" size={36} />
//                 Placement Profile
//               </h2>
//               <button
//                 type="button"
//                 onClick={() => setDark(!dark)}
//                 className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all hover:scale-110"
//               >
//                 {dark ? <Sun /> : <Moon />}
//               </button>
//             </div>

//             {/* Profile Image Section */}
//             <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-indigo-50/50 dark:bg-slate-700/50 rounded-[1.5rem]">
//               <div className="relative group">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
//                   {imagePreview ? (
//                     <img src={imagePreview} className="w-full h-full object-cover" />
//                   ) : (
//                     <UserIcon className="w-full h-full p-8 text-slate-300" />
//                   )}
//                 </div>
//                 <label className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full text-white cursor-pointer shadow-md hover:bg-indigo-700 transition-colors">
//                   <Camera size={18} />
//                   <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
//                 </label>
//               </div>
//               <div className="text-center md:text-left">
//                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Profile Photo</h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Make sure your face is clearly visible.</p>
//               </div>
//             </div>

//             {/* Academic Info */}
//             <div className="space-y-6">
//               <h3 className="text-lg font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
//                 <FileText size={20} /> Academic Details
//               </h3>
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="98765..." />
//                 <Input label="Current Course" name="course" value={form.course} onChange={handleChange} placeholder="B.Tech" />
//                 <Input label="College Name" name="college" value={form.college} onChange={handleChange} placeholder="UIET..." />
//                 <Input label="Specialization / Branch" name="branch" value={form.branch} onChange={handleChange} placeholder="CSE" />
//                 <Input label="Current CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="8.5" />
//                 <Input label="Batch (Passing Year)" name="batch" value={form.batch} onChange={handleChange} placeholder="2022-26" />
//               </div>
//             </div>

//             {/* Professional Links */}
//             <div className="space-y-6">
//               <h3 className="text-lg font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
//                 <LinkIcon size={20} /> Professional Links
//               </h3>
//               <div className="grid md:grid-cols-3 gap-6">
//                 <div className="relative">
//                    <Linkedin className="absolute left-3 top-10 text-slate-400" size={18} />
//                    <Input label="LinkedIn" name="linkedIn" value={form.linkedIn} onChange={handleChange} paddingLeft="pl-10" placeholder="linkedin.com/in/..." />
//                 </div>
//                 <div className="relative">
//                    <Github className="absolute left-3 top-10 text-slate-400" size={18} />
//                    <Input label="GitHub" name="github" value={form.github} onChange={handleChange} paddingLeft="pl-10" placeholder="github.com/..." />
//                 </div>
//                 <div className="relative">
//                    <Globe className="absolute left-3 top-10 text-slate-400" size={18} />
//                    <Input label="Portfolio/Website" name="website" value={form.website} onChange={handleChange} paddingLeft="pl-10" placeholder="mywebsite.com" />
//                 </div>
//               </div>
//             </div>

//             {/* Bio */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Professional Bio</label>
//               <textarea
//                 name="bio"
//                 value={form.bio}
//                 onChange={handleChange}
//                 placeholder="Briefly describe yourself to recruiters..."
//                 className="w-full border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
//               />
//             </div>

//             {/* Skills */}
//             <div className="space-y-4">
//               <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
//                 <Code2 size={18} /> Skills & Expertise
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   value={skillInput}
//                   onChange={(e) => setSkillInput(e.target.value)}
//                   placeholder="e.g. ReactJS, Node.js, Python"
//                   className="border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 flex-1 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={addSkill}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
//                 >
//                   Add
//                 </button>
//               </div>

//               <div className="flex flex-wrap gap-3 mt-4">
//                 {skills.map((s) => (
//                   <motion.span
//                     layout
//                     key={s}
//                     className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-semibold border border-indigo-100 dark:border-indigo-800 flex items-center gap-2 shadow-sm"
//                   >
//                     {s}
//                     <X size={16} onClick={() => removeSkill(s)} className="cursor-pointer hover:text-red-500 transition-colors" />
//                   </motion.span>
//                 ))}
//               </div>
//             </div>

//             {/* Resume Section */}
//             <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center gap-4 transition-all hover:border-indigo-400">
//               <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md text-indigo-600">
//                 <UploadCloud size={32} />
//               </div>
//               <div className="text-center">
//                  <p className="font-bold text-slate-800 dark:text-white">Upload Your Resume</p>
//                  <p className="text-sm text-slate-500">Only PDF format allowed</p>
//               </div>
//               <input type="file" accept=".pdf" className="hidden" id="resumeInput" onChange={(e) => handleFileChange(e, "resume")} />
//               <label htmlFor="resumeInput" className="cursor-pointer text-indigo-600 font-bold hover:underline">Click to Browse</label>

//               {resumePreview && (
//                 <a href={resumePreview} target="_blank" className="flex items-center gap-2 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg mt-2">
//                   <Eye size={18} /> View Uploaded PDF
//                 </a>
//               )}
//             </div>

//             {/* Save Button */}
//             <button
//               disabled={loading}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-extrabold text-lg shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 disabled:bg-indigo-300"
//             >
//               {loading ? "🚀 Saving Records..." : "Save My Profile"}
//             </button>
//           </motion.form>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// /* INPUT COMPONENT */
// function Input({ label, name, value, onChange, placeholder, paddingLeft = "pl-4" }) {
//   return (
//     <div className="space-y-2">
//       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
//         {label}
//       </label>
//       <input
//         type="text"
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm ${paddingLeft}`}
//       />
//     </div>
//   );
// }



// import { useState, useEffect } from "react";
// import Layout from "../../components/layout/Layout";
// import axiosInstance from "../../services/axiosInstance";
// import toast from "react-hot-toast";
// import {
//   Edit,
//   Save,
//   Github,
//   Linkedin,
//   Globe,
//   Phone,
//   GraduationCap,
//   User,
// } from "lucide-react";

// export default function Profile() {
//   const [editMode, setEditMode] =
//     useState(false);

//   const [form, setForm] =
//     useState({
//       name: "",
//       phone: "",
//       course: "",
//       college: "",
//       branch: "",
//       cgpa: "",
//       batch: "",
//       bio: "",
//       linkedIn: "",
//       github: "",
//       website: "",
//     });

//   const [skills, setSkills] =
//     useState([]);

//   const [skillInput, setSkillInput] =
//     useState("");

//   const [loading, setLoading] =
//     useState(false);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     const fetchUser =
//       async () => {
//         const { data } =
//           await axiosInstance.get(
//             "/auth/me"
//           );

//         const user =
//           data.user;

//         setForm({
//           name: user.name || "",
//           phone:
//             user.phone || "",
//           course:
//             user.course ||
//             "",
//           college:
//             user.college ||
//             "",
//           branch:
//             user.branch ||
//             "",
//           cgpa:
//             user.cgpa || "",
//           batch:
//             user.batch || "",
//           bio: user.bio || "",
//           linkedIn:
//             user.linkedIn ||
//             "",
//           github:
//             user.github ||
//             "",
//           website:
//             user.website ||
//             "",
//         });

//         setSkills(
//           user.skills || []
//         );
//       };

//     fetchUser();
//   }, []);

//   /* ================= EDIT HANDLER ================= */

//   const handleChange = (
//     e
//   ) => {
//     setForm({
//       ...form,
//       [e.target.name]:
//         e.target.value,
//     });
//   };

//   const addSkill =
//     (e) => {
//       e.preventDefault();
//       if (
//         skillInput.trim() &&
//         !skills.includes(
//           skillInput.trim()
//         )
//       ) {
//         setSkills([
//           ...skills,
//           skillInput.trim(),
//         ]);
//         setSkillInput("");
//       }
//     };

//   const removeSkill =
//     (skill) =>
//       setSkills(
//         skills.filter(
//           (s) => s !== skill
//         )
//       );

//   /* ================= SAVE ================= */

//   const saveProfile =
//     async (e) => {
//       e.preventDefault();

//       try {
//         setLoading(true);

//         await axiosInstance.put(
//           "/auth/profile",
//           {
//             ...form,
//             skills:
//               skills.join(","),
//           }
//         );

//         toast.success(
//           "Profile Saved"
//         );

//         setEditMode(false);
//       } catch {
//         toast.error(
//           "Save failed"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//   return (
//     <Layout>
//       <div className="max-w-5xl mx-auto p-8">

//         {/* ================= HEADER ================= */}

//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold">
//             My Placement Profile
//           </h2>

//           <button
//             onClick={() =>
//               setEditMode(
//                 !editMode
//               )
//             }
//             className="flex gap-2 items-center bg-indigo-600 text-white px-6 py-2 rounded-xl"
//           >
//             {editMode ? (
//               <>
//                 <User size={18} />
//                 View Mode
//               </>
//             ) : (
//               <>
//                 <Edit size={18} />
//                 Edit Profile
//               </>
//             )}
//           </button>
//         </div>

//         {/* ================= VIEW MODE ================= */}

//         {!editMode && (
//           <div className="bg-white p-10 rounded-3xl shadow-xl space-y-8">

//             {/* Identity Card */}
//             <div className="border-b pb-6">
//               <h3 className="text-2xl font-bold">
//                 {form.name}
//               </h3>
//               <p className="text-gray-500">
//                 {form.course} –{" "}
//                 {form.branch}
//               </p>
//             </div>

//             {/* Contact Info */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <Info
//                 icon={Phone}
//                 label="Phone"
//                 value={
//                   form.phone
//                 }
//               />
//               <Info
//                 icon={
//                   GraduationCap
//                 }
//                 label="College"
//                 value={
//                   form.college
//                 }
//               />
//             </div>

//             {/* Academic */}
//             <div>
//               <h4 className="font-bold mb-3">
//                 Academic Details
//               </h4>
//               <p>
//                 CGPA:{" "}
//                 {form.cgpa}
//               </p>
//               <p>
//                 Batch:{" "}
//                 {form.batch}
//               </p>
//             </div>

//             {/* Skills */}
//             <div>
//               <h4 className="font-bold mb-3">
//                 Skills
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {skills.map(
//                   (s) => (
//                     <span
//                       key={s}
//                       className="bg-indigo-600 text-white px-4 py-1 rounded-full"
//                     >
//                       {s}
//                     </span>
//                   )
//                 )}
//               </div>
//             </div>

//             {/* Links */}
//             <div className="space-y-2">
//               {form.linkedIn && (
//                 <a
//                   href={
//                     form.linkedIn
//                   }
//                   target="_blank"
//                   className="flex gap-2 items-center text-blue-600"
//                 >
//                   <Linkedin size={18} />
//                   LinkedIn
//                 </a>
//               )}

//               {form.github && (
//                 <a
//                   href={
//                     form.github
//                   }
//                   target="_blank"
//                   className="flex gap-2 items-center"
//                 >
//                   <Github size={18} />
//                   GitHub
//                 </a>
//               )}

//               {form.website && (
//                 <a
//                   href={
//                     form.website
//                   }
//                   target="_blank"
//                   className="flex gap-2 items-center text-green-600"
//                 >
//                   <Globe size={18} />
//                   Portfolio
//                 </a>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ================= EDIT MODE ================= */}

//         {editMode && (
//           <form
//             onSubmit={
//               saveProfile
//             }
//             className="bg-white p-8 rounded-3xl shadow-xl space-y-6"
//           >
//             <div className="grid md:grid-cols-2 gap-6">
//               <Input label="Phone" name="phone" value={form.phone} onChange={handleChange}/>
//               <Input label="Course" name="course" value={form.course} onChange={handleChange}/>
//               <Input label="College" name="college" value={form.college} onChange={handleChange}/>
//               <Input label="Branch" name="branch" value={form.branch} onChange={handleChange}/>
//               <Input label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange}/>
//               <Input label="Batch" name="batch" value={form.batch} onChange={handleChange}/>
//             </div>

//             {/* Skills */}
//             <div>
//               <label className="font-semibold">
//                 Skills
//               </label>

//               <div className="flex gap-2 mt-2">
//                 <input
//                   value={
//                     skillInput
//                   }
//                   onChange={(e)=>
//                     setSkillInput(
//                       e.target.value
//                     )
//                   }
//                   className="border p-2 flex-1"
//                 />
//                 <button
//                   type="button"
//                   onClick={
//                     addSkill
//                   }
//                   className="bg-indigo-600 text-white px-4"
//                 >
//                   Add
//                 </button>
//               </div>

//               <div className="flex gap-2 mt-2 flex-wrap">
//                 {skills.map(
//                   (s) => (
//                     <span
//                       key={s}
//                       className="bg-indigo-600 text-white px-3 py-1 rounded-full"
//                     >
//                       {s}
//                     </span>
//                   )
//                 )}
//               </div>
//             </div>

//             <button
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white py-3 rounded-xl"
//             >
//               <Save className="inline mr-2"/>
//               {loading
//                 ? "Saving..."
//                 : "Save Changes"}
//             </button>
//           </form>
//         )}
//       </div>
//     </Layout>
//   );
// }

// function Input({
//   label,
//   name,
//   value,
//   onChange,
// }) {
//   return (
//     <div>
//       <label className="block mb-1 font-medium">
//         {label}
//       </label>
//       <input
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border p-2 rounded-lg"
//       />
//     </div>
//   );
// }

// function Info({
//   icon: Icon,
//   label,
//   value,
// }) {
//   return (
//     <div className="flex gap-3 items-center">
//       <Icon size={20}/>
//       <div>
//         <p className="text-sm text-gray-500">
//           {label}
//         </p>
//         <p className="font-semibold">
//           {value}
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import {
  Edit,
  Save,
  Github,
  Linkedin,
  Globe,
  Phone,
  GraduationCap,
  User,
  Camera,
  FileText,
  Download,
  UploadCloud,
  X,
  Eye,
} from "lucide-react";
import Modal from "../../components/common/Modal";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", course: "", college: "", branch: "",
    cgpa: "", batch: "", bio: "", linkedIn: "", github: "", website: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // File States
  const [resume, setResume] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  // Preview States
  const [imagePreview, setImagePreview] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [showResumePreview, setShowResumePreview] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");
        const user = data.user;

        setForm({
          name: user.name || "",
          phone: user.phone || "",
          course: user.course || "",
          college: user.college || "",
          branch: user.branch || "",
          cgpa: user.cgpa || "",
          batch: user.batch || "",
          bio: user.bio || "",
          linkedIn: user.linkedIn || "",
          github: user.github || "",
          website: user.website || "",
        });
        setSkills(user.skills || []);

        // Profile Pic Preview
        if (user.profilePic?.secure_url) {
          setImagePreview(user.profilePic.secure_url.startsWith("http")
            ? user.profilePic.secure_url
            : BASE_URL + user.profilePic.secure_url);
        }

        // Resume Preview/Download Link
        if (user.resume?.secure_url) {
          setResumeUrl(user.resume.secure_url.startsWith("http")
            ? user.resume.secure_url
            : BASE_URL + user.resume.secure_url);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image") {
      setProfilePic(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setResume(file);
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  /* ================= SAVE (MULTIPART FORM) ================= */
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      // Append Form Fields
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append("skills", skills.join(","));

      // Append Files
      if (profilePic) formData.append("profilePic", profilePic);
      if (resume) formData.append("resume", resume);

      const { data } = await axiosInstance.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Profile Updated 🚀");

      // Update local states with new URLs from backend
      if (data.user.resume?.secure_url) {
        const resUrl = data.user.resume.secure_url.startsWith("http")
          ? data.user.resume.secure_url
          : BASE_URL + data.user.resume.secure_url;
        setResumeUrl(resUrl);
      }

      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">My Profile</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex gap-2 items-center bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            {editMode ? <><User size={18} /> View Mode</> : <><Edit size={18} /> Edit Profile</>}
          </button>
        </div>

        {!editMode ? (
          /* ================= VIEW MODE ================= */
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 border-b pb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-slate-100 shadow-inner shrink-0">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <User className="w-full h-full p-6 md:p-8 text-slate-300" />}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-slate-800">{form.name}</h3>
                <p className="text-indigo-600 font-semibold">{form.course} – {form.branch}</p>
                <div className="flex gap-4 mt-4 justify-center md:justify-start text-slate-500">
                  {form.linkedIn && <a href={form.linkedIn} target="_blank"><Linkedin size={20} className="hover:text-blue-600" /></a>}
                  {form.github && <a href={form.github} target="_blank"><Github size={20} className="hover:text-black" /></a>}
                  {form.website && <a href={form.website} target="_blank"><Globe size={20} className="hover:text-green-600" /></a>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Contact & Education</h4>
                <Info icon={Phone} label="Phone" value={form.phone} />
                <Info icon={GraduationCap} label="College" value={form.college} />
                <div className="flex flex-wrap gap-6 md:gap-10">
                  <div><p className="text-sm text-gray-500">CGPA</p><p className="font-bold">{form.cgpa}</p></div>
                  <div><p className="text-sm text-gray-500">Batch</p><p className="font-bold">{form.batch}</p></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => <span key={s} className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold">{s}</span>)}
                </div>
              </div>
            </div>

            {resumeUrl && (
              <div className="mt-6 p-6 bg-slate-50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0"><FileText /></div>
                  <div className="text-left"><p className="font-bold text-slate-800 text-sm md:text-base">Professional Resume</p><p className="text-xs text-slate-500">PDF Document</p></div>
                </div>


                {/* <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResumePreview(true)}
                    className="flex-1 md:flex-none justify-center gap-2 items-center bg-indigo-50 border border-indigo-100 px-4 md:px-6 py-2 rounded-xl font-bold text-indigo-600 hover:bg-indigo-100 transition whitespace-nowrap text-sm md:text-base"
                  >
                    <Eye size={18} /> Preview
                  </button>
                  <a href={resumeUrl} download target="_blank" className="flex-1 md:flex-none justify-center gap-2 items-center bg-white border border-slate-200 px-4 md:px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition whitespace-nowrap text-sm md:text-base">
                    <Download size={18} /> Download
                  </a>
                </div> */}

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-center md:justify-end">

                  {/* Preview Button */}
                  {/* <button
                    type="button"
                    onClick={() => setShowResumePreview(true)}
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 
                      bg-indigo-50 border border-indigo-100 
                      px-4 md:px-6 py-2 rounded-xl 
                      font-bold text-indigo-600 
                      hover:bg-indigo-100 transition 
                      whitespace-nowrap text-sm md:text-base"
                    >
                    <Eye size={18} />
                    Preview
                  </button> */}
                  <a
                    href={resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 
                      bg-white border border-slate-200 
                      px-4 md:px-6 py-2 rounded-xl 
                      font-bold text-slate-600 
                      hover:bg-slate-50 transition 
                      whitespace-nowrap text-sm md:text-base"
                  >
                    <Eye size={18} />
                    Preview
                  </a>

                  {/* Download Button */}
                  <a
                    href={resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 
                      bg-white border border-slate-200 
                      px-4 md:px-6 py-2 rounded-xl 
                      font-bold text-slate-600 
                      hover:bg-slate-50 transition 
                      whitespace-nowrap text-sm md:text-base"
                  >
                    <Download size={18} />
                    Download
                  </a>

                </div>



              </div>
            )}
          </div>
        ) : (
          /* ================= EDIT MODE ================= */
          <form onSubmit={saveProfile} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6 md:space-y-8">
            {/* Profile Pic Upload */}
            <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-sm">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <User className="w-full h-full p-6 text-slate-200" />}
              </div>
              <div>
                <label className="flex gap-2 items-center bg-white border px-4 py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-slate-50">
                  <Camera size={16} /> Upload Photo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
                </label>
                <p className="text-xs text-slate-400 mt-2">JPG or PNG. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
              <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Input label="Course" name="course" value={form.course} onChange={handleChange} />
              <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
              <Input label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} />
              <Input label="Batch" name="batch" value={form.batch} onChange={handleChange} />
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <label className="font-semibold text-slate-700">Skills</label>
              <div className="flex gap-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className="border p-3 flex-1 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. React" />
                <button type="button" onClick={addSkill} className="bg-indigo-600 text-white px-6 rounded-xl font-bold">Add</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {skills.map(s => (
                  <span key={s} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2 font-medium">
                    {s} <X size={14} className="cursor-pointer" onClick={() => removeSkill(s)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-3">
              <label className="font-semibold text-slate-700">Resume (PDF)</label>
              <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center hover:bg-slate-50 transition">
                <input type="file" id="resume" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, "resume")} />
                <label htmlFor="resume" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud size={40} className="text-indigo-600" />
                  <span className="font-bold text-slate-700">{resume ? resume.name : "Click to upload your resume"}</span>
                  <span className="text-xs text-slate-400">PDF format only</span>
                </label>
              </div>
              {resumeUrl && (
                <div className="text-center mt-2">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline">
                    <Eye size={16} /> Preview Current Resume
                  </a>
                </div>
              )}
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
              {loading ? "Updating Profile..." : <><Save className="inline mr-2" /> Save Changes</>}
            </button>
          </form>
        )}
        {/* Resume Preview Modal */}
        <Modal
          isOpen={showResumePreview}
          onClose={() => setShowResumePreview(false)}
          title="Resume Preview"
        >
          <div className="w-full h-[75vh]">
            <iframe
              src={resumeUrl}
              className="w-full h-full rounded-lg border border-slate-200"
              title="Resume Preview"
            />
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

// Reusable Components
function Input({ label, name, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-600">{label}</label>
      <input name={name} value={value} onChange={onChange} className="w-full border-slate-200 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition" />
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl">
      <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><Icon size={20} /></div>
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase">{label}</p>
        <p className="font-bold text-slate-700">{value || "Not Set"}</p>
      </div>
    </div>
  );
}


