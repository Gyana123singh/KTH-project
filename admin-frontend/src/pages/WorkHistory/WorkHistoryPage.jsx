import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiGrid,
  FiList,
  FiCheckCircle,
  FiEdit,
  FiPhone,
  FiPlus,
  FiSearch,
  FiAlertTriangle
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Table } from '../../components/tables/Table';
import { Button, Badge, SearchInput, Modal, Input, Textarea, Select } from '../../components/common/UIComponents';
import { MOCK_WORK_HISTORIES, POSITIONS } from '../../constants/mockData';
import { useToast } from '../../context/ToastContext';

export const WorkHistoryPage = () => {
  const [workHistories, setWorkHistories] = useState(MOCK_WORK_HISTORIES);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'timeline'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const filteredHistories = workHistories.filter((wh) => {
    const matchesSearch =
      wh.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || wh.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (record) => {
    setActiveRecord(record);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setWorkHistories(workHistories.map((wh) => (wh.id === activeRecord.id ? activeRecord : wh)));
    showToast(`Work history for ${activeRecord.employeeName} updated successfully.`, 'success');
    setIsEditModalOpen(false);
  };

  const handleVerifyStatus = (record, newStatus) => {
    setWorkHistories(workHistories.map((wh) => (wh.id === record.id ? { ...wh, status: newStatus } : wh)));
    showToast(`Work history status updated to ${newStatus}.`, 'success');
  };

  const columns = [
    {
      header: 'Candidate',
      key: 'employeeName',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.employeePhoto} alt={row.employeeName} className="w-8 h-8 rounded-full object-cover shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-xs">{row.employeeName}</span>
            <span className="text-[10px] text-slate-500 font-mono">{row.employeeId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Restaurant',
      key: 'restaurant',
      sortable: true,
      render: (row) => <span className="font-bold text-xs text-slate-800">{row.restaurant}</span>,
    },
    {
      header: 'Position Held',
      key: 'position',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-700 font-semibold">{row.position}</span>,
    },
    {
      header: 'Duration',
      key: 'startDate',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {row.startDate} - {row.endDate}
        </span>
      ),
    },
    {
      header: 'Reference Contact',
      key: 'referenceName',
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-900">{row.referenceName}</p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <FiPhone className="w-3 h-3 text-teal-600" />
            <span>{row.referencePhone}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Verification',
      key: 'status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'Verified' ? 'emerald' : row.status === 'Disputed' ? 'red' : 'amber'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status !== 'Verified' && (
            <button
              onClick={() => handleVerifyStatus(row, 'Verified')}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
              title="Mark Verified"
            >
              Verify
            </button>
          )}
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-amber-600 transition-colors"
            title="Edit Record"
          >
            <FiEdit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Work History Log"
        subtitle={`Managing ${workHistories.length} cross-restaurant employment records and reference verification checks.`}
      >
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'table' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiList className="w-4 h-4" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'timeline' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiGrid className="w-4 h-4" />
            <span>Cards</span>
          </button>
        </div>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by candidate name, restaurant, or role..."
          className="max-w-md"
        />

        <Select
          options={['All', 'Verified', 'Pending Verification', 'Disputed']}
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="text-xs w-full md:w-48"
        />
      </div>

      {/* View Modes */}
      {viewMode === 'table' ? (
        <Table columns={columns} data={filteredHistories} pageSize={10} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistories.slice(0, 12).map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.employeePhoto} alt={item.employeeName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.employeeName}</h4>
                    <p className="text-xs text-slate-500 font-mono">{item.id}</p>
                  </div>
                </div>
                <Badge variant={item.status === 'Verified' ? 'emerald' : 'amber'}>{item.status}</Badge>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <p><strong className="text-slate-900">{item.position}</strong> at <strong className="text-teal-700">{item.restaurant}</strong></p>
                <p className="text-slate-500 font-mono">{item.startDate} to {item.endDate}</p>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                <p className="font-bold text-slate-800">Ref: {item.referenceName}</p>
                <p className="text-slate-500">{item.referencePhone}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" icon={FiEdit} onClick={() => handleOpenEdit(item)}>
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Work History Modal */}
      {activeRecord && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Work Record: ${activeRecord.id}`}>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Restaurant / Kitchen Group"
              value={activeRecord.restaurant}
              onChange={(e) => setActiveRecord({ ...activeRecord, restaurant: e.target.value })}
              required
            />
            <Select
              label="Position Held"
              options={POSITIONS}
              value={activeRecord.position}
              onChange={(e) => setActiveRecord({ ...activeRecord, position: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                value={activeRecord.startDate}
                onChange={(e) => setActiveRecord({ ...activeRecord, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                value={activeRecord.endDate}
                onChange={(e) => setActiveRecord({ ...activeRecord, endDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Reference Name"
                value={activeRecord.referenceName}
                onChange={(e) => setActiveRecord({ ...activeRecord, referenceName: e.target.value })}
              />
              <Input
                label="Reference Phone"
                value={activeRecord.referencePhone}
                onChange={(e) => setActiveRecord({ ...activeRecord, referencePhone: e.target.value })}
              />
            </div>
            <Select
              label="Verification Status"
              options={['Verified', 'Pending Verification', 'Disputed']}
              value={activeRecord.status}
              onChange={(e) => setActiveRecord({ ...activeRecord, status: e.target.value })}
            />
            <Textarea
              label="Verification Audit Notes"
              value={activeRecord.notes}
              onChange={(e) => setActiveRecord({ ...activeRecord, notes: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
