import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../components/common/UIComponents';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight my-0">404</h1>
          <h2 className="text-xl font-bold text-slate-800 mt-2 mb-1">Page Not Found</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            The admin route or resource you are looking for does not exist or has been moved.
          </p>
        </div>

        <Button variant="primary" icon={FiHome} className="w-full" onClick={() => navigate('/')}>
          Return to Admin Dashboard
        </Button>
      </div>
    </div>
  );
};
