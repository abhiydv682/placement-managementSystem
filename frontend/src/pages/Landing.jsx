import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Smartphone, Globe, Shield, Zap, TrendingUp, Users, Building2, Star, Rocket, Layout, Trophy } from "lucide-react";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import logo from '../assets/logo.jpeg'

export default function Landing() {
    const { user } = useAuth();
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const marqueeVariants = {
        animate: {
            x: [0, -1035],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear",
                },
            },
        },
    };

    const floatingBlob = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden selection:bg-indigo-600 selection:text-white">

            {/* NAVBAR */}
            <nav className="bg-white/70 backdrop-blur-2xl sticky top-0 z-50 border-b border-slate-100/80 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 transition-transform hover:scale-105"
                    >
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center p-1 shadow-2xl shadow-indigo-200">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-slate-900">AVANI</span>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <Link
                                to={`/${user.role}`}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black hover:bg-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-200 flex items-center gap-2 active:scale-95 text-sm md:text-base"
                            >
                                Dashboard <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-500 font-black hover:text-indigo-600 transition-colors text-sm md:text-base hidden sm:block">Log In</Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 flex items-center gap-2 active:scale-95 text-sm md:text-base">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-48">
                {/* Advanced Animated Background */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <motion.div
                        variants={floatingBlob}
                        animate="animate"
                        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[140px] opacity-60"
                    ></motion.div>
                    <motion.div
                        animate={{
                            y: [0, 30, 0],
                            x: [0, -20, 0],
                            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] opacity-60"
                    ></motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center"
                    >
                        <motion.div variants={itemVariants} className="inline-block mb-10">
                            <span className="px-5 py-2.5 rounded-full bg-indigo-50 text-indigo-700 text-xs md:text-sm font-black tracking-widest uppercase border border-indigo-100/50 shadow-sm flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                                </span>
                                Next-Gen Placement Ecosystem
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            style={{ y: yHero }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-[-0.04em] leading-[0.9] md:leading-[1]"
                        >
                            Future-Proof <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 bg-clip-text text-transparent">Your Career.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-slate-500 font-medium leading-relaxed mb-16">
                            AVANI is the all-in-one placement engine for ambitious students and top recruiters. Where massive opportunities meet exceptional talent.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-slate-900 hover:scale-105 transition-all shadow-3xl shadow-indigo-100 flex items-center justify-center gap-3">
                                Start Your Journey <ArrowRight size={22} />
                            </Link>
                            <Link to="/about" className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 border-4 border-slate-50 rounded-[2rem] font-black text-lg hover:bg-slate-50 hover:border-slate-100 transition-all shadow-sm">
                                View Platform
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* INFINITE MARQUEE SECTION */}
            <section className="py-12 bg-slate-50/50 backdrop-blur-sm border-y border-slate-100 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Powering placement for elite institutions</p>
                </div>

                <div className="flex overflow-hidden grayscale opacity-30 group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <motion.div
                        variants={marqueeVariants}
                        animate="animate"
                        className="flex gap-20 items-center whitespace-nowrap py-4"
                    >
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-20 items-center">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">GOOGLE</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">MICROSOFT</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">AMAZON</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">META</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">ADOBE</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">TESLA</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">NETFLIX</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
                        >
                            Your Path to <span className="text-indigo-600">Placement</span>.
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[25%] left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>

                        <StepItem
                            number="01"
                            title="Build Profile"
                            desc="Create your professional identity with a smart resume parser and skill tracker."
                            icon={<Users size={28} />}
                        />
                        <StepItem
                            number="02"
                            title="Discover Roles"
                            desc="Access an exclusive list of placement drives curated for your profile."
                            icon={<SearchIcon size={28} />}
                        />
                        <StepItem
                            number="03"
                            title="Seal the Deal"
                            desc="Track interview rounds in real-time and get hired by world-class companies."
                            icon={<Trophy size={28} />}
                        />
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
                        <div className="max-w-2xl">
                            <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Unrivaled Power</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Built for the <br /> modern career.</h2>
                        </div>
                        <p className="text-slate-500 font-bold text-lg max-w-sm border-l-4 border-indigo-600 pl-6 py-2">We've automated the chaos. Focus on what matters: Your interview.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        <FeatureCard
                            icon={<Smartphone size={32} />}
                            title="Mobile First"
                            desc="A desktop-class experience in the palm of your hand. Anywhere, anytime."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Zap size={32} />}
                            title="Zero Delay"
                            desc="Real-time webhooks ensure you are updated the second a company releases results."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Shield size={32} />}
                            title="Safe & Secure"
                            desc="Your personal and academic data is protected by enterprise-grade encryption."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                        <StatItem value="15k+" label="Students" />
                        <StatItem value="500+" label="Partners" />
                        <StatItem value="3k+" label="Offers" />
                        <StatItem value="98%" label="Success" />
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-48 bg-white text-center">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-[6rem] font-black text-slate-900 mb-10 tracking-[-0.05em] leading-[0.85]">Ready to <span className="text-indigo-600">WIN?</span></h2>
                        <p className="text-slate-500 text-lg md:text-xl lg:text-2xl mb-16 font-medium max-w-xl mx-auto leading-tight">Join the next generation of professionals.</p>
                        <Link to="/register" className="inline-flex items-center gap-4 bg-indigo-600 text-white px-12 py-5 rounded-[3rem] font-black text-xl hover:bg-slate-900 transition-all shadow-4xl shadow-indigo-100 group">
                            Register Now <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function StepItem({ number, title, desc, icon }) {
    return (
        <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group"
        >
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 border-2 border-indigo-100/50 shadow-sm relative group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                {icon}
                <span className="absolute -top-3 -right-3 w-10 h-10 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-all">{number}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed px-4">{desc}</p>
        </motion.div>
    );
}

function FeatureCard({ icon, title, desc, delay }) {
    return (
        <motion.div
            whileHover={{ y: -12, scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="p-12 rounded-[3rem] bg-white border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-500 group"
        >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-10 border border-slate-100/80 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                {icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
                {desc}
            </p>
        </motion.div>
    );
}

function StatItem({ value, label }) {
    return (
        <div className="text-center md:text-left">
            <p className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">{value}</p>
            <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">{label}</p>
        </div>
    );
}

function SearchIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}
