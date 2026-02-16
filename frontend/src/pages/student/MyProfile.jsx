import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { Github, Linkedin, Globe } from "lucide-react";

export default function MyProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance.get("/auth/me").then((res) => {
      setUser(res.data.user);
    });
  }, []);

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl">

        <h2 className="text-3xl font-bold mb-8">
          My Placement Profile
        </h2>

        {/* Basic Info */}
        <div className="space-y-3">
          <p><b>Phone:</b> {user.phone}</p>
          <p><b>Course:</b> {user.course}</p>
          <p><b>College:</b> {user.college}</p>
          <p><b>Branch:</b> {user.branch}</p>
          <p><b>CGPA:</b> {user.cgpa}</p>
          <p><b>Batch:</b> {user.batch}</p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="font-bold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills?.map((s)=>(
              <span key={s} className="bg-indigo-600 text-white px-4 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 space-y-2">
          {user.linkedIn && (
            <a href={user.linkedIn} target="_blank" className="flex gap-2 items-center text-blue-600">
              <Linkedin size={18}/> LinkedIn
            </a>
          )}

          {user.github && (
            <a href={user.github} target="_blank" className="flex gap-2 items-center text-black">
              <Github size={18}/> GitHub
            </a>
          )}

          {user.website && (
            <a href={user.website} target="_blank" className="flex gap-2 items-center text-green-600">
              <Globe size={18}/> Website
            </a>
          )}
        </div>

        {/* Resume */}
        {user.resume?.secure_url && (
          <div className="mt-6">
            <a
              href={user.resume.secure_url}
              target="_blank"
              className="text-indigo-600 font-semibold"
            >
              View Resume (PDF)
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
