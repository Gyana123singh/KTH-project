import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import {
  FiEye,
  FiSearch,
  FiMic,
  FiCheckCircle,
  FiPieChart,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, ChartCard } from '../../components/cards/Cards';
import { ANALYTICS_DATA, DASHBOARD_STATS } from '../../constants/mockData';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workforce & Platform Analytics"
        subtitle="Deep insight metrics on profile views, search query volume, voice audio playback rates, and completion percentages."
      />

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Profile View Traffic"
          value="284,500"
          trend="+24.8%"
          trendType="up"
          subtext="Monthly Candidate Impressions"
          icon={FiEye}
          color="teal"
        />
        <StatCard
          title="Search Usage Queries"
          value="18,450"
          trend="+18.2%"
          trendType="up"
          subtext="Employer Talent Searches"
          icon={FiSearch}
          color="blue"
        />
        <StatCard
          title="Voice Profile Usage"
          value={ANALYTICS_DATA.metrics.voiceSamplePlaybacks}
          trend="+32.1%"
          trendType="up"
          subtext="Audio Introductions Played"
          icon={FiMic}
          color="red"
        />
        <StatCard
          title="Correction Audit Rate"
          value={ANALYTICS_DATA.metrics.correctionApprovalRate}
          trend="+1.4%"
          trendType="up"
          subtext="Verified Data Precision"
          icon={FiCheckCircle}
          color="emerald"
        />
      </div>

      {/* Analytics Chart Row 1: Search Categories Bar Chart & Voice Audio Playback Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ChartCard
            title="Most Searched Culinary Roles"
            subtitle="Employer search volume breakdown by kitchen designation"
          >
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_DATA.searchUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }} />
                  <Bar dataKey="count" name="Searches" fill="#0F766E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-6">
          <ChartCard
            title="Voice Profile Audio Playbacks (Line Chart)"
            subtitle="Growth trend in employer voice sample listens"
          >
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ANALYTICS_DATA.voiceUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }} />
                  <Line type="monotone" dataKey="listened" name="Audio Listens" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Analytics Chart Row 2: Completion Rate & Language Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ChartCard
            title="Candidate Registration Growth Area Chart"
            subtitle="Long-term growth rate of platform talent pool"
          >
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DASHBOARD_STATS.monthlyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }} />
                  <Area type="monotone" dataKey="employees" stroke="#14B8A6" fill="#CCFBF1" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Platform Quality KPI Indicators</h3>
            <p className="text-xs text-slate-500 font-medium">Data completion and SLA response metrics.</p>
          </div>

          <div className="space-y-4 my-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Profile Completion Rate</span>
                <span className="text-teal-700">{ANALYTICS_DATA.metrics.profileCompletionRate}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-teal-700 rounded-full" style={{ width: ANALYTICS_DATA.metrics.profileCompletionRate }} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Correction Approval Precision</span>
                <span className="text-emerald-700">{ANALYTICS_DATA.metrics.correctionApprovalRate}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: ANALYTICS_DATA.metrics.correctionApprovalRate }} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Avg Global Search Latency</span>
              <span className="font-mono font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md border border-amber-200">
                {ANALYTICS_DATA.metrics.avgSearchResponseMs}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
