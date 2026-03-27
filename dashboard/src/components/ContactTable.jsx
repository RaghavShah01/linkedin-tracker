import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

export default function ContactTable({ contacts, loading, onEdit }) {
  const [sortConfig, setSortConfig] = useState({ key: 'outreachDate', direction: 'desc' });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-1">No contacts yet</h3>
        <p className="text-gray-500">Install the Chrome extension and start reaching out, or add one manually!</p>
      </div>
    );
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th onClick={() => handleSort('name')} className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100">Name</th>
            <th onClick={() => handleSort('company')} className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100">Company</th>
            <th onClick={() => handleSort('roleTheyreHiring')} className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100">Role</th>
            <th onClick={() => handleSort('outreachType')} className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100">Type</th>
            <th onClick={() => handleSort('outreachDate')} className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100">Date</th>
            <th onClick={() => handleSort('status')} className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100">Status</th>
            <th onClick={() => handleSort('followUpDate')} className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100">Follow-up</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedContacts.map(c => {
            const isOverdue = c.followUpDate <= todayStr && (c.status === "Sent" || c.status === "Connected");
            return (
              <tr key={c.contactId} className="hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-3">
                  <button onClick={() => onEdit(c)} className="font-medium text-blue-600 hover:underline text-left cursor-pointer">
                    {c.name}
                  </button>
                  <div className="text-xs text-gray-400 truncate max-w-[150px]">{c.title}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{c.company}</td>
                <td className="px-4 py-3 text-gray-700">{c.roleTheyreHiring || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{c.outreachType}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(c.outreachDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {c.followUpDate ? new Date(c.followUpDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(c)} className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
