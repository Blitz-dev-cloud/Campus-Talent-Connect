import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Building,
  Briefcase,
  Star,
} from "lucide-react";
import { Footer } from "../components/Footer";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/30">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              Trusted by 10,000+ students & alumni
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold mb-6 text-white leading-tight">
              Your Campus <span className="text-yellow-300">Network</span>,
              <br />
              Reimagined
            </h1>

            <p className="text-xl sm:text-2xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connect with students, alumni, and faculty. Discover
              opportunities, share knowledge, and build your future together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/auth/register")}
                className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "500+", label: "Opportunities" },
                { number: "50+", label: "Institutions" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
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
              color: "from-blue-500 to-blue-600",
              features: ["Job Board", "Mentorship", "Skill Building"],
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "For Alumni",
              desc: "Give back to your alma mater by sharing opportunities and mentoring the next generation.",
              color: "from-purple-500 to-purple-600",
              features: ["Post Jobs", "Mentor Students", "Network"],
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: "For Faculty",
              desc: "Post research projects, collaborate with peers, and connect with talented students.",
              color: "from-pink-500 to-pink-600",
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
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
            className="px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl text-lg"
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
