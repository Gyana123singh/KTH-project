import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiSave,
  FiX,
  FiUpload,
  FiMic,
  FiUser,
  FiBriefcase,
  FiGlobe,
  FiCheckCircle,
  FiPlay
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, Input, Select, Textarea, Avatar } from '../../components/common/UIComponents';
import { MOCK_EMPLOYEES, DEPARTMENTS, POSITIONS, LANGUAGES_LIST } from '../../constants/mockData';
import { useToast } from '../../context/ToastContext';

export const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const initialEmp = MOCK_EMPLOYEES.find((e) => e.id === id) || MOCK_EMPLOYEES[0];

  const [formData, setFormData] = useState({
    name: initialEmp.name,
    email: initialEmp.email,
    phone: initialEmp.phone,
    currentPosition: initialEmp.currentPosition,
    department: initialEmp.department,
    experienceYears: initialEmp.experienceYears,
    location: initialEmp.location,
    status: initialEmp.status,
    about: initialEmp.about,
    languages: initialEmp.languages,
    photo: initialEmp.photo,
    hasVoiceProfile: initialEmp.hasVoiceProfile,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: imageUrl }));
      showToast(`Selected photo: ${file.name}`, 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`Employee profile for ${formData.name} updated successfully!`, 'success');
      navigate(`/employees/${initialEmp.id}`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Candidate Profile: ${formData.name}`}
        subtitle="Update candidate basic details, position, department, bio, and voice profile attachments."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiUser className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Work Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Select
              label="Verification Status"
              options={['Active', 'Pending Verification', 'Inactive']}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>
        </div>

        {/* Position & Department Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiBriefcase className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">Current Position & Department</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Current Position"
              options={POSITIONS}
              value={formData.currentPosition}
              onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
            />
            <Select
              label="Current Department"
              options={DEPARTMENTS}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              label="Experience (Years)"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
            />
          </div>
        </div>

        {/* Candidate Bio / About */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Professional Bio & About Summary</h3>
          <Textarea
            label="About Biography"
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            rows={5}
          />
        </div>

        {/* Media & Voice Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Upload Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Profile Photo Upload</h3>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <Avatar src={formData.photo} name={formData.name} size="xl" />
              <div className="flex-1 space-y-2">
                <div
                  onClick={handlePhotoUploadClick}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-teal-400 transition-colors cursor-pointer bg-slate-50 hover:bg-teal-50/50"
                >
                  <FiUpload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Click or drag new JPG/PNG photo</p>
                  <p className="text-[10px] text-slate-400">Max size 5MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Data Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiMic className="w-5 h-5 text-teal-700" />
                <span>Voice Profile Data</span>
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.hasVoiceProfile}
                  onChange={(e) => setFormData({ ...formData, hasVoiceProfile: e.target.checked })}
                  className="rounded text-teal-700"
                />
                <span>Enable Voice Profile</span>
              </label>
            </div>

            {formData.hasVoiceProfile ? (
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button type="button" className="p-2 rounded-xl bg-teal-700 text-white">
                    <FiPlay className="w-4 h-4 ml-0.5" />
                  </button>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">intro_speech_2026.mp3</p>
                    <p className="text-slate-500">Audio introduction active</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => showToast('Re-recording audio sample...', 'info')}>
                  Re-record
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                No voice sample attached to candidate.
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl z-20 flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <span className="text-xs text-slate-500 font-medium">Unsaved changes in edit form</span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" type="button" icon={FiX} onClick={() => navigate(`/employees/${initialEmp.id}`)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={FiSave} isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
