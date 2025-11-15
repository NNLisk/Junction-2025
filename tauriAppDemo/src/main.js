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
      <div><strong>Vendor:</strong> ${item.company}</div>
      <div><strong>SHA1:</strong> ${item.sha1}</div>
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
