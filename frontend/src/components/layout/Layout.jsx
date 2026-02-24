import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - z-index ensures it sits above when mobile */}
      <div className="z-50">
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
        <Navbar setOpen={setOpen} />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 scroll-smooth flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
