// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
  });

  // Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [resProfile, resEmail, resLogo] = await Promise.all([
          axios.get("/api/settings/profile"),
          axios.get("/api/settings/email"),
          axios.get("/api/settings/logo"),
        ]);

        setProfile(resProfile.data);
        setEmailSettings(resEmail.data);
        setLogoPreview(resLogo.data.url || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings.");
      }
    };
    fetchSettings();
  }, []);

  // Input handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Form submissions
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/settings/profile", profile);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/settings/email", emailSettings);
      toast.success("Email settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update email settings.");
    }
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (logo) data.append("logo", logo);
      await axios.put("/api/settings/logo", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Logo updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update logo.");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Profile Settings */}
      <Card title="Profile Settings">
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Name"
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Email"
            className={inputClass}
          />
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleProfileChange}
            placeholder="Password"
            className={inputClass}
          />
          <button type="submit" className={buttonClass}>
            Update Profile
          </button>
        </form>
      </Card>

      {/* Logo Settings */}
      <Card title="Logo Settings">
        <form onSubmit={handleLogoSubmit} className="flex flex-col gap-4">
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="h-24 w-24 object-cover rounded-md mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className={inputClass}
          />
          <button type="submit" className={buttonClass}>
            Update Logo
          </button>
        </form>
      </Card>

      {/* Email Settings */}
      <Card title="Email Settings">
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="smtpHost"
            value={emailSettings.smtpHost}
            onChange={handleEmailChange}
            placeholder="SMTP Host"
            className={inputClass}
          />
          <input
            type="text"
            name="smtpPort"
            value={emailSettings.smtpPort}
            onChange={handleEmailChange}
            placeholder="SMTP Port"
            className={inputClass}
          />
          <input
            type="email"
            name="smtpUser"
            value={emailSettings.smtpUser}
            onChange={handleEmailChange}
            placeholder="SMTP User"
            className={inputClass}
          />
          <input
            type="password"
            name="smtpPassword"
            value={emailSettings.smtpPassword}
            onChange={handleEmailChange}
            placeholder="SMTP Password"
            className={inputClass}
          />
          <button type="submit" className={buttonClass}>
            Update Email Settings
          </button>
        </form>
      </Card>
    </div>
  );
};

// Reusable Card component
const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

// Tailwind CSS classes
const inputClass =
  "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400";
const buttonClass =
  "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200";

export default Settings;
