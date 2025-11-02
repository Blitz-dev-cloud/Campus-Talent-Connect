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
  const [userName, setUserName] = React.useState<string>("");

  // Fetch user's full name from profile
  React.useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          // Try to get from user object first
          if ((user as any)?.full_name) {
            setUserName((user as any).full_name);
            return;
          }

          // Try username from token
          if ((user as any)?.username) {
            setUserName((user as any).username);
            return;
          }

          // Otherwise fetch from profile using the api helper
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:8000"
            }/api/profiles/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );

          if (response.ok) {
            const profiles = await response.json();
            console.log("All profiles:", profiles);
            console.log("Current user ID:", (user as any)?.id);

            const userProfile = profiles.find((p: any) => {
              const userId = (user as any)?.id;
              // Check various ID formats
              const profileUserId =
                p.user_id_string ||
                (typeof p.user_id === "object" ? p.user_id?._id : p.user_id);

              console.log("Comparing:", profileUserId, "with", userId);
              return profileUserId === userId;
            });

            console.log("Found profile:", userProfile);

            if (userProfile?.full_name) {
              setUserName(userProfile.full_name);
            } else if ((user as any)?.email) {
              // Extract name from email as last resort
              const emailName = (user as any).email.split("@")[0].replace(/[._-]/g, ' ');
              const words = emailName.split(' ');
              const capitalizedName = words
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              setUserName(capitalizedName);
            } else {
              setUserName("User");
            }
          } else {
            // Fallback to email-based name
            if ((user as any)?.email) {
              const emailName = (user as any).email.split("@")[0].replace(/[._-]/g, ' ');
              const words = emailName.split(' ');
              const capitalizedName = words
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              setUserName(capitalizedName);
            } else {
              setUserName("User");
            }
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
          // Try to use email as name
          if ((user as any)?.email) {
            const emailName = (user as any).email.split("@")[0].replace(/[._-]/g, ' ');
            const words = emailName.split(' ');
            const capitalizedName = words
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            setUserName(capitalizedName);
          } else {
            setUserName("User");
          }
        }
      }
    };

    fetchUserName();
  }, [user]);

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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => navigate(user ? `/dashboard/${role}` : "/")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
            >
              <span className="text-white font-bold text-sm sm:text-base">
                CTC
              </span>
            </motion.div>
            <div className="hidden sm:block">
              <div className="font-bold text-base sm:text-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                Campus Talent Connect
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Empowering Your Future
              </div>
            </div>
            {/* Mobile - Show abbreviated text */}
            <div className="sm:hidden">
              <div className="font-bold text-sm bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                CTC
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
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {!user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/auth/login")}
                  className="px-4 lg:px-5 py-2 text-sm font-semibold text-gray-700 hover:text-fuchsia-600 transition-colors"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(192, 38, 211, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/auth/register")}
                  className="px-4 lg:px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold text-sm"
                >
                  Get Started
                </motion.button>
              </>
            ) : (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-gray-200 shadow-sm"
                  >
                    <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-indigo-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-md">
                      <User size={18} className="text-white" />
                    </div>
                    <span className="capitalize hidden lg:inline">{role}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

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
                            {userName || "User"}
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
          <div className="flex md:hidden items-center gap-2">
            {user && <NotificationBell />}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
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
                          {userName || "User"}
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
                      navigate("/auth/login");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-3 font-medium"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/auth/register");
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
