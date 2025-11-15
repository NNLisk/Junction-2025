/*
const { invoke } = window.__TAURI__.tauri;

let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
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
*/

// Store all data globally for filtering

/*const { invoke } = window.__TAURI__.tauri;
let allData = [];

async function fetchNewData(sw_name, productName) {
  try {
    console.log(`Fetching alternative ${sw_name} for ${productName}...`);
    
    
    const result = await invoke('request_software_info', {
      sw_name: productName,
      url: alternativeNumber//add function if theres url
    });
    
    console.log('Received data:', result);
     const db_csv = await invoke('load_all', {
      
    });
    alert(`Received: ${JSON.stringify(result)}`);
    
  } catch (error) {
    console.error('Error fetching alternative:', error);
    alert(`Error: ${error}`);
  }
}*/

async function loadCSV() {
  const response = await fetch("/assets/WithSecure_sample_data.csv");
  const text = await response.text();

  const rows = text.trim().split(/\n+/);

  const data = rows.slice(1).map(line => {
    const parts = line.match(/\".*?\"|[^,]+/g).map(v => v.replace(/^\"|\"$/g, ""));
    return {
      company: parts[0],
      product: parts[1],
      sha1: parts[2]
    };
  });

  allData = data; // FIX 1: Store data globally
  renderList(data);
  updateSearchStats(data.length, data.length); // FIX 2: Initialize stats
}

function fuzzySearch(query, text) {
  query = query.toLowerCase();
  text = text.toLowerCase();
  
  if (text.includes(query)) {
    return { match: true, score: 100 };
  }
  
  let queryIndex = 0;
  let matchedIndices = [];
  
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      matchedIndices.push(i);
      queryIndex++;
    }
  }
  
  if (queryIndex === query.length) {
    let score = 50;
    if (matchedIndices.length > 1) {
      const avgDistance = matchedIndices[matchedIndices.length - 1] / matchedIndices.length;
      score = Math.max(10, 50 - avgDistance);
    }
    return { match: true, score: score };
  }
  
  return { match: false, score: 0 };
}

function highlightMatch(text, query) {
  if (!query) return text;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  const index = lowerText.indexOf(lowerQuery);
  if (index !== -1) {
    return text.substring(0, index) + 
           '<span class="highlight">' + 
           text.substring(index, index + query.length) + 
           '</span>' + 
           text.substring(index + query.length);
  }
  
  return text;
}

function filterData(query) {
  if (!query.trim()) {
    renderList(allData);
    updateSearchStats(allData.length, allData.length);
    return;
  }

  const results = allData
    .map(item => {
      const productMatch = fuzzySearch(query, item.product);
      const companyMatch = fuzzySearch(query, item.company);
      const bestMatch = productMatch.score > companyMatch.score ? productMatch : companyMatch;
      
      return {
        ...item,
        matchScore: bestMatch.score,
        matches: bestMatch.match
      };
    })
    .filter(item => item.matches)
    .sort((a, b) => b.matchScore - a.matchScore);

  renderList(results, query);
  updateSearchStats(results.length, allData.length);
}

function updateSearchStats(showing, total) {
  const stats = document.getElementById('searchStats');
  if (stats) { 
    if (showing === total) {
      stats.textContent = `Showing all ${total} products`;
    } else {
      stats.textContent = `Showing ${showing} of ${total} products`;
    }
  }
}


function renderList(data, query = '') {
  const list = document.getElementById("list");
  list.innerHTML = ''; 

  
  if (data.length === 0) {
   list.innerHTML = `
    <div class="no-results">
      <div style="margin-bottom: 20px;">No products found matching your search.</div>
      <button class="fetch-button" onclick="fetchNewData()">Fetch Software</button>
    </div>
  `;    return;
  }

  data.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "item";

    const title = document.createElement("div");
    title.className = "title";
    
    title.innerHTML = `
       <div class="title-content">
    <div class="product-name">${highlightMatch(item.product, query)}</div>
      <div class="vendor-name">${highlightMatch(item.company, query)}</div>
      <div style="font-size: 12px; color: #95a5a6; margin-top: 2px;">${item.sha1}</div>
  
  </div>
      <span class="arrow">▼</span>
    `;

    const drawer = document.createElement("div");
    drawer.className = "drawer";
    const hasAlternatives = item.alternatives && item.alternatives.length > 0;
    drawer.innerHTML = `
      <div class="metadata"> 

        <div class="section">
        <div class="section-title">Description</div>
        <div class="section-content">No description available</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Usage</div>
        <div class="section-content">No usage information available</div>
      </div>

      <div class="section">
        <div class="section-title">Vendor Reputation</div>
        <div class="section-content">No reputation data available</div>
      </div>

      <div class="section">
        <div class="section-title">CVE Trend Summary</div>
        <div class="section-content">No CVE data available</div>
      </div>

      <div class="section">
        <div class="section-title">Incidents/Abuse Signals</div>
        <div class="section-content">No incident data available</div>
      </div>

      <div class="section">
        <div class="section-title">Data Handling/Compliance</div>
        <div class="section-content">No compliance information available</div>
      </div>

      <div class="section">
        <div class="section-title">Deployment/Admin Controls</div>
        <div class="section-content">No deployment information available</div>
      </div>

      <div class="section">
        <div class="section-title">Trust/Risk Score</div>
        <div class="trust-score">
          <div class="score-bar">
            <div class="score-fill" style="width: 0%"></div>
          </div>
          <div class="score-value">--/100</div>
        </div>
        <div class="section-content" style="margin-top: 8px">No score calculated yet</div>
        <div class="metadata" style="margin-top: 8px">
          <div class="metadata-item">
            <span class="metadata-label">Confidence:</span>
            <span class="metadata-value">--</span>
          </div>
        </div>
      </div>

       <div class="section">
    <div class="section-title">Safer Alternatives</div>
    <div class="alternatives">
      ${hasAlternatives ? 
        item.alternatives.map((alt, idx) => `
          <div class="alternative-item">
            <div class="alternative-name">${alt.name}</div>
            <div class="alternative-rationale">${alt.rationale}</div>
            <button class="fetch-button" onclick="fetchNewData()(${idx + 1}, '${item.product}')">Fetch Software</button>
          </div>
        `).join('') 
        : 
        `
          <div class="alternative-item">
            <div class="alternative-name">Alternative 1</div>
            <div class="alternative-rationale">No alternatives identified yet</div>
          </div>
          <div class="alternative-item">
            <div class="alternative-name">Alternative 2</div>
            <div class="alternative-rationale">No alternatives identified yet</div>
          </div>
        `
      }
    </div>
  </div>
`;

    title.addEventListener("click", () => {
  const open = drawer.style.display === "block";
  drawer.style.display = open ? "none" : "block";
  title.querySelector("span.arrow").textContent = open ? "▼" : "▲";
  });

    container.appendChild(title);
    container.appendChild(drawer);
    list.appendChild(container);
  });
}


loadCSV();


const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    filterData(e.target.value);
  });
}

