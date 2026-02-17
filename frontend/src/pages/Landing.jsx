import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Smartphone, Globe, Shield, Zap } from "lucide-react";
import Footer from "../components/layout/Footer";

import { useAuth } from "../context/AuthContext";

export default function Landing() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-indigo-50 flex flex-col font-sans">

            {/* NAVBAR */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">A</div>
                        Avani Enterprise
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link
                                to={`/${user.role}`}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                            >
                                Go to Dashboard <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">Login</Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        New: Recruiter Notifications Live!
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-indigo-900 mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
                        Your Future Starts <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Right Here.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-indigo-800/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                        Connecting ambitious students with top-tier companies. Streamline your placement journey with our intelligent, responsive platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                            Start Your Journey <ArrowRight size={20} />
                        </Link>
                        <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 border-2 border-indigo-100 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-indigo-900 mb-4">Why Choose Us?</h2>
                        <p className="text-indigo-800/60 max-w-xl mx-auto">Built for the modern campus recruitment ecosystem.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Smartphone size={32} />}
                            title="Mobile First Design"
                            desc="Access your dashboard, apply to drives, and track status from any device, anywhere."
                        />
                        <FeatureCard
                            icon={<Zap size={32} />}
                            title="Real-time Updates"
                            desc="Instant notifications for recruiters and students. Never miss an interview call again."
                        />
                        <FeatureCard
                            icon={<Shield size={32} />}
                            title="Secure & Private"
                            desc="Enterprise-grade security for your data. Your resume and academic records are safe with us."
                        />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 bg-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Hired?</h2>
                    <p className="text-indigo-200 text-lg mb-8">Join thousands of students and 500+ companies already using our platform.</p>
                    <Link to="/register" className="inline-block bg-white text-indigo-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg">
                        Create Free Account
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-8 rounded-[2rem] bg-indigo-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 border border-transparent hover:border-indigo-100 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-indigo-100">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-indigo-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
            <p className="text-indigo-800/60 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}
