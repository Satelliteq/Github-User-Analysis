// app.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const token = "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";

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

// GitHub API'den bir repo için dil verilerini alma
app.get('/api/repositories/:owner/:repo/languages', async (req, res) => {
    const { owner, repo } = req.params;
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Dil verileri alınamadı.');
    }
});

 

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
