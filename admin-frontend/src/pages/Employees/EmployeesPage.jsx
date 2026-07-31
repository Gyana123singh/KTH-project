import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiMic,
  FiDownload,
  FiMoreVertical
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Table } from '../../components/tables/Table';
import { Button, Badge, Avatar, Select, SearchInput } from '../../components/common/UIComponents';
import { DeleteModal } from '../../components/layout/LayoutHelpers';
import { MOCK_EMPLOYEES, DEPARTMENTS } from '../../constants/mockData';
import { useToast } from '../../context/ToastContext';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.currentPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  const handleDeleteEmployee = () => {
    if (!selectedEmployeeToDelete) return;
    setEmployees(employees.filter((e) => e.id !== selectedEmployeeToDelete.id));
    showToast(`Employee ${selectedEmployeeToDelete.name} deleted successfully.`, 'success');
    setSelectedEmployeeToDelete(null);
  };

  const columns = [
    {
      header: 'Photo & Candidate',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.photo} name={row.name} size="md" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-sm">{row.name}</span>
            <span className="text-[11px] text-slate-500 font-mono">{row.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Current Position',
      key: 'currentPosition',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
          <span>{row.currentPosition}</span>
          {row.hasVoiceProfile && (
            <span className="p-1 rounded-full bg-teal-50 text-teal-700" title="Voice Profile Attached">
              <FiMic className="w-3 h-3" />
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Department',
      key: 'department',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.department}</span>,
    },
    {
      header: 'Experience',
      key: 'experienceYears',
      sortable: true,
      render: (row) => <span className="text-xs font-bold text-slate-700">{row.experience}</span>,
    },
    {
      header: 'Created Date',
      key: 'createdDate',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-500 font-mono">{row.createdDate}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => (
        <Badge
          variant={
            row.status === 'Active'
              ? 'emerald'
              : row.status === 'Pending Verification'
              ? 'amber'
              : 'red'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/employees/${row.id}`)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-teal-700 transition-colors"
            title="View Profile"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/employees/${row.id}/edit`)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-amber-600 transition-colors"
            title="Edit Candidate"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedEmployeeToDelete(row)}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            title="Delete Candidate"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Roster Management"
        subtitle={`Managing ${employees.length} registered kitchen talent candidates across departments.`}
      >
        <Button
          variant="primary"
          icon={FiPlus}
          onClick={() => navigate(`/employees/${MOCK_EMPLOYEES[0].id}/edit`)}
        >
          Add New Employee
        </Button>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by candidate name, position, or ID..."
          className="max-w-md"
        />

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            options={['All', ...DEPARTMENTS]}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="text-xs"
          />

          <Select
            options={['All', 'Active', 'Pending Verification', 'Inactive']}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Reusable Data Table */}
      <Table
        columns={columns}
        data={filteredEmployees}
        pageSize={10}
        renderMobileCard={(row) => (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={row.photo} name={row.name} size="md" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{row.name}</h4>
                  <p className="text-xs text-slate-500">{row.currentPosition}</p>
                </div>
              </div>
              <Badge variant={row.status === 'Active' ? 'emerald' : 'amber'}>{row.status}</Badge>
            </div>
            <div className="grid grid-cols-2 text-xs text-slate-600 gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>Dept: <strong>{row.department}</strong></div>
              <div>Exp: <strong>{row.experience}</strong></div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <Button size="sm" variant="outline" icon={FiEye} onClick={() => navigate(`/employees/${row.id}`)}>
                View
              </Button>
              <Button size="sm" variant="secondary" icon={FiEdit} onClick={() => navigate(`/employees/${row.id}/edit`)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" icon={FiTrash2} onClick={() => setSelectedEmployeeToDelete(row)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(selectedEmployeeToDelete)}
        onClose={() => setSelectedEmployeeToDelete(null)}
        onDelete={handleDeleteEmployee}
        itemName={selectedEmployeeToDelete?.name}
      />
    </div>
  );
};
