"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/slices/auth.slice";
import { useAppDispatch } from "@/hooks/use-store";
import { Bell, Lock, LogOut, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface SettingsViewProps {
  setActiveView: (view: string) => void;
}

export default function SettingsView({ setActiveView }: SettingsViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "owner@salesmanager.com",
    phone: "+1 (555) 123-4567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklySummary: true,
    lowStockAlerts: true,
    newOrderNotif: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Profile Information
                </h2>
                <p className="text-sm text-slate-600">
                  Update your personal details
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Save Profile
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Change Password
                </h2>
                <p className="text-sm text-slate-600">
                  Update your security password
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300  px-4 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-10 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  // Fixed: Ensuring confirm password also follows the showPassword state
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300  px-4 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Change Password
              </Button>
            </form>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Notifications
                </h2>
                <p className="text-sm text-slate-600">
                  Manage your notification preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(
                Object.keys(notifications) as Array<keyof typeof notifications>
              ).map((key) => {
                const labels: Record<string, { title: string; desc: string }> =
                  {
                    emailAlerts: {
                      title: "Email Alerts",
                      desc: "Get notified about important updates",
                    },
                    weeklySummary: {
                      title: "Weekly Summary",
                      desc: "Receive weekly sales summary emails",
                    },
                    lowStockAlerts: {
                      title: "Low Stock Alerts",
                      desc: "Notify when items are running low",
                    },
                    newOrderNotif: {
                      title: "New Order Notifications",
                      desc: "Instant notifications on new orders",
                    },
                  };

                return (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => handleNotificationChange(key)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {labels[key].title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {labels[key].desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Logout */}
          <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Logout</h2>
                <p className="text-sm text-slate-600">
                  Sign out from your account
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
