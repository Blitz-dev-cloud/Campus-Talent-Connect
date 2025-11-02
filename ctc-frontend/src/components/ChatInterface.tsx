import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, User } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";
import { AuthContext } from "../context/AuthContext";

interface Message {
  _id: string;
  application_id: string;
  sender_id: {
    _id: string;
    full_name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  receiver_id: {
    _id: string;
    full_name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  message: string;
  read: boolean;
  created_at: string;
}

interface ChatInterfaceProps {
  applicationId: string;
  receiverId: string;
  receiverName: string;
  opportunityTitle: string;
  receiverProfilePicture?: string;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  applicationId,
  receiverId,
  receiverName,
  opportunityTitle,
  receiverProfilePicture,
  onClose,
}) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [applicationId]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/messages/${applicationId}`);
      setMessages(response.data);

      // Mark unread messages as read
      const unreadMessages = response.data.filter(
        (msg: Message) => msg.receiver_id._id === user?.id && !msg.read
      );

      for (const msg of unreadMessages) {
        await api.patch(`/api/messages/${msg._id}/read`);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      const messageData = {
        application_id: applicationId,
        receiver_id: receiverId,
        message: newMessage.trim(),
      };

      console.log("Sending message with data:", messageData);

      const response = await api.post("/api/messages", messageData);

      setMessages([...messages, response.data]);
      setNewMessage("");
      toast.success("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", (error as any)?.response?.data);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] sm:h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Receiver Profile Picture */}
              {receiverProfilePicture ? (
                <img
                  src={receiverProfilePicture}
                  alt={receiverName}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/50 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 flex-shrink-0">
                  <User size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-lg truncate">{receiverName}</h3>
                <p className="text-xs sm:text-sm opacity-90 truncate">{opportunityTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-lg p-1.5 sm:p-2 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSender = msg.sender_id._id === user?.id;

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Profile Picture - show on left for received messages */}
                  {!isSender && (
                    <div className="flex-shrink-0">
                      {msg.sender_id.profile_picture ? (
                        <img
                          src={msg.sender_id.profile_picture}
                          alt={msg.sender_id.full_name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center border-2 border-purple-200">
                          <User size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isSender
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white text-gray-800 shadow"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isSender ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>

                  {/* Profile Picture - show on right for sent messages */}
                  {isSender && (
                    <div className="flex-shrink-0">
                      {msg.sender_id.profile_picture ? (
                        <img
                          src={msg.sender_id.profile_picture}
                          alt={msg.sender_id.full_name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center border-2 border-purple-200">
                          <User size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-white border-t border-gray-200"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2 text-sm sm:text-base"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isSending ? "Sending..." : "Send"}</span>
              <span className="sm:hidden">{isSending ? "..." : ""}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChatInterface;
