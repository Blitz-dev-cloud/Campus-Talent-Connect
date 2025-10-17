import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Edit2,
  Save,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Award,
  Plus,
  Trash2,
  Building,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../lib/api";

const AlumniDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "job",
    company: "",
    location: "",
    salary: "",
  });
  const [isPosting, setIsPosting] = useState(false);
  useEffect(() => {
    fetchData();
  }, [user]);
  const fetchData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [profRes, oppRes, appRes, usersRes, profilesRes] =
        await Promise.all([
          api.get("/api/profiles"),
          api.get("/api/opportunities/my-opportunities"),
          api.get("/api/applications"),
          api.get("/api/users"),
          api.get("/api/profiles"),
        ]);
      const userProfile = profRes.data.find(
        (p) =>
          String(p.user_id) === String(user.id) ||
          p.user_id?._id === user.id ||
          p.user_id === user.id
      );
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
      console.log("My opportunities:", oppRes.data);
      console.log("All applications:", appRes.data);
      // Get applications for alumni's opportunities
      const myOpportunityIds = oppRes.data.map((opp) => opp.id);
      console.log("My opportunity IDs:", myOpportunityIds);
      const myApplications = appRes.data.filter((app) => {
        const matches = myOpportunityIds.includes(app.opportunity);
        console.log(
          `Application ${app.id} for opportunity ${app.opportunity}: ${
            matches ? "MATCH" : "no match"
          }`
        );
        return matches;
      });
      console.log("Filtered applications:", myApplications);
      // Enrich applications with student data
      const enrichedApplications = myApplications.map((app) => {
        const studentProfile = profilesRes.data.find(
          (p) => p.user_id === app.student_id
        );
        const studentUser = usersRes.data.find((u) => u.id === app.student_id);
        return {
          ...app,
          student_name:
            studentProfile?.full_name || studentUser?.full_name || "Unknown",
          student_email: studentUser?.email || "N/A",
          student_phone: studentProfile?.phone || "N/A",
          student_skills: studentProfile?.skills || [],
        };
      });
      console.log("Enriched applications:", enrichedApplications);
      setApplications(enrichedApplications);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };
  const handleApplicationAction = async (applicationId, newStatus) => {
    try {
      await api.patch(`/api/applications/${applicationId}`, {
        status: newStatus,
      });

      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast.success(
        `Application ${newStatus === "accepted" ? "accepted" : "rejected"}!`
      );
    } catch (error) {
      console.error("Application action error:", error);
      toast.error("Failed to update application");
    }
  };
  const viewResume = (resume_base64, resume_name) => {
    const pdfWindow = window.open("");
    if (pdfWindow) {
      pdfWindow.document.write(
        `<title>${resume_name}</title><iframe width="100%" height="100%" style="position:absolute;top:0;left:0;" src="data:application/pdf;base64,${resume_base64}"></iframe>`
      );
    }
  };
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
      const profileId = profile?._id || profile?.id;
      if (profileId) {
        response = await api.put(`/api/profiles/${profileId}`, editedProfile);
      } else {
        const newProfile = {
          ...editedProfile,
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
  const handlePostOpportunity = async (e) => {
    e.preventDefault();
    try {
      setIsPosting(true);
      const opportunityData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        company: formData.company,
        location: formData.location,
        salary: formData.salary || "",
        posted_by: user.id,
        created_at: new Date().toISOString(),
      };
      const res = await api.post("/api/opportunities", opportunityData);
      const normalizedOpp = {
        ...res.data,
        posted_by: res.data.posted_by || res.data.alumni_id || user.id,
        created_at: res.data.created_at || new Date().toISOString(),
      };
      setOpportunities([normalizedOpp, ...opportunities]);
      setFormData({
        title: "",
        description: "",
        type: "job",
        company: "",
        location: "",
        salary: "",
      });
      setActiveTab("opportunities");
      toast.success("Opportunity posted successfully!");
    } catch (error) {
      console.error("Post opportunity error:", error);
      toast.error("Failed to post opportunity");
    } finally {
      setIsPosting(false);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Alumni Dashboard
          </h1>
          <p className="text-gray-600">
            Give back by sharing opportunities and mentoring students
          </p>
        </div>
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm flex-wrap">
          {["profile", "create", "opportunities", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] px-6 py-3 font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab === "create"
                ? "Post Opportunity"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                        <User size={40} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">
                          {profile?.full_name ||
                            user?.full_name ||
                            user?.username ||
                            "Your Name"}
                        </h2>
                        <p className="text-white/80">{user?.email}</p>
                        <p className="text-white/60 text-sm capitalize">
                          Alumni
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={isEditing ? saveProfile : handleEditToggle}
                      className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      {isEditing ? (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit2 size={18} />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  {profile?._id || profile?.id || isEditing ? (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <User size={16} className="text-purple-600" />
                            Full Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.full_name || ""}
                              onChange={(e) =>
                                handleInputChange("full_name", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">
                              {profile.full_name || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Phone size={16} className="text-purple-600" />
                            Phone Number
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedProfile.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">
                              {profile.phone || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <MapPin size={16} className="text-purple-600" />
                            Location
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.location || ""}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="City, Country"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">
                              {profile.location || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Mail size={16} className="text-purple-600" />
                            Email
                          </label>
                          <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                            {user?.email || "Not available"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Briefcase size={16} className="text-purple-600" />
                          Professional Bio
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editedProfile.bio || ""}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Share your professional background and expertise..."
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-lg">
                            {profile.bio || "Not set"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Award size={16} className="text-purple-600" />
                          Skills & Expertise
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
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Add a skill"
                              />
                              <button
                                onClick={addSkill}
                                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                              >
                                <Plus size={18} />
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(editedProfile.skills || []).map(
                                (skill, index) => (
                                  <span
                                    key={index}
                                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium flex items-center gap-2"
                                  >
                                    {skill}
                                    <button
                                      onClick={() => removeSkill(index)}
                                      className="hover:text-red-600 transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
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
                                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No skills added yet
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={saveProfile}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleEditToggle}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Complete your profile to start mentoring
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Create Profile
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {activeTab === "create" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Post an Opportunity
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Help students find their next big opportunity
                    </p>
                  </div>
                </div>
                <form onSubmit={handlePostOpportunity} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Software Engineer, Data Analyst"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={5}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe the role, responsibilities, and requirements..."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="job">Full-time Job</option>
                        <option value="internship">Internship</option>
                        <option value="research">Research</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Remote, New York, NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Salary (optional)
                      </label>
                      <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) =>
                          setFormData({ ...formData, salary: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Annual salary"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isPosting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPosting ? "Posting..." : "Post Opportunity"}
                  </button>
                </form>
              </motion.div>
            )}
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
                          {opp.title}
                        </h3>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {opp.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {opp.description}
                      </p>
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building size={16} className="text-purple-600" />
                          {opp.company}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-purple-600" />
                          {opp.location}
                        </div>
                        {opp.salary && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign size={16} className="text-purple-600" />
                            ${opp.salary}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500 text-xs pt-2">
                          <Calendar size={14} />
                          Posted {new Date(opp.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Posted by you</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
                    <Briefcase
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-600 mb-4">
                      You haven't posted any opportunities yet
                    </p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Post Your First Opportunity
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === "applications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <Users size={32} />
                    <div>
                      <h2 className="text-2xl font-bold">
                        Student Applications
                      </h2>
                      <p className="text-white/80">
                        Review and manage applications for your posted
                        opportunities
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {app.student_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Applied for:{" "}
                                <span className="font-semibold">
                                  {app.opportunity_title}
                                </span>
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                                app.status
                              )}`}
                            >
                              {getStatusIcon(app.status)}
                              {app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={16} className="text-purple-600" />
                              {app.student_email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={16} className="text-purple-600" />
                              {app.student_phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={16} className="text-purple-600" />
                              Applied:{" "}
                              {new Date(app.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          {app.student_skills &&
                            app.student_skills.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                  Skills:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {app.student_skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Cover Letter:
                            </p>
                            <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                              {app.cover_letter || "No cover letter provided"}
                            </p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Resume:
                            </p>
                            {app.resume_base64 ? (
                              <button
                                onClick={() =>
                                  viewResume(app.resume_base64, app.resume_name)
                                }
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
                              >
                                <FileText size={16} />
                                View Resume ({app.resume_name || "resume.pdf"})
                              </button>
                            ) : (
                              <p className="text-gray-500">
                                No resume uploaded
                              </p>
                            )}
                          </div>
                          {app.status === "pending" && (
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                              <button
                                onClick={() =>
                                  handleApplicationAction(app.id, "accepted")
                                }
                                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={18} />
                                Accept Application
                              </button>
                              <button
                                onClick={() =>
                                  handleApplicationAction(app.id, "rejected")
                                }
                                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                              >
                                <XCircle size={18} />
                                Reject Application
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        No applications received yet
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default AlumniDashboard;
