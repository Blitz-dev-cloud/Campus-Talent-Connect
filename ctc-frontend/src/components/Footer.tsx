import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  Heart,
  TrendingUp,
  Send,
} from "lucide-react";

export const Footer: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12 border-b border-white/10"
        >
          {[
            {
              icon: <Users className="w-6 h-6" />,
              number: "10,000+",
              label: "Active Users",
              color: "from-cyan-500 to-blue-500",
            },
            {
              icon: <Briefcase className="w-6 h-6" />,
              number: "500+",
              label: "Job Postings",
              color: "from-fuchsia-500 to-pink-500",
            },
            {
              icon: <GraduationCap className="w-6 h-6" />,
              number: "50+",
              label: "Universities",
              color: "from-indigo-500 to-purple-500",
            },
            {
              icon: <Award className="w-6 h-6" />,
              number: "95%",
              label: "Success Rate",
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:bg-white/10 cursor-pointer overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              ></div>
              <div
                className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform inline-block`}
              >
                {stat.icon}
              </div>
              <div className="text-3xl font-black mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="my-12"
        >
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4">
                  <Zap className="w-4 h-4" />
                  Newsletter
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-3 text-white">
                  Stay Ahead of the Curve
                </h3>
                <p className="text-white/90 text-lg">
                  Join 10,000+ students getting weekly opportunities, career
                  tips, and exclusive insights delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto min-w-[300px]">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 bg-white text-fuchsia-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 py-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                <span className="text-white font-black text-xl">CTC</span>
              </div>
              <div>
                <div className="font-black text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Campus Talent
                </div>
                <div className="text-sm text-cyan-400">Connect</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering the next generation by connecting students, alumni, and
              faculty. Build your network, discover opportunities, and grow
              together.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all group">
                <Shield className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-300 font-medium">
                  Secure Platform
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-fuchsia-500/50 transition-all group">
                <Award className="w-4 h-4 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-300 font-medium">
                  Verified Users
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  icon: <Twitter className="w-5 h-5" />,
                  href: "#",
                  label: "Twitter",
                  gradient: "from-cyan-500 to-blue-500",
                },
                {
                  icon: <Linkedin className="w-5 h-5" />,
                  href: "#",
                  label: "LinkedIn",
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  icon: <Facebook className="w-5 h-5" />,
                  href: "#",
                  label: "Facebook",
                  gradient: "from-indigo-600 to-purple-600",
                },
                {
                  icon: <Instagram className="w-5 h-5" />,
                  href: "#",
                  label: "Instagram",
                  gradient: "from-fuchsia-500 to-pink-600",
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-11 h-11 bg-gradient-to-br ${social.gradient} rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl`}
                >
                  <div className="text-white">{social.icon}</div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* For Students */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
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
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <motion.span
                      whileHover={{ scale: 1.5 }}
                      className="w-1.5 h-1.5 bg-cyan-500 rounded-full"
                    ></motion.span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Alumni */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
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
                    className="text-gray-400 hover:text-fuchsia-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <motion.span
                      whileHover={{ scale: 1.5 }}
                      className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"
                    ></motion.span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-5 text-white">Company</h3>
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
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <motion.span
                      whileHover={{ scale: 1.5 }}
                      className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                    ></motion.span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-5 text-white">Support</h3>
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
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <motion.span
                      whileHover={{ scale: 1.5 }}
                      className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                    ></motion.span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

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
