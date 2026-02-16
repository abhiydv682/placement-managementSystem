import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

export default function EditDrive() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDrive();
  }, []);

  const fetchDrive = async () => {
    try {
      const { data } = await axiosInstance.get(`/drives/admin`);
      const drive = data.find((d) => d._id === id);
      setForm(drive);
    } catch {
      toast.error("Failed to load drive");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateDrive = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axiosInstance.put(`/drives/${id}`, form);

      toast.success("Drive updated successfully");

      navigate("/admin/drives");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <form
        onSubmit={updateDrive}
        className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-indigo-600">
          Edit Drive
        </h2>

        <input
          type="text"
          name="jobRole"
          value={form.jobRole || ""}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        />

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        />

        <input
          type="text"
          name="qualification"
          value={form.qualification || ""}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        />

        <input
          type="number"
          name="vacancies"
          value={form.vacancies || ""}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        />

        <input
          type="date"
          name="deadline"
          value={
            form.deadline
              ? form.deadline.split("T")[0]
              : ""
          }
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        />

        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl">
          {loading ? "Updating..." : "Update Drive"}
        </button>
      </form>
    </Layout>
  );
}
