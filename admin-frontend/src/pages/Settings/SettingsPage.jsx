import React, { useState } from 'react';
import {
  FiSettings,
  FiShield,
  FiBell,
  FiMoon,
  FiGlobe,
  FiUsers,
  FiSave,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, Input, Select, Badge, Avatar } from '../../components/common/UIComponents';
import { useToast } from '../../context/ToastContext';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { showToast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Kitchen Talent Hub (KTH)',
    contactEmail: 'support@kitchentalenthub.com',
    autoApproveVerified: true,
    publicDirectoryAccess: true,
  });

  const [adminsList, setAdminsList] = useState([
    { id: 1, name: 'Chef Marcus Vance', email: 'admin@kitchentalenthub.com', role: 'Super Administrator', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@kitchentalenthub.com', role: 'Verification Moderator', status: 'Active' },
    { id: 3, name: 'David Mercer', email: 'david.m@kitchentalenthub.com', role: 'Audit Analyst', status: 'Active' },
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Platform settings saved successfully!', 'success');
  };

  const handleDeleteAdmin = (id) => {
    setAdminsList(adminsList.filter((a) => a.id !== id));
    showToast('Admin account removed.', 'danger');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'appearance', label: 'Appearance', icon: FiMoon },
    { id: 'language', label: 'Language', icon: FiGlobe },
    { id: 'admin-accounts', label: 'Admin Accounts', icon: FiUsers },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Platform Settings"
        subtitle="Manage global KTH configuration, security controls, notifications, and administrative access privileges."
      />

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {activeTab === 'general' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-slate-900">General Platform Settings</h3>
            <Input
              label="Platform Name"
              value={generalSettings.platformName}
              onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
            />
            <Input
              label="Admin Support Email"
              value={generalSettings.contactEmail}
              onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
            />

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Auto-approve Verified References</span>
                  <span className="text-[11px] text-slate-500">Automatically publish verified candidate work history.</span>
                </div>
                <input
                  type="checkbox"
                  checked={generalSettings.autoApproveVerified}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, autoApproveVerified: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-700"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Public Candidate Directory</span>
                  <span className="text-[11px] text-slate-500">Allow employers to view un-indexed public candidate cards.</span>
                </div>
                <input
                  type="checkbox"
                  checked={generalSettings.publicDirectoryAccess}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, publicDirectoryAccess: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-700"
                />
              </label>
            </div>

            <Button type="submit" variant="primary" icon={FiSave}>
              Save Settings
            </Button>
          </form>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-slate-900">Security & Authentication Policies</h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
              Two-Factor Authentication (2FA) is enforced for all Super Administrators.
            </div>
            <Select label="Session Timeout Duration" options={['30 Minutes', '1 Hour', '8 Hours', 'Never']} />
            <Select label="Password Expiry Cycle" options={['Every 90 Days', 'Every 180 Days', 'Disabled']} />
            <Button variant="primary" icon={FiSave} onClick={handleSave}>
              Update Security Policies
            </Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-slate-900">Email & Alert Preferences</h3>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800">Email on New Correction Request</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-teal-700" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800">Email on Disputed Reference Flag</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-teal-700" />
            </label>
            <Button variant="primary" icon={FiSave} onClick={handleSave}>
              Save Notification Preferences
            </Button>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-slate-900">Appearance & Theme Branding</h3>
            <Select label="Dashboard Theme Mode" options={['Light Mode (Default)', 'Dark Mode', 'System Adaptive']} />
            <Select label="Sidebar Default State" options={['Expanded', 'Collapsed by Default']} />
            <Button variant="primary" icon={FiSave} onClick={handleSave}>
              Save Appearance
            </Button>
          </div>
        )}

        {activeTab === 'language' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-slate-900">System Regional & Language Settings</h3>
            <Select label="Admin Portal Language" options={['English (US)', 'Spanish (ES)', 'French (FR)', 'German (DE)']} />
            <Select label="Date & Time Format" options={['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY']} />
            <Button variant="primary" icon={FiSave} onClick={handleSave}>
              Save Regional Format
            </Button>
          </div>
        )}

        {activeTab === 'admin-accounts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Admin Account Management</h3>
                <p className="text-xs text-slate-500">Authorized personnel with platform access.</p>
              </div>
              <Button size="sm" variant="primary" icon={FiPlus} onClick={() => showToast('Create Admin dialog opened', 'info')}>
                Add Admin Account
              </Button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {adminsList.map((adm) => (
                <div key={adm.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Avatar name={adm.name} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{adm.name}</p>
                      <p className="text-[11px] text-slate-500">{adm.email} • <span className="font-semibold text-teal-700">{adm.role}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="emerald">{adm.status}</Badge>
                    {adm.role !== 'Super Administrator' && (
                      <button
                        onClick={() => handleDeleteAdmin(adm.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
