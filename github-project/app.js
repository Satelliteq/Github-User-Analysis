// app.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const token = "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";
const GITHUB_API_URL = 'https://api.github.com';


// Statik dosyalar için "public" klasörünü ayarla
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa rotası
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// GitHub API'den en çok yıldız alan repoları getirme
app.get('/api/repositories', async (req, res) => {
    try {
        const response = await axios.get('https://api.github.com/search/repositories?q=stars:>50000&sort=stars', {
            headers: { 
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error(error);
        res.status(500).send('GitHub API’den veri alınamadı.');
    }
});


// GitHub API'den en çok takip edilen kullancıları getirme
app.get('/api/users', async (req, res) => {
    try {
        const response = await axios.get('https://api.github.com/search/users?q=followers:>5000&sort=followers', {
            headers: { 
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error(error);
        res.status(500).send('GitHub API’den veri alınamadı.');
    }
});



// GitHub kullanıcı verilerini almak
app.get('/github/user/:username', async (req, res) => {
    const username = req.params.username;
    
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, {
            headers: { 
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
            }
        });

        res.json(response.data); // Kullanıcı verisini gönder
    } catch (error) {
        console.error(error);
        res.status(500).send('Veri alınırken bir hata oluştu.');
    }
});

  
  // Ana sayfaya yönlendirme
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  // Kullanıcı analizi sayfası
  app.get('/user-analysis', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user-analysis.html'));
  });

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
