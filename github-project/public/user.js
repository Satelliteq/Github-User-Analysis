// Kullanıcı arama formu
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;

    // Tek bir kullanıcı verisini çek
    fetchUserData(username);
});

const userTableBody = document.getElementById("userTableBody");

// Sayfa yüklendiğinde verileri çek
fetchUsers();

// GitHub API'den tek bir kullanıcı verisini çekme
async function fetchUserData(username) {
    try {
        const response = await fetch(`/github/user/${username}`);
        const userData = await response.json();

        if (response.ok) {
            // Kullanıcı verilerini tek kullanıcı profiline ekleme
            displayUserProfile(userData);
        } else {
            // Hata mesajı
            document.getElementById('user-data').innerHTML = '<h2>Kullanıcı bulunamadı.</h2>';
        }
    } catch (error) {
        document.getElementById('user-data').innerHTML = '<h2>Veri alınırken bir hata oluştu.</h2>';
        console.error(error);
    }
}

// Tek bir kullanıcı profilini ekranda gösterme
function displayUserProfile(user) {
    const userDataDiv = document.getElementById('user-data');
    userDataDiv.innerHTML = `
        <div class="user-profile">
            <img src="${user.avatar_url}" alt="${user.login}'s avatar">
            <h2><strong>${user.name || 'Bilinmiyor'}</strong></h2>
            <h3>${user.login}</h3>
            <p>${user.bio || 'Bilinmiyor'}</p>
            <div class="user-follow-data">
                <p><strong>${user.followers}</strong> followers</p>
                <p><strong>${user.following}</strong> following</p>
            </div>
            <p><strong>Konum:</strong> ${user.location || 'Bilinmiyor'}</p>
            <p><strong>Hesap Oluşturulma Tarihi:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
            <p><strong>Hesap Linki:</strong> <a href="${user.html_url}" target="_blank">GitHub Profili</a></p>
        </div>    
    `;
}

// İlk olarak genel kullanıcı listesini çekme fonksiyonu
async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error(`Kullanıcı listesi alınırken hata oluştu: ${response.status}`);
        }
        const users = await response.json();

        // Çoklu kullanıcıları çekme
        const userDataPromises = users.map(user => fetchUserDataForTable(user.login));
        const detailedUserData = await Promise.all(userDataPromises);

        // Null olmayan (başarıyla alınan) verileri filtrele
        const validUserData = detailedUserData.filter(user => user !== null);
        
        // Çoklu kullanıcı verilerini tabloya yerleştirme
        displayUserTable(validUserData);
    } catch (error) {
        console.error("Kullanıcı verisi alınırken hata oluştu:", error);
    }
}

// Her kullanıcı için sadece tablodaki veriyi çekme
async function fetchUserDataForTable(username) {
    try {
        const response = await fetch(`/github/user/${username}`);
        const userData = await response.json();

        if (response.ok) {
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Hata oluştu:", error);
        return null;
    }
}

// Birden fazla kullanıcı verisini tablo halinde gösterme
function displayUserTable(userData) {
    const userTableBody = document.getElementById("userTableBody");
    
    // Tabloyu temizle
    userTableBody.innerHTML = '';
    
    // Kullanıcı verilerini tabloya ekle
    userData.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img class="avatar" src="${user.avatar_url}" alt="${user.login}'s avatar" width="50"></td>
            <td>${user.login}</td>
            <td>${user.bio || 'Bilinmiyor'}</td>
            <td>${user.followers}</td>
            <td>${user.following}</td>
            <td><a href="${user.html_url}" target="_blank">Profil</a></td>
        `;
        
        // Satırı tabloya ekle
        userTableBody.appendChild(row);
    });
}
