import { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../lib/api";

interface Notification {
  id: string | number;
  type: "info" | "success" | "warning" | "message";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get read notifications from localStorage for this specific user
  const getReadNotifications = useCallback((): Set<string> => {
    if (!user?.id) return new Set();
    const stored = localStorage.getItem(`notifications_read_${user.id}`);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }, [user]);

  // Save read notifications to localStorage for this specific user
  const saveReadNotifications = useCallback(
    (readIds: Set<string>) => {
      if (!user?.id) return;
      localStorage.setItem(
        `notifications_read_${user.id}`,
        JSON.stringify([...readIds])
      );
    },
    [user]
  );

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch applications for notifications - backend already filters by user role
      const response = await api.get("/api/applications");
      const apps = response.data || [];

      // Fetch unread messages count
      let unreadMessagesCount = 0;
      let messageNotifications: Notification[] = [];
      try {
        const messagesResponse = await api.get("/api/messages/unread/count");
        unreadMessagesCount = messagesResponse.data?.count || 0;

        // If there are unread messages, create a notification for it
        if (unreadMessagesCount > 0) {
          messageNotifications = [
            {
              id: "unread-messages",
              type: "message" as const,
              title: "New Messages",
              message: `You have ${unreadMessagesCount} unread message${
                unreadMessagesCount > 1 ? "s" : ""
              }`,
              createdAt: new Date().toISOString(),
              read: false,
            },
          ];
        }
      } catch (error) {
        console.error("Failed to fetch message notifications:", error);
      }

      // Get previously read notifications for this user
      const readIds = getReadNotifications();

      const userRole = user?.role;

      const notifs: Notification[] = apps.map((app: unknown, index: number) => {
        const appData = app as Record<string, unknown>;
        let type: "info" | "success" | "warning" = "info";
        let title = "Application Update";
        let message = "";
        const notifId = appData.id || appData._id || `${index}`;

        // Role-specific notification messages
        if (userRole === "student") {
          // Student sees their own application status
          if (appData.status === "accepted") {
            type = "success";
            title = "Application Accepted!";
            message = `Your application for "${
              appData.opportunity_title || "the opportunity"
            }" has been accepted.`;
          } else if (appData.status === "rejected") {
            type = "warning";
            title = "Application Status";
            message = `Your application for "${
              appData.opportunity_title || "the opportunity"
            }" was not selected.`;
          } else {
            type = "info";
            title = "Application Submitted";
            message = `Your application for "${
              appData.opportunity_title || "the opportunity"
            }" is under review.`;
          }
        } else if (userRole === "faculty" || userRole === "alumni") {
          // Faculty/Alumni see applications TO their opportunities
          const studentName = appData.student_name || "A student";

          if (appData.status === "pending") {
            type = "info";
            title = "New Application";
            message = `${studentName} applied to "${
              appData.opportunity_title || "your opportunity"
            }". Please review.`;
          } else if (appData.status === "accepted") {
            type = "success";
            title = "Application Accepted";
            message = `You accepted ${studentName}'s application for "${
              appData.opportunity_title || "your opportunity"
            }".`;
          } else if (appData.status === "rejected") {
            type = "warning";
            title = "Application Rejected";
            message = `You rejected ${studentName}'s application for "${
              appData.opportunity_title || "your opportunity"
            }".`;
          }
        }

        return {
          id: notifId,
          type,
          title,
          message,
          createdAt: (appData.created_at as string) || new Date().toISOString(),
          read: readIds.has(String(notifId)),
        };
      });

      // Merge message notifications with application notifications
      const allNotifications = [...messageNotifications, ...notifs];

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [user, getReadNotifications]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 10 seconds
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const markAsRead = (id: string | number) => {
    const readIds = getReadNotifications();
    readIds.add(String(id));
    saveReadNotifications(readIds);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    const readIds = getReadNotifications();
    notifications.forEach((n) => readIds.add(String(n.id)));
    saveReadNotifications(readIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel - Compact on all screens */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[70] max-h-[70vh] sm:max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    Notifications
                  </h3>
                  <p className="text-white/80 text-xs">{unreadCount} unread</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-white/90 hover:text-white bg-white/20 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-white/30 transition-all"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      No notifications yet
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      We'll notify you when something happens
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer ${
                          !notif.read ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex gap-2.5">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug">
                                {notif.title}
                              </h4>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-gray-600 text-xs mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {formatDate(notif.createdAt)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border-t border-gray-100 text-center flex-shrink-0">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium active:text-blue-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
