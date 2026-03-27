const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY
};

export const api = {
  getContacts: () => fetch(`${BASE_URL}/contacts`, { headers }).then(r => r.json()),
  createContact: (data) => fetch(`${BASE_URL}/contacts`, { method: "POST", headers, body: JSON.stringify(data) }).then(r => r.json()),
  updateContact: (id, data) => fetch(`${BASE_URL}/contacts/${id}`, { method: "PUT", headers, body: JSON.stringify(data) }).then(r => r.json()),
  deleteContact: (id) => fetch(`${BASE_URL}/contacts/${id}`, { method: "DELETE", headers })
};
