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

  renderList(data);
}

// Store all data globally for filtering
let allData = [];


function fuzzySearch(query, text) {
  query = query.toLowerCase();
  text = text.toLowerCase();
  

  if (text.includes(query)) {
    return { match: true, score: 100 };
  }
  
  // Fuzzy matching - check if all characters appear in order
  let queryIndex = 0;
  let matchedIndices = [];
  
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      matchedIndices.push(i);
      queryIndex++;
    }
  }
  
  if (queryIndex === query.length) {
    // Calculate score based on how close together the matches are
    let score = 50;
    if (matchedIndices.length > 1) {
      const avgDistance = matchedIndices[matchedIndices.length - 1] / matchedIndices.length;
      score = Math.max(10, 50 - avgDistance);
    }
    return { match: true, score: score };
  }
  
  return { match: false, score: 0 };
}

// Highlight matched characters
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

// Filter and render based on search
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
  if (showing === total) {
    stats.textContent = `Showing all ${total} products`;
  } else {
    stats.textContent = `Showing ${showing} of ${total} products`;
  }
}


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
  filterData(e.target.value);
});


function loadSampleData() {
  const sampleData = [ /* your data */ ];
  allData = sampleData; // IMPORTANT: Store globally
  renderList(sampleData);
  updateSearchStats(sampleData.length, sampleData.length);
}

function renderList(data) {
  const list = document.getElementById("list");

  data.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "item";

    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = `${item.product} <span>▼</span>`;

    const drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.innerHTML = `
      <div class="metadata">
            <div class="metadata-item">
              <span class="metadata-label">SHA1:</span>
              <span class="metadata-value">${item.sha1}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Description</div>
            <div class="section-content">No description available</div>
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
              <div class="alternative-item">
                <div class="alternative-name">Alternative 1</div>
                <div class="alternative-rationale">No alternatives identified yet</div>
              </div>
              <div class="alternative-item">
                <div class="alternative-name">Alternative 2</div>
                <div class="alternative-rationale">No alternatives identified yet</div>
              </div>
            </div>
          </div>
    `;

    title.addEventListener("click", () => {
      const open = drawer.style.display === "block";
      drawer.style.display = open ? "none" : "block";
      title.querySelector("span").textContent = open ? "▼" : "▲";
    });

    container.appendChild(title);
    container.appendChild(drawer);
    list.appendChild(container);
  });
}


loadCSV();
