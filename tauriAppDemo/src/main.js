const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;


async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});

const vendorData = [
  {
    id: 'v1',
    name: 'TechCorp Solutions',
    securityDetails: {
      compliance: 'ISO 27001, SOC 2 Type II',
      vulnerabilities: 'Low-Medium risk profile',
      lastAudit: '2024-10-01',
      patchPolicy: '30-day cycle for critical patches',
    },
  },
  {
    id: 'v2',
    name: 'Innovate Systems',
    securityDetails: {
      compliance: 'GDPR Compliant',
      vulnerabilities: 'High-risk vulnerability found in Q1 2025 (patched)',
      lastAudit: '2025-01-15',
      patchPolicy: '45-day cycle for all patches',
    },
  },
  {
    id: 'v3',
    name: 'Global Software Inc.',
    securityDetails: {
      compliance: 'NIST Framework',
      vulnerabilities: 'Clean profile',
      lastAudit: '2024-12-20',
      patchPolicy: 'Immediate rollout for critical; 60-day for others',
    },
  },
];

function createDrawerHtml(details) {
  return `
    <div class="security-drawer">
      <h3>Security Information</h3>
      <p><strong>Compliance:</strong> ${details.compliance}</p>
      <p><strong>Vulnerabilities:</strong> ${details.vulnerabilities}</p>
      <p><strong>Last Audit:</strong> ${details.lastAudit}</p>
      <p><strong>Patch Policy:</strong> ${details.patchPolicy}</p>
    </div>
  `;
}

function toggleDrawer(event) {
  const container = event.currentTarget.closest('.vendor-item-container');
  
  if (container) {
    container.classList.toggle('open');
    const drawer = container.querySelector('.security-drawer');
    
    if (drawer) {
      drawer.classList.toggle('active');
    }
    
    const icon = container.querySelector('.toggle-icon');
    if (icon) {
        icon.textContent = container.classList.contains('open') ? '▼' : '►';
    }
  }
}

function renderVendorList() {
  const container = document.getElementById('vendor-list-container');
  if (!container) return; 

  let htmlContent = '';
  
  vendorData.forEach(vendor => {
    const itemHtml = `
      <div class="vendor-item-container" id="${vendor.id}">
        <div class="vendor-header">
          <h2>${vendor.name}</h2>
          <span class="toggle-icon">►</span>
        </div>
        ${createDrawerHtml(vendor.securityDetails)}
      </div>
    `;
    htmlContent += itemHtml;
  });

  container.innerHTML = htmlContent;

  document.querySelectorAll('.vendor-header').forEach(header => {
    header.addEventListener('click', toggleDrawer);
  });
}
