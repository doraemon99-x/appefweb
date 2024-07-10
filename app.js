const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const url = 'https://aio.mrwixxsid.com/wp-json/aio-dl/video-data/';
const token = '60071662612d30d0d16459628e2c133ca4388b9f2308bb83ff240f8732255ace';

// Fungsi untuk mendapatkan hash dari URL
function getHashFromUrl(url) {
    return Buffer.from(url, 'utf-8').toString('base64');
}

// Route untuk menangani permintaan download video
app.post('/download', async (req, res) => {
    const { videoUrl } = req.body;
    const hash = getHashFromUrl(videoUrl);

    const formData = new FormData();
    formData.append('url', videoUrl);
    formData.append('token', token);
    formData.append('hash', hash);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });

        const medias = response.data.medias;
        const hdMedia = medias.find(media => media.quality === 'hd');

        if (hdMedia) {
            const videoDownloadUrl = hdMedia.url;
            res.send({ videoUrl: videoDownloadUrl });
        } else {
            res.status(404).send('Video dengan kualitas HD tidak ditemukan.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat mengunduh video.');
    }
});

// Route untuk menyajikan halaman HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
});
