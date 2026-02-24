import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";
import logo from '../../assets/logo.jpeg';

export default function Footer() {
    return (
        <footer className="bg-[#2D1F17] text-[#A68F81] py-12 font-sans selection:bg-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start pb-12 border-b border-[#2D1F17]">

                    {/* Column 1: Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#2D1F17] bg-white p-1 shadow-inner">
                                <img src={logo} alt="Avani" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div>
                                <h2 className="text-white text-xl font-black tracking-tight uppercase leading-none">AVANI</h2>
                                <p className="text-[#8B7365] text-[10px] font-black tracking-[0.2em] uppercase mt-0.5 opacity-80">ENTERPRISES</p>
                            </div>
                        </div>

                        <p className="italic text-sm text-[#8B7365] leading-relaxed max-w-[280px] font-medium opacity-90">
                            "Bridging the gap between talent and opportunity. Your comprehensive campus placement partner."
                        </p>

                        <div className="flex items-start gap-3 text-white/90">
                            <MapPin className="text-[#8B7365] mt-0.5 shrink-0" size={18} />
                            <p className="text-sm leading-snug font-medium">
                                Tower B, 3rd Floor, Unitech Cyber Park, <br />
                                Sector 39, Gurugram, Haryana 122002
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <CircularSocial icon={<Instagram size={16} />} />
                            <CircularSocial icon={<Facebook size={16} />} />
                            <CircularSocial icon={<Twitter size={16} />} />
                            <CircularSocial icon={<Linkedin size={16} />} />
                            <CircularSocial icon={<Mail size={16} />} />
                        </div>
                    </div>

                    <div className="lg:pl-8">
                        <div className="mb-8">
                            <h3 className="text-white text-xl font-black mb-1 border-b-[3px] border-white/20 inline-block pb-1">
                                Our Ecosystem
                            </h3>
                        </div>

                        <div className="space-y-5">
                            <h4 className="text-white text-lg font-black border-b-2 border-white/20 inline-block pb-0.5">
                                Placement Hub
                            </h4>
                            <ul className="space-y-3">
                                <SolutionItem label="Student Profiles" />
                                <SolutionItem label="Active Drives" />
                                <SolutionItem label="Resume Builder" />
                                <SolutionItem label="Application Tracking" />
                                <SolutionItem label="Recruiter Analytics" />
                                <SolutionItem label="Interview Scheduler" />
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-white text-xl font-black border-b-2 border-white/20 inline-block pb-1">
                                Visit Us
                            </h3>
                        </div>

                        <div className="rounded-2xl overflow-hidden border-4 border-[#2D1F17] shadow-xl h-[240px] group/map transition-transform hover:scale-[1.01] duration-500">
                            <iframe
                                title="Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.563630654086!2d77.0543!3d28.4324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e383187211%3A0x6b72f1076f8e4001!2sUnitech%20Cyber%20Park!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 text-center text-[#8B7365] text-[11px] font-bold tracking-wider uppercase">
                    <p>
                        © 2026 Avani Placement Portal. All rights reserved. &nbsp; | &nbsp;
                        <span className="hover:text-white cursor-pointer transition-colors duration-300">Privacy Policy</span> &nbsp; | &nbsp;
                        Made with <span className="text-rose-500 animate-pulse inline-block">❤️</span> by <span className="text-white">Abhishek</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

function CircularSocial({ icon }) {
    return (
        <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A68F81] hover:bg-white hover:text-[#1A110B] hover:border-white transition-all duration-300 shadow-sm">
            {icon}
        </a>
    );
}

function SolutionItem({ label }) {
    return (
        <li className="flex items-center gap-2.5 text-sm font-bold group cursor-pointer hover:text-white transition-all duration-300">
            <span className="w-1h-1 rounded-full bg-white/20 group-hover:bg-white transition-colors duration-300">•</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">{label}</span>
        </li>
    );
}
