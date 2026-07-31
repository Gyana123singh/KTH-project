import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiHome,
  FiStar,
  FiBriefcase,
  FiUsers,
  FiCheckCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, Badge } from '../../components/common/UIComponents';
import { MOCK_EMPLOYERS, MOCK_EMPLOYEES } from '../../constants/mockData';

export const EmployerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const employer = MOCK_EMPLOYERS.find((e) => e.id === id) || MOCK_EMPLOYERS[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Employer Partner: ${employer.restaurant}`}
        subtitle={`Viewing hospitality group profile, active outlet locations, and verified staffing history.`}
      >
        <Button variant="outline" icon={FiArrowLeft} onClick={() => navigate('/employers')}>
          Back to Employers
        </Button>
      </PageHeader>

      {/* Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="h-48 sm:h-60 bg-slate-800 relative overflow-hidden">
          <img src={employer.banner} alt={employer.restaurant} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="emerald">{employer.status}</Badge>
                <span className="text-xs bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FiStar className="w-3.5 h-3.5 fill-current" />
                  <span>{employer.rating} Partner Score</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white my-0 tracking-tight">{employer.restaurant}</h1>
              <p className="text-sm text-slate-300 font-semibold mt-1">Founder / Owner: {employer.owner}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Headquarters</span>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FiMapPin className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{employer.location}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Outlets</span>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FiHome className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{employer.outletCount} Locations</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Point of Contact</span>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FiUser className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{employer.poc}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Direct Contact</span>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FiPhone className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{employer.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staffing & Outlets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Active Kitchen Staff from KTH Platform</h3>
          <div className="space-y-3">
            {MOCK_EMPLOYEES.slice(0, 4).map((emp) => (
              <div key={emp.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={emp.photo} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                    <p className="text-[11px] text-slate-500">{emp.currentPosition}</p>
                  </div>
                </div>
                <Badge variant="emerald">Verified Staff</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Outlet Locations List</h3>
          <div className="space-y-2.5 text-xs">
            {Array.from({ length: employer.outletCount }).slice(0, 5).map((_, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FiHome className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-800">{employer.restaurant} - Branch #{idx + 1}</span>
                </div>
                <span className="text-slate-500 font-medium">{employer.location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
