import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiInbox } from 'react-icons/fi';
import { Pagination } from '../common/UIComponents';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  pageSize = 10,
  renderMobileCard,
  emptyMessage = 'No records found',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (key) => {
    if (!key) return;
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortColumn] ?? '';
      let valB = b[sortColumn] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 backdrop-blur-xs">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-4 ${col.sortable ? 'cursor-pointer select-none hover:text-slate-900' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortColumn === col.key && (
                      <span>
                        {sortDirection === 'asc' ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                      {col.render ? col.render(row, rowIndex) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FiInbox className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List Fallback (Prevents Horizontal Scrolling) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {paginatedData.length > 0 ? (
          paginatedData.map((row, rowIndex) => (
            <div key={row.id || rowIndex} className="p-4 hover:bg-slate-50/80 transition-colors">
              {renderMobileCard ? renderMobileCard(row) : (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900">{row.name || row.title || row.id}</div>
                  <div className="text-xs text-slate-500">{JSON.stringify(row)}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">{emptyMessage}</div>
        )}
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};
