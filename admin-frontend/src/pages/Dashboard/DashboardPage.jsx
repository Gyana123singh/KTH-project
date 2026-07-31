import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBriefcase,
  FiFolder,
  FiCheckSquare,
  FiEye,
  FiMic,
  FiUserPlus,
  FiDownload,
  FiSearch,
  FiArrowRight,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, ChartCard } from '../../components/cards/Cards';
import { Button, Badge, Avatar, Modal } from '../../components/common/UIComponents';
import { DASHBOARD_STATS, MOCK_EMPLOYEES, MOCK_CORRECTIONS } from '../../constants/mockData';
import { useToast } from '../../context/ToastContext';

export const DashboardPage = () => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', role: 'Moderator' });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email) return;
    showToast(`Admin account created for ${adminForm.name}`, 'success');
    setIsAdminModalOpen(false);
    setAdminForm({ name: '', email: '', role: 'Moderator' });
  };

  const handleExportData = () => {
    showToast('Exporting KTH database summary to CSV...', 'info');
    setTimeout(() => {
      showToast('KTH_Workforce_Report_2026.csv downloaded successfully', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Admin Control Dashboard"
        subtitle="Real-time operational summary across kitchen talent profiles, partner employers, and verification queues."
      >
        <Button variant="outline" icon={FiDownload} onClick={handleExportData}>
          Export Data
        </Button>
        <Button variant="primary" icon={FiUserPlus} onClick={() => setIsAdminModalOpen(true)}>
          Create Admin
        </Button>
      </PageHeader>

      {/* Top 6 Modern Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Employees"
          value={DASHBOARD_STATS.totalEmployees.toLocaleString()}
          trend="+14.2%"
          trendType="up"
          subtext="Active Talent Roster"
          icon={FiUsers}
          color="teal"
        />
        <StatCard
          title="Total Employers"
          value={DASHBOARD_STATS.totalEmployers.toLocaleString()}
          trend="+8.7%"
          trendType="up"
          subtext="Partner Restaurants"
          icon={FiBriefcase}
          color="blue"
        />
        <StatCard
          title="Total Profiles"
          value={DASHBOARD_STATS.totalProfiles.toLocaleString()}
          trend="+12.4%"
          trendType="up"
          subtext="Verified Portfolios"
          icon={FiFolder}
          color="purple"
        />
        <StatCard
          title="Pending Corrections"
          value={DASHBOARD_STATS.pendingCorrections.toString()}
          trend="-3.1%"
          trendType="down"
          subtext="Queue Needs Audit"
          icon={FiCheckSquare}
          color="amber"
        />
        <StatCard
          title="Public Views"
          value={DASHBOARD_STATS.totalPublicViews}
          trend="+28.5%"
          trendType="up"
          subtext="30-Day Impressions"
          icon={FiEye}
          color="emerald"
        />
        <StatCard
          title="Voice Profiles"
          value={DASHBOARD_STATS.voiceProfiles.toLocaleString()}
          trend="+19.0%"
          trendType="up"
          subtext="Audio Introductions"
          icon={FiMic}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Creation Area Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Profile Creation & Onboarding Growth"
            subtitle="Monthly growth comparison between candidates and partner employers"
          >
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DASHBOARD_STATS.monthlyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="employees" name="Employees" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorEmp)" />
                  <Area type="monotone" dataKey="employers" name="Employers" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorBoss)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Public Views Bar Chart */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Weekly Traffic & Search Activity"
            subtitle="Daily views and search queries"
          >
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DASHBOARD_STATS.viewsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                  />
                  <Bar dataKey="views" name="Profile Views" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="searches" name="Searches" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Action Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Quick Operational Actions</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Fast shortcuts for daily admin tasks.</p>

            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/employees')}
                className="w-full p-3 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 border border-slate-200 rounded-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-800 shrink-0">
                    <FiSearch className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900">Search Candidate Directory</span>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/corrections')}
                className="w-full p-3 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200 rounded-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                    <FiCheckSquare className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">Review Corrections Queue</span>
                </div>
                <Badge variant="amber">4 Pending</Badge>
              </button>

              <button
                onClick={() => navigate('/employers')}
                className="w-full p-3 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200 rounded-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-800 shrink-0">
                    <FiBriefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-purple-900">View Employer Partners</span>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleExportData}
                className="w-full p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                    <FiDownload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Download Data Dump (CSV)</span>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Languages Donut */}
          <ChartCard title="Talent Languages" subtitle="Multilingual breakdown">
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DASHBOARD_STATS.languageDistribution}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DASHBOARD_STATS.languageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DASHBOARD_STATS.languageDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium truncate">{item.name}:</span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Latest Registered Employees Table & Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          {/* Latest Registered Employees Preview Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Latest Registered Candidates</h3>
                <p className="text-xs text-slate-500 font-medium">Recently onboarded kitchen professionals.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
                View All Employees
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Candidate</th>
                    <th className="pb-3 font-semibold">Current Position</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_EMPLOYEES.slice(0, 5).map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={emp.photo} name={emp.name} size="sm" />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{emp.name}</p>
                            <p className="text-[11px] text-slate-500">{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-xs text-slate-700">{emp.currentPosition}</td>
                      <td className="py-3 text-xs text-slate-500">{emp.department}</td>
                      <td className="py-3">
                        <Badge variant={emp.status === 'Active' ? 'emerald' : 'amber'}>
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Corrections Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Correction Requests</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/corrections')}>
                Open Queue
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_CORRECTIONS.slice(0, 2).map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={item.employeePhoto} name={item.employeeName} size="sm" />
                      <span className="text-xs font-bold text-slate-900">{item.employeeName}</span>
                    </div>
                    <Badge variant="amber">Pending</Badge>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <p><strong className="text-slate-800">Field:</strong> {item.fieldName}</p>
                    <p className="line-clamp-1 text-slate-500">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      <Modal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} title="Create Admin Account">
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={adminForm.name}
              onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
              placeholder="e.g. Chef Gordon Vance"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email</label>
            <input
              type="email"
              required
              value={adminForm.email}
              onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              placeholder="gordon@kitchentalenthub.com"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Admin Permission Role</label>
            <select
              value={adminForm.role}
              onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
            >
              <option value="Super Administrator">Super Administrator</option>
              <option value="Verification Moderator">Verification Moderator</option>
              <option value="Audit Analyst">Audit Analyst</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAdminModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Admin Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
