// Demo data
let cards = [
  {
    logo: "PulsePay",
    type: "Debit",
    number: "**** 1234",
    balance: 120.00,
    color: "linear-gradient(120deg, #2d6cdf 60%, #4a90e2 100%)"
  },
  {
    logo: "PulsePay",
    type: "Credit",
    number: "**** 5678",
    balance: 380.00,
    color: "linear-gradient(120deg, #2ecc71 60%, #27ae60 100%)"
  }
];
let nfcOnline = true;
let transactions = [
  { merchant: "Supermarket", amount: 32.80, date: "2025-06-14" },
  { merchant: "Bookstore", amount: 12.99, date: "2025-06-13" }
];
let rewards = [
  { name: "Coffee Bonus", points: 120 },
  { name: "Travel Cashback", points: 80 }
];
let settings = {
  notifications: true,
  nfc: true
};
const demoMerchant = "Coffee Shop";
const demoAmount = 4.50;

// Navigation logic
const pages = {
  wallet: renderWallet,
  transactions: renderTransactions,
  rewards: renderRewards,
  settings: renderSettings
};
let currentPage = "wallet";

function setPage(page) {
  if (!pages[page]) return;
  currentPage = page;
  document.getElementById('page-title').textContent = capitalize(page);
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  pages[page]();
}

// Page renders
function renderWallet() {
  let html = `
    <div class="status-row">
      <div class="status">NFC: <span id="nfc-status" class="${nfcOnline ? 'online':'offline'}">${nfcOnline ? 'Online':'Offline'}</span></div>
    </div>
    <div class="card-stack">
      ${cards.map(card => `
        <div class="card" style="background: ${card.color}">
          <div class="card-logo">${card.logo}</div>
          <div class="card-details">
            <span class="card-type">${card.type} ${card.number}</span>
            <span class="card-balance">$${card.balance.toFixed(2)}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('main-content').innerHTML = html;
}

function renderTransactions() {
  let html = `
    <h2>Recent Transactions</h2>
    <ul id="transactions">
      ${transactions.slice().reverse().map(tx => `
        <li>
          <span>${tx.merchant} <small style="color:#888;">${tx.date}</small></span>
          <span>-$${tx.amount.toFixed(2)}</span>
        </li>
      `).join('')}
    </ul>
  `;
  document.getElementById('main-content').innerHTML = html;
}

function renderRewards() {
  let html = `
    <h2>Rewards</h2>
    <ul class="rewards-list">
      ${rewards.map(rw => `
        <li>
          <span>${rw.name}</span>
          <span>${rw.points} pts</span>
        </li>
      `).join('')}
    </ul>
  `;
  document.getElementById('main-content').innerHTML = html;
}

function renderSettings() {
  let html = `
    <h2>Settings</h2>
    <div>
      <label>
        <input type="checkbox" id="notif-toggle" ${settings.notifications ? 'checked' : ''}>
        Notifications
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" id="nfc-toggle" ${settings.nfc ? 'checked' : ''}>
        NFC Enabled
      </label>
    </div>
  `;
  document.getElementById('main-content').innerHTML = html;
  document.getElementById('notif-toggle').addEventListener('change', e => {
    settings.notifications = e.target.checked;
  });
  document.getElementById('nfc-toggle').addEventListener('change', e => {
    settings.nfc = e.target.checked;
    nfcOnline = settings.nfc;
    if (currentPage === "wallet") renderWallet();
  });
}

// Navigation events
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => setPage(btn.dataset.page));
});

// Simulate NFC Tap
document.getElementById('simulate-nfc').addEventListener('click', () => {
  if (!nfcOnline) {
    alert("NFC is offline!");
    return;
  }
  document.getElementById('merchant').textContent = demoMerchant;
  document.getElementById('amount').textContent = `$${demoAmount.toFixed(2)}`;
  document.getElementById('nfc-popup').classList.remove('hidden');
});

// Confirm or Cancel NFC Popup
document.getElementById('confirm-btn').addEventListener('click', () => {
  cards[0].balance -= demoAmount;
  transactions.push({
    merchant: demoMerchant,
    amount: demoAmount,
    date: new Date().toISOString().slice(0, 10)
  });
  setPage(currentPage);
  document.getElementById('nfc-popup').classList.add('hidden');
});

document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementById('nfc-popup').classList.add('hidden');
});

// Helpers
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initial UI
setPage("wallet");
