import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiEye,
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiHome
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Table } from '../../components/tables/Table';
import { Button, Badge, SearchInput, Modal, Input } from '../../components/common/UIComponents';
import { DeleteModal } from '../../components/layout/LayoutHelpers';
import { MOCK_EMPLOYERS } from '../../constants/mockData';
import { useToast } from '../../context/ToastContext';

export const EmployersPage = () => {
  const [employers, setEmployers] = useState(MOCK_EMPLOYERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployerToDelete, setSelectedEmployerToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployer, setNewEmployer] = useState({ restaurant: '', owner: '', poc: '', phone: '', location: 'New York, NY', outletCount: 1 });

  const navigate = useNavigate();
  const { showToast } = useToast();

  const filteredEmployers = useMemo(() => {
    return employers.filter((emp) => {
      return (
        emp.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.poc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [employers, searchTerm]);

  const handleDelete = () => {
    if (!selectedEmployerToDelete) return;
    setEmployers(employers.filter((e) => e.id !== selectedEmployerToDelete.id));
    showToast(`Employer partner ${selectedEmployerToDelete.restaurant} deleted.`, 'success');
    setSelectedEmployerToDelete(null);
  };

  const handleCreateEmployer = (e) => {
    e.preventDefault();
    if (!newEmployer.restaurant || !newEmployer.owner) return;

    const created = {
      id: `EMP-GRP-${300 + employers.length}`,
      ...newEmployer,
      designation: 'General Manager',
      status: 'Active Partner',
      rating: '4.8',
      activeListings: 3,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setEmployers([created, ...employers]);
    showToast(`New partner employer ${created.restaurant} created!`, 'success');
    setIsAddModalOpen(false);
    setNewEmployer({ restaurant: '', owner: '', poc: '', phone: '', location: 'New York, NY', outletCount: 1 });
  };

  const columns = [
    {
      header: 'Restaurant & Group',
      key: 'restaurant',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-sm shrink-0 border border-amber-200">
            <FiHome className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{row.restaurant}</p>
            <p className="text-[11px] text-slate-500 font-mono">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Owner / Group Founder',
      key: 'owner',
      sortable: true,
      render: (row) => <span className="font-bold text-xs text-slate-800">{row.owner}</span>,
    },
    {
      header: 'Point of Contact (POC)',
      key: 'poc',
      sortable: true,
      render: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-900">{row.poc}</p>
          <p className="text-[11px] text-slate-500">{row.designation}</p>
        </div>
      ),
    },
    {
      header: 'Phone Number',
      key: 'phone',
      render: (row) => <span className="text-xs font-mono text-slate-600">{row.phone}</span>,
    },
    {
      header: 'Primary Location',
      key: 'location',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
          <FiMapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{row.location}</span>
        </div>
      ),
    },
    {
      header: 'Outlets',
      key: 'outletCount',
      sortable: true,
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-800 text-xs">
          {row.outletCount} Locations
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/employers/${row.id}`)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-teal-700 transition-colors"
            title="View Employer Profile"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedEmployerToDelete(row)}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            title="Delete Partner"
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
        title="Employer Profiles & Hospitality Partners"
        subtitle={`Managing ${employers.length} active restaurant groups and partner hiring entities.`}
      >
        <Button variant="primary" icon={FiPlus} onClick={() => setIsAddModalOpen(true)}>
          Add Employer Partner
        </Button>
      </PageHeader>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by restaurant name, owner, contact person, or location..."
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredEmployers}
        pageSize={10}
        renderMobileCard={(row) => (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-sm">
                  <FiHome className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{row.restaurant}</h4>
                  <p className="text-xs text-slate-500">Owner: {row.owner}</p>
                </div>
              </div>
              <Badge variant="teal">{row.outletCount} Outlets</Badge>
            </div>
            <div className="grid grid-cols-2 text-xs text-slate-600 gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>POC: <strong>{row.poc}</strong></div>
              <div>Phone: <strong>{row.phone}</strong></div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button size="sm" variant="outline" icon={FiEye} onClick={() => navigate(`/employers/${row.id}`)}>
                View Profile
              </Button>
              <Button size="sm" variant="danger" icon={FiTrash2} onClick={() => setSelectedEmployerToDelete(row)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      />

      {/* Add Employer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Partner Employer">
        <form onSubmit={handleCreateEmployer} className="space-y-4">
          <Input
            label="Restaurant / Hospitality Group Name"
            value={newEmployer.restaurant}
            onChange={(e) => setNewEmployer({ ...newEmployer, restaurant: e.target.value })}
            placeholder="e.g. Eleven Madison Partners"
            required
          />
          <Input
            label="Owner / Culinary Director"
            value={newEmployer.owner}
            onChange={(e) => setNewEmployer({ ...newEmployer, owner: e.target.value })}
            placeholder="e.g. Daniel Humm"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Point of Contact (POC)"
              value={newEmployer.poc}
              onChange={(e) => setNewEmployer({ ...newEmployer, poc: e.target.value })}
              placeholder="Alex Rivera"
            />
            <Input
              label="Contact Phone"
              value={newEmployer.phone}
              onChange={(e) => setNewEmployer({ ...newEmployer, phone: e.target.value })}
              placeholder="+1 (555) 234-5678"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Employer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(selectedEmployerToDelete)}
        onClose={() => setSelectedEmployerToDelete(null)}
        onDelete={handleDelete}
        itemName={selectedEmployerToDelete?.restaurant}
      />
    </div>
  );
};
