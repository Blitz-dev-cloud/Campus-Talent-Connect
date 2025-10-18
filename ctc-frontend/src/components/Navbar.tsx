import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  Home,
  User,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout, role } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  const navLinks = user
    ? [
        {
          icon: <Home className="w-4 h-4" />,
          label: "Dashboard",
          path: `/dashboard/${role}`,
        },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate(user ? `/dashboard/${role}` : "/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <span className="text-white font-bold text-sm">CTC</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-all"
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
                  className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-fuchsia-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all transform hover:scale-105 font-semibold text-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-fuchsia-600 rounded-full flex items-center justify-center">
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
                        <div className="p-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                          <div className="text-white font-semibold text-sm">
                            {(user as any)?.full_name || "User"}
                          </div>
                          <div className="text-white/80 text-xs">
                            {(user as any)?.email}
                          </div>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              navigate(`/dashboard/${role}`);
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Home size={16} />
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              navigate("/profile");
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 rounded-lg transition-colors flex items-center gap-2"
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
            className="md:hidden p-2 text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="bg-gradient-to-r from-indigo-50 to-fuchsia-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 font-bold text-sm">
                          {(user as any)?.full_name || "User"}
                        </div>
                        <div className="text-gray-600 text-xs capitalize flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          {role}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  {navLinks.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigate(link.path);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-cyan-50 hover:text-fuchsia-600 rounded-lg transition-all flex items-center gap-3 font-medium"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </button>
                  ))}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-3 font-medium mt-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Login/Register for non-authenticated users */}
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-3 font-medium"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-3 font-medium justify-center"
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
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
