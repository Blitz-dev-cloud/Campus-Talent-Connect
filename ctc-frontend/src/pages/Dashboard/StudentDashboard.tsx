import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Edit2,
  Save,
  X,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Award,
  Plus,
  Trash2,
  GraduationCap,
  FileText,
  CheckCircle,
  Send,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../lib/api";
import { Footer } from "../../components/Footer";
const StudentDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    cover_letter: "",
    resume_base64: "",
    resume_name: "",
    cgpa: "",
    tenth_percentage: "",
    twelfth_percentage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const [profRes, oppRes, appRes] = await Promise.all([
          api.get("/api/profiles"),
          api.get("/api/opportunities"),
          api.get("/api/applications"),
        ]);
        // Find the profile for the current logged-in user by user_id
        const userProfile = profRes.data.find((p) => p.user_id === user.id);
        setProfile(userProfile || null);
        setEditedProfile(
          userProfile || {
            user_id: user.id,
            full_name: user.full_name || user.username || "",
            bio: "",
            phone: "",
            location: "",
            skills: [],
            role: user.role,
          }
        );
        setOpportunities(oppRes.data);
        setApplications(appRes.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);
  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };
  const handleInputChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };
  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = editedProfile.skills || [];
      setEditedProfile({
        ...editedProfile,
        skills: [...currentSkills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };
  const removeSkill = (index) => {
    const updatedSkills = editedProfile.skills.filter((_, i) => i !== index);
    setEditedProfile({ ...editedProfile, skills: updatedSkills });
  };
  const saveProfile = async () => {
    try {
      let response;
      if (profile?.id) {
        // Update existing profile
        response = await api.put(`/api/profiles/${profile.id}`, editedProfile);
      } else {
        // Create new profile
        const newProfile = {
          ...editedProfile,
          id: Date.now(),
          user_id: user.id,
          role: user.role,
        };
        response = await api.post("/api/profiles", newProfile);
      }
      setProfile(response.data);
      setEditedProfile(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error("Failed to update profile");
    }
  };
  const openApplyModal = (opp) => {
    setSelectedOpportunity(opp);
    setApplicationForm({
      cover_letter: "",
      resume_base64: "",
      resume_name: "",
    });
    setIsApplyModalOpen(true);
  };
  const handleApplicationInput = (field, value) => {
    setApplicationForm({
      ...applicationForm,
      [field]: value,
    });
  };
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setApplicationForm({
          ...applicationForm,
          resume_base64: event.target.result.split(",")[1],
          resume_name: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a PDF file.");
    }
  };
  const submitApplication = async () => {
    if (
      !applicationForm.cover_letter ||
      !applicationForm.resume_base64 ||
      !applicationForm.cgpa ||
      !applicationForm.tenth_percentage ||
      !applicationForm.twelfth_percentage
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (!selectedOpportunity?.id) {
      toast.error("Invalid opportunity selected.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/api/applications", {
        opportunity: selectedOpportunity.id,
        cover_letter: applicationForm.cover_letter,
        resume_base64: applicationForm.resume_base64,
        resume_name: applicationForm.resume_name,
        cgpa: applicationForm.cgpa,
        tenth_percentage: applicationForm.tenth_percentage,
        twelfth_percentage: applicationForm.twelfth_percentage,
      });

      toast.success(
        "Application submitted! You'll receive an email notification when reviewed."
      );
      setApplications([
        ...applications,
        {
          ...response.data,
          opportunity_title: selectedOpportunity.title,
        },
      ]);
      setIsApplyModalOpen(false);
    } catch (error) {
      console.error("Submit application error:", error.response?.data || error);
      toast.error(
        `Failed to submit application: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            {" "}
            Manage your profile, explore opportunities, and track applications{" "}
          </p>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm">
          {["profile", "opportunities", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                        <User size={40} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">
                          {" "}
                          {profile?.full_name ||
                            user?.full_name ||
                            user?.username ||
                            "Your Name"}{" "}
                        </h2>
                        <p className="text-white/80">{user?.email}</p>
                        <p className="text-white/60 text-sm capitalize">
                          {" "}
                          {user?.role || "Student"}{" "}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={isEditing ? saveProfile : handleEditToggle}
                      className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      {isEditing ? (
                        <>
                          {" "}
                          <Save size={18} /> Save Changes{" "}
                        </>
                      ) : (
                        <>
                          {" "}
                          <Edit2 size={18} /> Edit Profile{" "}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {/* Profile Content */}
                <div className="p-8">
                  {profile?.id ? (
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            {" "}
                            <User size={16} className="text-blue-600" /> Full
                            Name{" "}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.full_name || ""}
                              onChange={(e) =>
                                handleInputChange("full_name", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">
                              {" "}
                              {profile.full_name || "Not set"}{" "}
                            </p>
                          )}
                        </div>
                        {/* Phone */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            {" "}
                            <Phone size={16} className="text-blue-600" /> Phone
                            Number{" "}
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedProfile.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">
                              {" "}
                              {profile.phone || "Not set"}{" "}
                            </p>
                          )}
                        </div>
                        {/* Location */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            {" "}
                            <MapPin size={16} className="text-blue-600" />{" "}
                            Location{" "}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.location || ""}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="City, Country"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">
                              {" "}
                              {profile.location || "Not set"}{" "}
                            </p>
                          )}
                        </div>
                        {/* Email */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            {" "}
                            <Mail
                              size={16}
                              className="text-blue-600"
                            /> Email{" "}
                          </label>
                          <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                            {" "}
                            {user?.email || "Not available"}{" "}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {" "}
                            Email cannot be changed{" "}
                          </p>
                        </div>
                      </div>
                      {/* Bio */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          {" "}
                          <Briefcase
                            size={16}
                            className="text-blue-600"
                          /> Bio{" "}
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editedProfile.bio || ""}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-lg">
                            {" "}
                            {profile.bio || "Not set"}{" "}
                          </p>
                        )}
                      </div>
                      {/* Skills */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          {" "}
                          <Award
                            size={16}
                            className="text-blue-600"
                          /> Skills{" "}
                        </label>
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) =>
                                  e.key === "Enter" && addSkill()
                                }
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add a skill"
                              />
                              <button
                                onClick={addSkill}
                                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                              >
                                {" "}
                                <Plus size={18} /> Add{" "}
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(editedProfile.skills || []).map(
                                (skill, index) => (
                                  <span
                                    key={index}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center gap-2"
                                  >
                                    {" "}
                                    {skill}{" "}
                                    <button
                                      onClick={() => removeSkill(index)}
                                      className="hover:text-red-600 transition-colors"
                                    >
                                      {" "}
                                      <Trash2 size={14} />{" "}
                                    </button>{" "}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {(profile.skills || []).length > 0 ? (
                              profile.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg font-medium"
                                >
                                  {" "}
                                  {skill}{" "}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                {" "}
                                No skills added yet{" "}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={saveProfile}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            {" "}
                            Save Changes{" "}
                          </button>
                          <button
                            onClick={handleEditToggle}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                          >
                            {" "}
                            Cancel{" "}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        {" "}
                        Complete your profile to get started{" "}
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        {" "}
                        Create Profile{" "}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {/* OPPORTUNITIES TAB */}
            {activeTab === "opportunities" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {opportunities.length > 0 ? (
                  opportunities.map((opp) => (
                    <motion.div
                      key={opp.id}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {" "}
                          {opp.title}{" "}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {" "}
                          {opp.type}{" "}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {" "}
                        {opp.description}{" "}
                      </p>
                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          {" "}
                          <Briefcase size={16} className="text-blue-600" />{" "}
                          {opp.company}{" "}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {" "}
                          <MapPin size={16} className="text-blue-600" />{" "}
                          {opp.location}{" "}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {" "}
                          <Award size={16} className="text-blue-600" />${" "}
                          {opp.salary}{" "}
                        </div>
                      </div>
                      <button
                        onClick={() => openApplyModal(opp)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
                      >
                        {" "}
                        Apply Now{" "}
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
                    <Briefcase
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-600">
                      {" "}
                      No opportunities available at the moment{" "}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
            {/* APPLICATIONS TAB */}
            {activeTab === "applications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">
                          {" "}
                          Opportunity{" "}
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          {" "}
                          Status{" "}
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          {" "}
                          Date Applied{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length > 0 ? (
                        applications.map((app) => (
                          <tr
                            key={app.id}
                            className="border-t hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium">
                              {" "}
                              {app.opportunity_title}{" "}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                  app.status === "accepted"
                                    ? "bg-green-100 text-green-700"
                                    : app.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {" "}
                                {app.status}{" "}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {" "}
                              {new Date(
                                app.created_at
                              ).toLocaleDateString()}{" "}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-12 text-center text-gray-600"
                          >
                            <Briefcase
                              size={48}
                              className="mx-auto text-gray-400 mb-4"
                            />{" "}
                            No applications yet. Start applying to
                            opportunities!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Apply to {selectedOpportunity?.title}
              </h2>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Academic Details */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <GraduationCap size={20} />
                  Academic Information
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CGPA *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      required
                      value={applicationForm.cgpa}
                      onChange={(e) =>
                        handleApplicationInput("cgpa", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      10th Percentage *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      required
                      value={applicationForm.tenth_percentage}
                      onChange={(e) =>
                        handleApplicationInput(
                          "tenth_percentage",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 85.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      12th Percentage *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      required
                      value={applicationForm.twelfth_percentage}
                      onChange={(e) =>
                        handleApplicationInput(
                          "twelfth_percentage",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 90.0"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="text-blue-600" />
                  Cover Letter *
                </label>
                <textarea
                  value={applicationForm.cover_letter}
                  onChange={(e) =>
                    handleApplicationInput("cover_letter", e.target.value)
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write a cover letter explaining why you're a good fit for this opportunity..."
                  required
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="text-blue-600" />
                  Upload Resume (PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="w-full file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {applicationForm.resume_name && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle size={16} />
                    Selected: {applicationForm.resume_name}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={submitApplication}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Application
                  </>
                )}
              </button>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default StudentDashboard;
