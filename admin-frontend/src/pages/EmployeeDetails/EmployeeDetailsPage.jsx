import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiEdit,
  FiTrash2,
  FiShare2,
  FiDownload,
  FiMic,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiBriefcase,
  FiAward,
  FiGlobe,
  FiStar,
  FiPlay,
  FiPause
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, Badge, Avatar } from '../../components/common/UIComponents';
import { DeleteModal } from '../../components/layout/LayoutHelpers';
import { MOCK_EMPLOYEES } from '../../constants/mockData';
import { useToast } from '../../context/ToastContext';

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Find candidate by ID or default to first
  const employee = MOCK_EMPLOYEES.find((e) => e.id === id) || MOCK_EMPLOYEES[0];

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Public candidate link copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    showToast(`Downloading verified portfolio PDF for ${employee.name}...`, 'info');
  };

  const handleDelete = () => {
    showToast(`Candidate profile ${employee.name} deleted.`, 'danger');
    setIsDeleteModalOpen(false);
    navigate('/employees');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Profile View"
        subtitle={`Viewing full portfolio, work experience history, and verified references for ${employee.name}.`}
      >
        <Button variant="outline" icon={FiShare2} onClick={handleShare}>
          Share Link
        </Button>
        <Button variant="outline" icon={FiDownload} onClick={handleDownload}>
          Download PDF
        </Button>
        <Button variant="secondary" icon={FiEdit} onClick={() => navigate(`/employees/${employee.id}/edit`)}>
          Edit Candidate
        </Button>
        <Button variant="danger" icon={FiTrash2} onClick={() => setIsDeleteModalOpen(true)}>
          Delete
        </Button>
      </PageHeader>

      {/* Profile Cover Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-teal-900 via-teal-700 to-slate-900 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Badge variant="emerald">{employee.status}</Badge>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold flex items-center gap-1">
              <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{employee.rating} Rating</span>
            </span>
          </div>
        </div>

        {/* Profile Details Header Block */}
        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            <Avatar
              src={employee.photo}
              name={employee.name}
              size="2xl"
              className="ring-4 ring-white shadow-xl bg-white shrink-0"
            />

            {/* Voice Audio Player Component */}
            {employee.hasVoiceProfile && (
              <div className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-95"
                >
                  {isPlayingAudio ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <FiMic className="w-3.5 h-3.5 text-teal-600" />
                    <span>Voice Intro Audio</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">0:45 • MP3 Audio</span>
                </div>
              </div>
            )}
          </div>

          {/* Candidate Name & Current Position */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-0 tracking-tight">{employee.name}</h1>
            <p className="text-sm font-bold text-teal-700 mt-1">{employee.currentPosition}</p>
          </div>

          {/* Quick Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 font-medium">
              <FiMail className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 font-medium">
              <FiPhone className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 font-medium">
              <FiMapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{employee.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 font-medium">
              <FiBriefcase className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Experience: <strong>{employee.experience}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Bio & Languages Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Candidate Overview & About</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">{employee.about}</p>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</h4>
              <p className="text-sm font-bold text-slate-800">{employee.department}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FiGlobe className="w-3.5 h-3.5 text-teal-600" />
                <span>Spoken Languages</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {employee.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Verification References Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-teal-600" />
              <span>Verified References</span>
            </h3>

            <div className="space-y-3">
              {employee.references.map((ref, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{ref.name}</span>
                    <Badge variant="emerald">{ref.status}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{ref.restaurant} • {ref.phone}</p>
                  <p className="text-xs text-slate-600 italic">"{ref.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Work History Timeline Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Career & Kitchen Work History Timeline</h3>
                <p className="text-xs text-slate-500 font-medium">Verified culinary roles and restaurant stints.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/work-history')}>
                Manage Work History
              </Button>
            </div>

            {/* Interactive Timeline */}
            <div className="relative pl-6 border-l-2 border-teal-200 space-y-8 my-4">
              <div className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-700 ring-4 ring-teal-100" />
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 hover:border-teal-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-extrabold text-slate-900">{employee.currentPosition}</h4>
                    <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-0.5 rounded-full w-fit">
                      2023 - Present (Current)
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">Le Bernardin Culinary Group • New York, NY</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Directing kitchen station operations, maintaining food prep speeds during high-volume service, and training commis chefs.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-extrabold text-slate-900">Senior Sous Chef</h4>
                    <span className="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-0.5 rounded-full w-fit">
                      2020 - 2023 (3 Years)
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">Alinea Dining Studio • Chicago, IL</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Managed temperature logging, hygiene audits, menu R&D, and inventory software tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        itemName={employee.name}
      />
    </div>
  );
};
