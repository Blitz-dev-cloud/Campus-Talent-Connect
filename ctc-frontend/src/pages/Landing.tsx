import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Building,
  Briefcase,
  Star,
  Zap,
} from "lucide-react";
import { Footer } from "../components/Footer";

const Landing = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Hero Section - Aurora Nebula */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden min-h-screen flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"
            animate={{
              x: mousePosition.x / 50,
              y: mousePosition.y / 50,
            }}
            transition={{ type: "spring", stiffness: 50 }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-3xl"
            animate={{
              x: -mousePosition.x / 40,
              y: -mousePosition.y / 40,
            }}
            transition={{ type: "spring", stiffness: 50 }}
          />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-8 border border-white/30 shadow-lg"
            >
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Trusted by 10,000+ students & alumni worldwide</span>
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl sm:text-8xl font-black mb-8 text-white leading-tight"
            >
              Your Campus{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent">
                Network
              </span>
              ,<br />
              <span className="text-5xl sm:text-7xl">Reimagined</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl mb-12 text-white/95 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Connect with students, alumni, and faculty. Discover
              opportunities, share knowledge, and build your future together.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <motion.button
                onClick={() => navigate("/auth/register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-10 py-5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold rounded-2xl hover:from-fuchsia-600 hover:to-cyan-600 transition-all shadow-2xl hover:shadow-fuchsia-500/50 flex items-center gap-3 text-lg"
              >
                <Zap className="w-6 h-6" />
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border-3 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-all backdrop-blur-sm text-lg"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: "10K+", label: "Active Users", icon: Users },
                { number: "500+", label: "Opportunities", icon: Briefcase },
                { number: "50+", label: "Institutions", icon: Building },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:bg-white/20 transition-all"></div>
                  <div className="relative text-center p-6 backdrop-blur-sm border border-white/20 rounded-2xl">
                    <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-3" />
                    <div className="text-5xl font-black text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/90 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                <motion.div
                  className="w-1.5 h-3 bg-white rounded-full"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Built for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're a student, alumni, or faculty member, we've got the
            tools you need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <GraduationCap className="w-8 h-8" />,
              title: "For Students",
              desc: "Discover internships, jobs, and research opportunities tailored to your interests and skills.",
              color: "from-indigo-500 to-purple-600",
              features: ["Job Board", "Mentorship", "Skill Building"],
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "For Alumni",
              desc: "Give back to your alma mater by sharing opportunities and mentoring the next generation.",
              color: "from-fuchsia-500 to-pink-600",
              features: ["Post Jobs", "Mentor Students", "Network"],
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: "For Faculty",
              desc: "Post research projects, collaborate with peers, and connect with talented students.",
              color: "from-cyan-500 to-blue-600",
              features: ["Research Posts", "Collaboration", "Student Pool"],
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{item.desc}</p>
              <div className="space-y-2">
                {item.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Campus Talent Connect?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need in one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Building className="w-6 h-6" />,
                title: "Verified Network",
                desc: "Connect with real students, alumni, and faculty from your institution",
              },
              {
                icon: <Briefcase className="w-6 h-6" />,
                title: "Real Opportunities",
                desc: "Access genuine internships, jobs, and research positions",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Mentorship",
                desc: "Get guidance from experienced alumni in your field",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Career Growth",
                desc: "Build your profile and showcase your achievements",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Aurora Nebula */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students, alumni, and faculty building their
            future together.
          </p>
          <button
            onClick={() => navigate("/auth/register")}
            className="px-10 py-5 bg-white text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 font-bold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl text-lg border-2 border-white"
          >
            Create Free Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
