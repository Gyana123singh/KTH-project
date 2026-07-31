import React, { useState, useRef } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiUpload,
  FiSave,
  FiShield,
  FiCheckCircle
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, Input, Avatar, Badge } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '+1 (555) 234-5678',
    department: user.department || 'Operations & Verification',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ avatar: imageUrl });
      showToast(`Admin avatar updated to ${file.name}!`, 'success');
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(form);
      setIsSaving(false);
      showToast('Admin profile details updated successfully!', 'success');
    }, 600);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast('Please fill out password fields.', 'danger');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match.', 'danger');
      return;
    }
    showToast('Password changed successfully!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Profile Account"
        subtitle="Manage your personal administrator credentials, profile avatar, and security passwords."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Profile Overview Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="relative inline-block mx-auto cursor-pointer" onClick={handleAvatarUploadClick}>
              <Avatar src={user.avatar} name={user.name} size="2xl" className="ring-4 ring-teal-50" />
              <button
                type="button"
                onClick={handleAvatarUploadClick}
                className="absolute bottom-0 right-0 p-2 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-md text-xs transition-transform active:scale-95 cursor-pointer"
                title="Upload Avatar"
              >
                <FiUpload className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 my-0">{user.name}</h2>
              <p className="text-xs font-semibold text-teal-700 mt-0.5">{user.role}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-bold text-slate-900">{form.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Account ID</span>
                <span className="font-mono text-slate-700">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Joined Date</span>
                <span className="font-mono text-slate-700">{user.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-teal-700" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Admin Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                  label="Department"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" icon={FiSave} isLoading={isSaving}>
                  Update Profile
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiLock className="w-5 h-5 text-amber-600" />
              <span>Change Account Password</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••••••"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••••••"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="accent" icon={FiShield}>
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
