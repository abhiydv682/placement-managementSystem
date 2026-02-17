import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-indigo-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">A</span>
                            Avani Enterprise
                        </h2>
                        <p className="text-indigo-200 text-sm leading-relaxed">
                            Empowering students and recruiters to connect seamlessly. Your gateway to a successful career starts here.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon icon={<Facebook size={18} />} />
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Instagram size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-indigo-200">Quick Links</h3>
                        <ul className="space-y-3 test-sm">
                            <FooterLink to="/" label="Home" />
                            <FooterLink to="/login" label="Login" />
                            <FooterLink to="/register" label="Register" />
                            <FooterLink to="/about" label="About Us" />
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-indigo-200">Resources</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/student" label="For Students" />
                            <FooterLink to="/recruiter" label="For Recruiters" />
                            <FooterLink to="/support" label="Support Center" />
                            <FooterLink to="/privacy" label="Privacy Policy" />
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-indigo-200">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-indigo-100">
                            <li className="flex items-start gap-3">
                                <MapPin className="shrink-0 text-indigo-500" size={18} />
                                <span>123 University Avenue,<br />Tech City, TC 90210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="shrink-0 text-indigo-500" size={18} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="shrink-0 text-indigo-500" size={18} />
                                <span>support@placementportal.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-indigo-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-indigo-300">
                    <p>© {new Date().getFullYear()} Placement Portal. All rights reserved.</p>
                    <p>Designed with ❤️ for Students</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all">
            {icon}
        </a>
    );
}

function FooterLink({ to, label }) {
    return (
        <li>
            <Link to={to} className="text-indigo-100 hover:text-indigo-400 transition-colors text-sm block">
                {label}
            </Link>
        </li>
    );
}
