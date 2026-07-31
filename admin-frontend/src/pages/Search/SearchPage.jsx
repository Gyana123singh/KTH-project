import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiUsers,
  FiHome,
  FiBriefcase,
  FiMapPin,
  FiFilter,
  FiArrowRight
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, Badge, Avatar, SearchInput, Select } from '../../components/common/UIComponents';
import { MOCK_EMPLOYEES, MOCK_EMPLOYERS, DEPARTMENTS, POSITIONS, LOCATIONS } from '../../constants/mockData';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All'); // 'All' | 'Employees' | 'Restaurants'
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPos, setSelectedPos] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');

  const navigate = useNavigate();

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  // Search Results calculation
  const employeeResults = useMemo(() => {
    if (category === 'Restaurants') return [];
    return MOCK_EMPLOYEES.filter((emp) => {
      const q = query.toLowerCase();
      const matchesText =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.currentPosition.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.location.toLowerCase().includes(q);

      const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchesPos = selectedPos === 'All' || emp.currentPosition === selectedPos;
      const matchesLoc = selectedLoc === 'All' || emp.location === selectedLoc;

      return matchesText && matchesDept && matchesPos && matchesLoc;
    });
  }, [query, category, selectedDept, selectedPos, selectedLoc]);

  const employerResults = useMemo(() => {
    if (category === 'Employees') return [];
    return MOCK_EMPLOYERS.filter((emp) => {
      const q = query.toLowerCase();
      const matchesText =
        !q ||
        emp.restaurant.toLowerCase().includes(q) ||
        emp.owner.toLowerCase().includes(q) ||
        emp.location.toLowerCase().includes(q);

      const matchesLoc = selectedLoc === 'All' || emp.location === selectedLoc;
      return matchesText && matchesLoc;
    });
  }, [query, category, selectedLoc]);

  const totalResults = employeeResults.length + employerResults.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Directory Search"
        subtitle="Multi-facet live search across candidates, restaurant employers, culinary roles, and location hubs."
      />

      {/* Main Search Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          placeholder="Type employee name, position (e.g. Sous Chef), restaurant, department, or city..."
          className="text-base"
        />

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Search Category</label>
            <Select
              options={['All', 'Employees', 'Restaurants']}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Department</label>
            <Select
              options={['All', ...DEPARTMENTS]}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Position Role</label>
            <Select
              options={['All', ...POSITIONS]}
              value={selectedPos}
              onChange={(e) => setSelectedPos(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location Hub</label>
            <Select
              options={['All', ...LOCATIONS]}
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Found <strong className="text-slate-900">{totalResults}</strong> matching results
        </span>
      </div>

      {/* Candidate Results Section */}
      {employeeResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <FiUsers className="w-4 h-4 text-teal-700" />
            <span>Kitchen Talent Candidates ({employeeResults.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employeeResults.map((emp) => (
              <div
                key={emp.id}
                onClick={() => navigate(`/employees/${emp.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={emp.photo} name={emp.name} size="md" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">{emp.name}</h4>
                      <p className="text-xs font-semibold text-teal-700">{emp.currentPosition}</p>
                    </div>
                  </div>
                  <Badge variant={emp.status === 'Active' ? 'emerald' : 'amber'}>{emp.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>Dept: <strong>{emp.department}</strong></div>
                  <div>Exp: <strong>{emp.experience}</strong></div>
                  <div className="col-span-2 text-slate-500 truncate">Loc: {emp.location}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 font-mono">{emp.id}</span>
                  <span className="font-bold text-teal-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Profile <FiArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restaurant Results Section */}
      {employerResults.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <FiHome className="w-4 h-4 text-amber-600" />
            <span>Employer Restaurants ({employerResults.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employerResults.map((emp) => (
              <div
                key={emp.id}
                onClick={() => navigate(`/employers/${emp.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">{emp.restaurant}</h4>
                  <Badge variant="teal">{emp.outletCount} Outlets</Badge>
                </div>

                <p className="text-xs text-slate-600">Owner: <strong>{emp.owner}</strong></p>

                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.location}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-mono">{emp.id}</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Employer <FiArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
