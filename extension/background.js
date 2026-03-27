importScripts("config.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOG_OUTREACH") {
    handleOutreach(message.payload);
  }
  if (message.type === "GET_RECENT") {
    getRecentFromStorage().then(sendResponse);
    return true; // async
  }
});

async function handleOutreach(payload) {
  try {
    const { API_BASE_URL, API_KEY } = CONFIG;
    
    // POST to API Gateway
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }
    
    const contact = await response.json();
    
    // Store in chrome.storage.local for popup display
    await appendToLocalStorage(contact);
    
    // Show notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Outreach Logged",
      message: `${contact.name} at ${contact.company || "Unknown"} — ${contact.outreachType}`
    });
    
  } catch (err) {
    console.error("Failed to log outreach:", err);
  }
}

async function getRecentFromStorage() {
  const result = await chrome.storage.local.get("recentContacts");
  return result.recentContacts || [];
}

async function appendToLocalStorage(contact) {
  const { recentContacts = [] } = await chrome.storage.local.get("recentContacts");
  const updated = [contact, ...recentContacts].slice(0, 20); // keep last 20
  await chrome.storage.local.set({ recentContacts: updated });
}
