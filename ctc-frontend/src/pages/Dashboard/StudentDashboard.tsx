import React, { useState, useEffect } from "react";
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

// Type definitions
interface Profile {
  _id?: string;
  user_id: string;
  full_name: string;
  bio: string;
  phone: string;
  location: string;
  skills: string[];
  cgpa?: string;
  tenth_percentage?: string;
  twelfth_percentage?: string;
  role: string;
}

interface Opportunity {
  _id?: string;
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  type: string;
  location: string;
  salary?: string;
  posted_by: string;
  status: string;
}

interface Application {
  _id?: string;
  id: string;
  opportunity_id: string;
  user_id: string;
  status: string;
  cover_letter: string;
  resume_base64: string;
  resume_name: string;
  cgpa: string;
  tenth_percentage: string;
  twelfth_percentage: string;
  applied_date: string;
}

interface ApplicationForm {
  cover_letter: string;
  resume_base64: string;
  resume_name: string;
  cgpa: string;
  tenth_percentage: string;
  twelfth_percentage: string;
}

const StudentDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const [newSkill, setNewSkill] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
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

        console.log("User ID:", (user as any)?.id);
        console.log("All profiles:", profRes.data);

        // Find the profile for the current logged-in user by user_id
        // Convert both to string for comparison since MongoDB returns ObjectId
        const userProfile = profRes.data.find(
          (p: any) =>
            String(p.user_id) === String((user as any)?.id) ||
            p.user_id?._id === (user as any)?.id ||
            p.user_id === (user as any)?.id
        );
        console.log("Found user profile:", userProfile);

        setProfile(userProfile || null);
        setEditedProfile(
          userProfile || {
            user_id: (user as any)?.id,
            full_name:
              (user as any)?.full_name || (user as any)?.username || "",
            bio: "",
            phone: "",
            location: "",
            skills: [],
            role: (user as any)?.role,
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
    if (isEditing && profile) {
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };
  const handleInputChange = (field: string, value: string) => {
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
  const removeSkill = (index: number) => {
    const updatedSkills = (editedProfile.skills || []).filter(
      (_, i) => i !== index
    );
    setEditedProfile({ ...editedProfile, skills: updatedSkills });
  };
  const saveProfile = async () => {
    try {
      let response;
      const profileId = profile?._id;

      if (profileId) {
        // Update existing profile
        console.log("Updating profile:", profileId);
        response = await api.put(`/api/profiles/${profileId}`, editedProfile);
      } else {
        // Create new profile
        const newProfile = {
          ...editedProfile,
          user_id: (user as any)?.id,
          role: (user as any)?.role,
        };
        console.log("Creating profile with data:", newProfile);
        response = await api.post("/api/profiles", newProfile);
      }
      setProfile(response.data);
      setEditedProfile(response.data);
      setIsEditing(false);
      toast.success("Profile saved successfully!");
    } catch (error: any) {
      console.error("Save profile error:", error);
      console.error("Error response:", error.response?.data);

      // If profile already exists, try to fetch and update it
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already exists")
      ) {
        try {
          // Fetch all profiles and find the user's profile
          const profilesRes = await api.get("/api/profiles");
          const existingProfile = profilesRes.data.find(
            (p: any) =>
              String(p.user_id) === String((user as any)?.id) ||
              p.user_id?._id === (user as any)?.id ||
              p.user_id === (user as any)?.id
          );

          if (existingProfile) {
            // Update the existing profile
            const updateRes = await api.put(
              `/api/profiles/${existingProfile._id}`,
              editedProfile
            );
            setProfile(updateRes.data);
            setEditedProfile(updateRes.data);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
            return;
          }
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }

      toast.error(error.response?.data?.message || "Failed to save profile");
    }
  };
  const openApplyModal = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setApplicationForm({
      cover_letter: "",
      resume_base64: "",
      resume_name: "",
      cgpa: "",
      tenth_percentage: "",
      twelfth_percentage: "",
    });
    setIsApplyModalOpen(true);
  };
  const handleApplicationInput = (
    field: keyof ApplicationForm,
    value: string
  ) => {
    setApplicationForm({
      ...applicationForm,
      [field]: value,
    });
  };
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === "string") {
          setApplicationForm({
            ...applicationForm,
            resume_base64: result.split(",")[1],
            resume_name: file.name,
          });
        }
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

    const opportunityId = selectedOpportunity?._id || selectedOpportunity?.id;
    if (!opportunityId) {
      toast.error("Invalid opportunity selected.");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting application for opportunity:", opportunityId);
      const response = await api.post("/api/applications", {
        opportunity: opportunityId,
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
      setApplications([...applications, response.data]);
      setIsApplyModalOpen(false);
    } catch (error: any) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your profile, explore opportunities, and track applications
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20"
        >
          {["profile", "opportunities", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                  : "text-gray-700 hover:bg-gray-100 hover:scale-102"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-gray-600 text-lg">
              Loading your dashboard...
            </p>
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
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white relative rounded-t-2xl border-b-4 border-indigo-700/30">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40 shadow-xl"
                      >
                        <User size={40} className="text-white drop-shadow-lg" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold drop-shadow-lg">
                          {" "}
                          {profile?.full_name ||
                            (user as any)?.full_name ||
                            (user as any)?.username ||
                            "Your Name"}{" "}
                        </h2>
                        <p className="text-white/90 text-lg mt-1">
                          {(user as any)?.email}
                        </p>
                        <p className="text-white/70 text-sm capitalize mt-1 bg-white/20 inline-block px-3 py-1 rounded-full">
                          {" "}
                          {(user as any)?.role || "Student"}{" "}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isEditing ? saveProfile : handleEditToggle}
                      className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center gap-2 shadow-lg"
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
                    </motion.button>
                  </div>
                </div>
                {/* Profile Content */}
                <div className="p-8 bg-white/60 backdrop-blur-sm">
                  {profile?._id || isEditing ? (
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            {" "}
                            <User size={16} className="text-indigo-600" /> Full
                            Name{" "}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.full_name || ""}
                              onChange={(e) =>
                                handleInputChange("full_name", e.target.value)
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                              {" "}
                              {profile?.full_name || "Not set"}{" "}
                            </p>
                          )}
                        </motion.div>
                        {/* Phone */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            {" "}
                            <Phone size={16} className="text-indigo-600" />{" "}
                            Phone Number{" "}
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedProfile.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                              {" "}
                              {profile?.phone || "Not set"}{" "}
                            </p>
                          )}
                        </motion.div>
                        {/* Location */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            {" "}
                            <MapPin
                              size={16}
                              className="text-indigo-600"
                            />{" "}
                            Location{" "}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.location || ""}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                              placeholder="City, Country"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                              {" "}
                              {profile?.location || "Not set"}{" "}
                            </p>
                          )}
                        </motion.div>
                        {/* Email */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            {" "}
                            <Mail
                              size={16}
                              className="text-indigo-600"
                            /> Email{" "}
                          </label>
                          <p className="px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl text-gray-700 border border-gray-300">
                            {" "}
                            {(user as any)?.email || "Not available"}{" "}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {" "}
                            Email cannot be changed{" "}
                          </p>
                        </motion.div>
                      </div>
                      {/* Bio */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          {" "}
                          <Briefcase
                            size={16}
                            className="text-indigo-600"
                          />{" "}
                          Bio{" "}
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editedProfile.bio || ""}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 min-h-[100px]">
                            {" "}
                            {profile?.bio || "Not set"}{" "}
                          </p>
                        )}
                      </motion.div>
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
                            {(profile?.skills || []).length > 0 ? (
                              profile?.skills?.map((skill, index) => (
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
                  opportunities.map((opp: Opportunity, idx: number) => (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border border-indigo-100 hover:border-indigo-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {" "}
                          {opp.title}{" "}
                        </h3>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-semibold shadow-md">
                          {" "}
                          {opp.type}{" "}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {" "}
                        {opp.description}{" "}
                      </p>
                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          {" "}
                          <Briefcase
                            size={16}
                            className="text-indigo-600"
                          />{" "}
                          <span className="font-medium">{opp.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          {" "}
                          <MapPin size={16} className="text-indigo-600" />{" "}
                          {opp.location}{" "}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          {" "}
                          <Award size={16} className="text-indigo-600" />{" "}
                          <span className="font-semibold text-green-600">
                            ${opp.salary}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openApplyModal(opp)}
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-xl transition-all"
                      >
                        {" "}
                        Apply Now{" "}
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
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
                    <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold rounded-tl-xl">
                          {" "}
                          Opportunity{" "}
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          {" "}
                          Status{" "}
                        </th>
                        <th className="px-6 py-4 text-left font-semibold rounded-tr-xl">
                          {" "}
                          Date Applied{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/80 backdrop-blur-sm">
                      {applications.length > 0 ? (
                        applications.map((app: any, idx: number) => (
                          <motion.tr
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-t border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all"
                          >
                            <td className="px-6 py-4 font-semibold text-gray-800">
                              {" "}
                              {app.opportunity_title || "N/A"}{" "}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                                  app.status === "accepted"
                                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                    : app.status === "rejected"
                                    ? "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                                    : "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                                }`}
                              >
                                {" "}
                                {app.status}{" "}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700 font-medium">
                              {" "}
                              {new Date(
                                app.created_at || app.applied_date
                              ).toLocaleDateString()}{" "}
                              {new Date(app.created_at).toLocaleDateString()}{" "}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-12 text-center text-gray-600"
                          >
                            <Briefcase
                              size={48}
                              className="mx-auto text-gray-400 mb-4"
                            />{" "}
                            <p className="text-lg font-medium">
                              No applications yet.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Start applying to opportunities!
                            </p>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 my-8 shadow-2xl border border-gray-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Apply to {selectedOpportunity?.title}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Academic Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg">
                  <GraduationCap size={20} className="text-blue-600" />
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      placeholder="e.g., 90.0"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Mail size={16} className="text-indigo-600" />
                  Cover Letter *
                </label>
                <textarea
                  value={applicationForm.cover_letter}
                  onChange={(e) =>
                    handleApplicationInput("cover_letter", e.target.value)
                  }
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm resize-none"
                  placeholder="Write a cover letter explaining why you're a good fit for this opportunity..."
                  required
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText size={16} className="text-indigo-600" />
                  Upload Resume (PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-indigo-50 file:text-indigo-700 hover:file:from-blue-100 hover:file:to-indigo-100 file:cursor-pointer file:transition-all file:shadow-md border-2 border-dashed border-gray-300 rounded-xl p-2"
                />
                {applicationForm.resume_name && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-2 font-medium">
                    <CheckCircle size={16} />
                    Selected: {applicationForm.resume_name}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitApplication}
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Application
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsApplyModalOpen(false)}
                className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all border-2 border-gray-300"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default StudentDashboard;
