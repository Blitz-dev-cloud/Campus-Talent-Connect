import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  Home,
  Briefcase,
  Users,
  BookOpen,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ isOpen, setIsOpen }) => {
  const { user, logout, role } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navLinks = user
    ? [
        {
          icon: <Home className="w-4 h-4" />,
          label: "Dashboard",
          path: `/dashboard/${role}`,
        },
        {
          icon: <Briefcase className="w-4 h-4" />,
          label: "Opportunities",
          path: `/dashboard/${role}`,
        },
        {
          icon: <Users className="w-4 h-4" />,
          label: "Network",
          path: `/dashboard/${role}`,
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          label: "Resources",
          path: `/dashboard/${role}`,
        },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate(user ? `/dashboard/${role}` : "/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <span className="text-white font-bold text-sm">CTC</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Campus Talent Connect
              </span>
              <div className="text-xs text-gray-500">
                Empowering Your Future
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-semibold text-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="capitalize">{role}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                      >
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600">
                          <div className="text-white font-semibold text-sm">
                            {user?.name || "User"}
                          </div>
                          <div className="text-white/80 text-xs">
                            {user?.email}
                          </div>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              navigate(`/dashboard/${role}`);
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Home size={16} />
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              navigate("/profile");
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <User size={16} />
                            Profile
                          </button>
                          <hr className="my-2 border-gray-200" />
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {user && (
                <>
                  {/* User Info Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {user?.name || "User"}
                        </div>
                        <div className="text-white/80 text-xs capitalize">
                          {role}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Nav Links */}
                  {navLinks.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigate(link.path);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-3"
                    >
                      {link.icon}
                      {link.label}
                    </button>
                  ))}

                  <hr className="my-2 border-gray-200" />
                </>
              )}

              {!user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/auth/login");
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/auth/register");
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-3"
                  >
                    <User size={18} />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-3"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
