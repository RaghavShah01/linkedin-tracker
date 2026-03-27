let recentlyLogged = new Set();

function extractPersonFromProfilePage() {
  const name = document.querySelector('h1.text-heading-xlarge')?.innerText?.trim();
  const title = document.querySelector('.text-body-medium.break-words')?.innerText?.trim();
  const company = document.querySelector('[aria-label*="Current company"]')?.innerText?.trim()
               || document.querySelector('.pv-text-details__right-panel span')?.innerText?.trim();
  const linkedinUrl = window.location.href.split('?')[0];
  return { name, title, company, linkedinUrl };
}

function extractPersonFromModal() {
  const name = document.querySelector('.artdeco-modal__header h2')?.innerText?.trim()
            || document.querySelector('[data-test-modal] h2')?.innerText?.trim();
  return { name };
}

function extractPersonFromConversation() {
  const name = document.querySelector('.msg-thread__link-to-profile')?.innerText?.trim()
            || document.querySelector('.msg-entity-lockup__entity-title')?.innerText?.trim();
  return { name };
}

function logOutreach(type, noteText = "") {
  let person = {};
  if (type === "Message") {
    person = extractPersonFromConversation();
  } else if (document.querySelector('h1.text-heading-xlarge')) {
    person = extractPersonFromProfilePage();
  } else {
    person = extractPersonFromModal();
  }
  
  if (!person.name) return;
  
  if (recentlyLogged.has(person.name)) return;
  
  recentlyLogged.add(person.name);
  setTimeout(() => recentlyLogged.delete(person.name), 5000);
  
  chrome.runtime.sendMessage({
    type: "LOG_OUTREACH",
    payload: {
      name: person.name,
      title: person.title || "",
      company: person.company || "",
      linkedinUrl: person.linkedinUrl || window.location.href.split('?')[0],
      outreachType: type,
      noteText: noteText,
      autoDetected: true
    }
  });
  console.log(`[LinkedIn Tracker] Logged ${type} to ${person.name}`);
}

function attachListeners() {
  // 1. Connection without note
  const sendWithoutNoteBtn = document.querySelector('[aria-label="Send without a note"]');
  if (sendWithoutNoteBtn && !sendWithoutNoteBtn.hasAttribute('data-tracker-bound')) {
    sendWithoutNoteBtn.setAttribute('data-tracker-bound', 'true');
    sendWithoutNoteBtn.addEventListener('click', () => {
      logOutreach("Connection");
    });
  }

  // 2. Connection with note
  const sendInvitationBtn = document.querySelector('[aria-label="Send invitation"]');
  if (sendInvitationBtn && !sendInvitationBtn.hasAttribute('data-tracker-bound')) {
    const textarea = document.querySelector('#custom-message');
    sendInvitationBtn.setAttribute('data-tracker-bound', 'true');
    sendInvitationBtn.addEventListener('click', () => {
      if (textarea && textarea.value.trim().length > 0) {
        logOutreach("Connection+Note", textarea.value.trim());
      } else {
        logOutreach("Connection");
      }
    });
  }

  // 3. InMail Sent
  const sendInMailBtn = document.querySelector('.js-msg-form__send-btn');
  if (sendInMailBtn && !sendInMailBtn.hasAttribute('data-tracker-bound')) {
    sendInMailBtn.setAttribute('data-tracker-bound', 'true');
    sendInMailBtn.addEventListener('click', () => {
      logOutreach("InMail");
    });
  }

  // 4. Message Sent
  const sendMsgBtn = document.querySelector('.msg-form__send-button');
  if (sendMsgBtn && !sendMsgBtn.hasAttribute('data-tracker-bound')) {
    sendMsgBtn.setAttribute('data-tracker-bound', 'true');
    sendMsgBtn.addEventListener('click', () => {
      logOutreach("Message");
    });
  }
  
  const msgTextarea = document.querySelector('.msg-form__contenteditable');
  if (msgTextarea && !msgTextarea.hasAttribute('data-tracker-bound')) {
    msgTextarea.setAttribute('data-tracker-bound', 'true');
    msgTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        logOutreach("Message");
      }
    });
  }
}

const observer = new MutationObserver(() => {
  attachListeners();
});
observer.observe(document.body, { childList: true, subtree: true });

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(attachListeners, 1000);
  }
}).observe(document, { subtree: true, childList: true });
