import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await api.getContacts();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (data) => {
    const newContact = await api.createContact(data);
    setContacts(prev => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = async (id, data) => {
    const updated = await api.updateContact(id, data);
    setContacts(prev => prev.map(c => c.contactId === id ? updated : c));
    return updated;
  };

  const deleteContact = async (id) => {
    await api.deleteContact(id);
    setContacts(prev => prev.filter(c => c.contactId !== id));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, error, addContact, updateContact, deleteContact, refetch: fetchContacts };
}
