import React, { useState } from 'react';

export default function FollowUpBanner({ contacts, setFilters }) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const due = contacts.filter(c => 
    c.followUpDate && 
    c.followUpDate <= todayStr && 
    (c.status === "Sent" || c.status === "Connected")
  );

  if (due.length === 0) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 relative">
      <div className="flex justify-between items-center">
        <div className="text-amber-800 font-medium">
          ⚠️ {due.length} {due.length === 1 ? 'contact needs' : 'contacts need'} follow-up
          <button 
            onClick={() => setFilters({ search: '', status: 'All', outreachType: 'All', overdueOnly: true })} 
            className="ml-4 underline hover:text-amber-900 cursor-pointer"
          >
            Review these
          </button>
        </div>
        <button className="text-amber-600 hover:text-amber-800 cursor-pointer" onClick={() => setDismissed(true)}>
          ✖
        </button>
      </div>
    </div>
  );
}
