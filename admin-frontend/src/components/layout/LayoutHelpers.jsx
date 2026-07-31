import React from 'react';
import { FiInbox, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { Modal, Button } from '../common/UIComponents';

export const Footer = () => {
  return null;
};

export const LoadingSpinner = ({ label = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 min-h-[300px]">
      <div className="w-10 h-10 border-4 border-teal-700/20 border-t-teal-700 rounded-full animate-spin" />
      <p className="text-xs font-semibold text-slate-500 tracking-wide">{label}</p>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No records found',
  description = 'Try adjusting your search criteria or filters.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border border-slate-200/80 shadow-xs my-4">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm font-medium mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-center gap-3.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium">
          <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{message}</span>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  itemName = 'this item',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Record">
      <div className="space-y-4">
        <div className="flex items-center gap-3.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-medium">
          <FiTrash2 className="w-5 h-5 text-red-600 shrink-0" />
          <span>
            Are you sure you want to delete <strong className="font-bold">{itemName}</strong>? This action cannot be undone.
          </span>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDelete} isLoading={isLoading}>
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
};
