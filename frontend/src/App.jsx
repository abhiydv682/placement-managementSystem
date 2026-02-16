import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

/* ================= PAGES ================= */

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";

// Student Pages
import StudentDrives from "./pages/student/Drives";
import MyApplications from "./pages/student/MyApplications";
import Profile from "./pages/student/Profile";
import DriveDetail from "./pages/student/DriveDetail";

// Admin Pages
import Companies from "./pages/admin/Companies";
import AdminDrives from "./pages/admin/Drives";       // 🔥 LIST PAGE
import CreateDrive from "./pages/admin/CreateDrive"; // 🔥 CREATE PAGE
import EditDrive from "./pages/admin/EditDrive";     // 🔥 EDIT PAGE
import CompanyDetail from "./pages/admin/CompanyDetail";
import Applications from "./pages/admin/Applications";

// Recruiter Pages
import DriveApplicants from "./pages/recruiter/DriveApplicants";

// Common
import Notifications from "./components/common/Notifications";
import MyProfile from "./pages/student/MyProfile";

/* ==========================
   Protected Route
========================== */

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role)
    return <Navigate to="/login" replace />;

  return children;
};

/* ==========================
   Routes
========================== */

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Default redirect */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute role="admin">
            <Companies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/company/:id"
        element={
          <ProtectedRoute role="admin">
            <CompanyDetail />
          </ProtectedRoute>
        }
      />

      {/* 🔥 Drive List */}
      <Route
        path="/admin/drives"
        element={
          <ProtectedRoute role="admin">
            <AdminDrives />
          </ProtectedRoute>
        }
      />

      {/* 🔥 Create Drive */}
      <Route
        path="/admin/drives/create"
        element={
          <ProtectedRoute role="admin">
            <CreateDrive />
          </ProtectedRoute>
        }
      />

      {/* 🔥 Edit Drive */}
      <Route
        path="/admin/drives/edit/:id"
        element={
          <ProtectedRoute role="admin">
            <EditDrive />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute role="admin">
            <Applications />
          </ProtectedRoute>
        }
      />

      {/* ================= STUDENT ================= */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/drives"
        element={
          <ProtectedRoute role="student">
            <StudentDrives />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/applications"
        element={
          <ProtectedRoute role="student">
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="student">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/drives/:id"
        element={
          <ProtectedRoute role="student">
            <DriveDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-profile"
        element={
          <ProtectedRoute role="student">
            <MyProfile />
          </ProtectedRoute>
        }
      />

      {/* ================= RECRUITER ================= */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/drives"
        element={
          <ProtectedRoute role="recruiter">
            <DriveApplicants />
          </ProtectedRoute>
        }
      />

      {/* NOTIFICATIONS */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ==========================
   App Wrapper
========================== */

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
