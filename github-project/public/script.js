const repoTableBody = document.getElementById("repoTableBody");

// API’den veri çekme işlevi
async function fetchRepositories() {
    try {
        const response = await fetch('/api/repositories');
        const repositories = await response.json();
        populateTable(repositories);
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

// Gelen veriyi al ve tabloya ekle
function populateTable(repositories) {
    repoTableBody.innerHTML = ""; // Tabloda varsa eski veriyi temizle
    repositories.forEach(repo => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
            <td>${repo.description || "No description"}</td>
            <td>${repo.language || "Not specified"}</td>
            <td>${repo.stargazers_count}</td>
            <td><img src="${repo.owner.avatar_url}" alt="${repo.owner.login}'s avatar" class="avatar"> ${repo.owner.login}</td>
            <td><a href="${repo.html_url}/archive/refs/heads/main.zip" target="_blank">Download ZIP</a></td>
        `;
        
        repoTableBody.appendChild(row);
    });
}

// Sayfa yüklendiğinde verileri çek
fetchRepositories();

// 30 saniyede bir verileri güncelle
setInterval(fetchRepositories, 3000000);
