document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('recent-list');
  const countEl = document.getElementById('today-count');
  const statusEl = document.getElementById('api-status');

  try {
    const contacts = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: "GET_RECENT" }, resolve);
    });
    
    if (!contacts || contacts.length === 0) {
      listEl.innerHTML = "<li>No recent logs</li>";
      statusEl.className = "status active"; // assume alive
      return;
    }

    // Filter array to get today's count
    const todayStr = new Date().toISOString().split("T")[0];
    const todays = contacts.filter(c => c.outreachDate === todayStr || (c.lastUpdated && c.lastUpdated.startsWith(todayStr)));
    countEl.innerText = todays.length;

    // Render last 5
    const last5 = contacts.slice(0, 5);
    listEl.innerHTML = last5.map(c => `
      <li>
        <strong>${c.name}</strong>
        <span>${c.company || 'Unknown'} • ${c.outreachType}</span>
      </li>
    `).join("");

    statusEl.className = "status active";

  } catch (err) {
    statusEl.className = "status error";
    listEl.innerHTML = "<li>Error loading logs</li>";
  }
});
