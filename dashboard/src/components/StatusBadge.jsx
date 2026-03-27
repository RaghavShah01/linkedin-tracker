import React from 'react';
import { STATUS_COLORS } from '../constants';

export default function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
}
