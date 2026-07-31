import React, { useState } from 'react';
import {
  FiCheckSquare,
  FiCheck,
  FiX,
  FiEdit3,
  FiClock,
  FiAlertCircle,
  FiSave
} from 'react-icons/fi';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, Badge, Avatar, Modal, Input, Textarea } from '../../components/common/UIComponents';
import { MOCK_CORRECTIONS } from '../../constants/mockData';
import { useToast } from '../../context/ToastContext';

export const CorrectionsPage = () => {
  const [corrections, setCorrections] = useState(MOCK_CORRECTIONS);
  const [activeItemToEdit, setActiveItemToEdit] = useState(null);
  const { showToast } = useToast();

  const handleApprove = (item) => {
    setCorrections(corrections.filter((c) => c.id !== item.id));
    showToast(`Correction ${item.id} approved and merged into candidate profile!`, 'success');
  };

  const handleReject = (item) => {
    setCorrections(corrections.filter((c) => c.id !== item.id));
    showToast(`Correction ${item.id} rejected. Candidate notified.`, 'danger');
  };

  const handleSaveEditCorrection = (e) => {
    e.preventDefault();
    setCorrections(corrections.map((c) => (c.id === activeItemToEdit.id ? activeItemToEdit : c)));
    showToast(`Correction item ${activeItemToEdit.id} updated.`, 'info');
    setActiveItemToEdit(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Corrections Queue"
        subtitle="Review user-submitted profile change requests with inline field diff highlighting."
      >
        <Badge variant="amber" className="text-xs font-bold px-3 py-1">
          {corrections.length} Requests Pending Audit
        </Badge>
      </PageHeader>

      {corrections.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <FiCheckSquare className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Corrections Queue Cleared</h3>
          <p className="text-xs">All candidate profile modification requests have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {corrections.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Request Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar src={item.employeePhoto} name={item.employeeName} size="md" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.employeeName}</h3>
                    <p className="text-xs text-slate-500 font-mono">ID: {item.employeeId} • Req: {item.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.requestedDate}</span>
                  </span>
                  <Badge variant="amber">Pending Audit</Badge>
                </div>
              </div>

              {/* Reason / Context */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900">Submitted Reason:</strong> {item.reason}
              </div>

              {/* Side by Side Diff Viewer */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Field Changed: <strong className="text-teal-700">{item.fieldName}</strong>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Old Value */}
                  <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-red-900 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                      Previous Recorded Value
                    </span>
                    <p className="text-sm font-semibold line-through opacity-80">{item.oldValue}</p>
                  </div>

                  {/* New Value (Highlighting Changed Text) */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                      Proposed New Value
                    </span>
                    <p className="text-sm font-bold text-emerald-950">{item.newValue}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  icon={FiEdit3}
                  onClick={() => setActiveItemToEdit(item)}
                >
                  Edit Request
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  icon={FiX}
                  onClick={() => handleReject(item)}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  icon={FiCheck}
                  onClick={() => handleApprove(item)}
                >
                  Approve & Merge
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Correction Item Modal */}
      {activeItemToEdit && (
        <Modal isOpen={Boolean(activeItemToEdit)} onClose={() => setActiveItemToEdit(null)} title="Edit Proposed Correction">
          <form onSubmit={handleSaveEditCorrection} className="space-y-4">
            <Input
              label="Field Name"
              value={activeItemToEdit.fieldName}
              onChange={(e) => setActiveItemToEdit({ ...activeItemToEdit, fieldName: e.target.value })}
            />
            <Input
              label="Previous Value"
              value={activeItemToEdit.oldValue}
              onChange={(e) => setActiveItemToEdit({ ...activeItemToEdit, oldValue: e.target.value })}
            />
            <Input
              label="Proposed New Value"
              value={activeItemToEdit.newValue}
              onChange={(e) => setActiveItemToEdit({ ...activeItemToEdit, newValue: e.target.value })}
            />
            <Textarea
              label="Audit Note Reason"
              value={activeItemToEdit.reason}
              onChange={(e) => setActiveItemToEdit({ ...activeItemToEdit, reason: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setActiveItemToEdit(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={FiSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
