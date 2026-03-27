import React from 'react';
import { STATUS_OPTIONS, OUTREACH_TYPES } from '../constants';

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: 'All', outreachType: 'All', overdueOnly: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex-1 min-w-[200px]">
        <input 
          type="text" 
          name="search"
          placeholder="Search by name or company..." 
          value={filters.search}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div>
        <select 
          name="status" 
          value={filters.status} 
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-1.5 bg-white outline-none"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <select 
          name="outreachType" 
          value={filters.outreachType} 
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-1.5 bg-white outline-none"
        >
          <option value="All">All Types</option>
          {OUTREACH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {filters.overdueOnly && (
        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">Overdue Only</span>
      )}
      <button 
        onClick={clearFilters}
        className="text-gray-500 hover:text-gray-700 underline text-sm cursor-pointer"
      >
        Clear filters
      </button>
    </div>
  );
}
