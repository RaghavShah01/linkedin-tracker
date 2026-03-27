import React, { useState, useMemo } from 'react';
import { useContacts } from './hooks/useContacts';
import FollowUpBanner from './components/FollowUpBanner';
import FilterBar from './components/FilterBar';
import ContactTable from './components/ContactTable';
import AddContactModal from './components/AddContactModal';
import EditContactModal from './components/EditContactModal';

export default function App() {
  const { contacts, loading, error, addContact, updateContact, deleteContact } = useContacts();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  
  const [filters, setFilters] = useState({ search: '', status: 'All', outreachType: 'All', overdueOnly: false });

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = filters.search ? (c.name?.toLowerCase().includes(filters.search.toLowerCase()) || c.company?.toLowerCase().includes(filters.search.toLowerCase())) : true;
      const matchStatus = filters.status !== 'All' ? c.status === filters.status : true;
      const matchType = filters.outreachType !== 'All' ? c.outreachType === filters.outreachType : true;
      let matchOverdue = true;
      if (filters.overdueOnly) {
        const todayStr = new Date().toISOString().split("T")[0];
        matchOverdue = c.followUpDate && c.followUpDate <= todayStr && (c.status === "Sent" || c.status === "Connected");
      }
      return matchSearch && matchStatus && matchType && matchOverdue;
    });
  }, [contacts, filters]);

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">LinkedIn Tracker</h1>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors cursor-pointer"
        >
          + Add Contact
        </button>
      </div>

      <FollowUpBanner contacts={contacts} setFilters={setFilters} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>
        
        {error && <div className="p-4 text-red-600 bg-red-50">{error}</div>}
        
        <ContactTable 
          contacts={filteredContacts} 
          loading={loading} 
          onEdit={(c) => setEditingContact(c)} 
        />
      </div>

      {isAddOpen && (
        <AddContactModal 
          onClose={() => setIsAddOpen(false)} 
          onSubmit={async (data) => {
            await addContact(data);
            setIsAddOpen(false);
          }} 
        />
      )}

      {editingContact && (
        <EditContactModal 
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onUpdate={async (id, data) => {
            await updateContact(id, data);
            setEditingContact(null);
          }}
          onDelete={async (id) => {
            await deleteContact(id);
            setEditingContact(null);
          }}
        />
      )}
    </div>
  );
}
