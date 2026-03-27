import React, { useState } from 'react';
import { CONTACT_TYPES, OUTREACH_TYPES, STATUS_OPTIONS } from '../constants';
import StatusBadge from './StatusBadge';

export default function EditContactModal({ contact, onClose, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({ ...contact });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate(contact.contactId, formData);
  };

  const quickStatus = async (status) => {
    setLoading(true);
    await onUpdate(contact.contactId, { status });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Edit Contact</h2>
            {contact.autoDetected && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-100">Auto-detected</span>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✖</button>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Quick Status:</span>
          <button onClick={() => quickStatus("Connected")} className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">Connect</button>
          <button onClick={() => quickStatus("Replied")} className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">Replied</button>
          <button onClick={() => quickStatus("No Response")} className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">No Response</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input name="company" value={formData.company || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" value={formData.linkedinUrl || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
              <select name="contactType" value={formData.contactType || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2 bg-white">
                {CONTACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role They're Hiring</label>
              <input name="roleTheyreHiring" value={formData.roleTheyreHiring || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outreach Type *</label>
              <select required name="outreachType" value={formData.outreachType || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2 bg-white">
                {OUTREACH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outreach Date *</label>
              <input type="date" required name="outreachDate" value={formData.outreachDate || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note Text</label>
            <textarea name="noteText" rows="3" value={formData.noteText || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2 bg-white">
              {STATUS_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div className="pt-2 text-xs text-gray-500 flex justify-between items-center">
            <span>Last updated: {new Date(contact.lastUpdated).toLocaleString()}</span>
          </div>

          <div className="pt-4 flex justify-between items-center bg-white border-t mt-4">
            <button type="button" onClick={() => { if(confirm("Are you sure?")) onDelete(contact.contactId); }} className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer">Delete Contact</button>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
                {loading ? 'Saving...' : 'Update Contact'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
