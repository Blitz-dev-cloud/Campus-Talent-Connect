import React from "react";
import {
  Mail,
  MapPin,
  Phone,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  ArrowRight,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  Heart,
  TrendingUp,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: <Users className="w-6 h-6" />,
              number: "10,000+",
              label: "Active Users",
            },
            {
              icon: <Briefcase className="w-6 h-6" />,
              number: "500+",
              label: "Job Postings",
            },
            {
              icon: <GraduationCap className="w-6 h-6" />,
              number: "50+",
              label: "Universities",
            },
            {
              icon: <Award className="w-6 h-6" />,
              number: "95%",
              label: "Success Rate",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
            >
              <div className="text-blue-400 mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                Stay Ahead of the Curve
              </h3>
              <p className="text-white/90">
                Join 10,000+ students getting weekly opportunities, career tips,
                and exclusive insights.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 w-full md:w-64"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap shadow-lg">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">CTC</span>
              </div>
              <span className="font-bold text-xl">Campus Talent Connect</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering the next generation by connecting students, alumni, and
              faculty. Build your network, discover opportunities, and grow
              together.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">Verified Users</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  icon: <Twitter className="w-5 h-5" />,
                  href: "#",
                  label: "Twitter",
                  color: "hover:bg-blue-500",
                },
                {
                  icon: <Linkedin className="w-5 h-5" />,
                  href: "#",
                  label: "LinkedIn",
                  color: "hover:bg-blue-600",
                },
                {
                  icon: <Facebook className="w-5 h-5" />,
                  href: "#",
                  label: "Facebook",
                  color: "hover:bg-blue-700",
                },
                {
                  icon: <Instagram className="w-5 h-5" />,
                  href: "#",
                  label: "Instagram",
                  color: "hover:bg-pink-600",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 bg-white/10 ${social.color} rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              For Students
            </h3>
            <ul className="space-y-3">
              {[
                "Find Jobs",
                "Internships",
                "Research Projects",
                "Mentorship",
                "Career Resources",
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Alumni */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              For Alumni
            </h3>
            <ul className="space-y-3">
              {[
                "Post Jobs",
                "Mentor Students",
                "Network Events",
                "Give Back",
                "Alumni Directory",
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:w-2 transition-all"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {[
                "About Us",
                "Our Mission",
                "Careers",
                "Press Kit",
                "Blog",
                "Contact",
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-pink-500 rounded-full group-hover:w-2 transition-all"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {[
                "Help Center",
                "FAQ",
                "Safety Tips",
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-green-500 rounded-full group-hover:w-2 transition-all"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <a
            href="mailto:hello@campustalent.com"
            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium text-sm mb-1">
                Email Us
              </div>
              <div className="text-gray-400 text-sm">
                hello@campustalent.com
              </div>
            </div>
          </a>

          <a
            href="tel:+1234567890"
            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium text-sm mb-1">Call Us</div>
              <div className="text-gray-400 text-sm">+1 (234) 567-890</div>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium text-sm mb-1">
                Visit Us
              </div>
              <div className="text-gray-400 text-sm">
                Campus, University Ave
              </div>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-xl p-6 mb-12 border border-white/10">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                text: "Lightning Fast",
                desc: "Instant notifications",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                text: "100% Secure",
                desc: "Your data protected",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                text: "Student First",
                desc: "Built for you",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                text: "Proven Results",
                desc: "95% success rate",
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-blue-400 mb-2">{feature.icon}</div>
                <div className="font-semibold text-white text-sm mb-1">
                  {feature.text}
                </div>
                <div className="text-gray-400 text-xs">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; 2025 Campus Talent Connect. All rights reserved. Made with
              ❤️ for students worldwide.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookies
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
