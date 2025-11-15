/*async function loadCSV() {
  
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
}*/
function loadSampleData() {
      const sampleData = [
        {
          company: "Microsoft Corporation",
          product: "Microsoft Office 365",
          sha1: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
        },
        {
          company: "Adobe Inc.",
          product: "Adobe Acrobat Reader",
          sha1: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1"
        },
        {
          company: "Google LLC",
          product: "Google Chrome Browser",
          sha1: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2"
        },
        {
          company: "Slack Technologies",
          product: "Slack Desktop",
          sha1: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3"
        },
        {
          company: "Zoom Video Communications",
          product: "Zoom Client",
          sha1: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4"
        }
      ];

      renderList(sampleData);
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
