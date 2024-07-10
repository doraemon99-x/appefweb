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
const refererUrl = 'https://aio.mrwixxsid.com/facebook-video-downloader/';

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
            headers: {
                ...formData.getHeaders(),
                'Referer': refererUrl,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'Cookie': 'pll_language=en; ezoab_281878=mod115-c; ezosuibasgeneris-1=ea94f70e-00db-43d8-7286-0e0a7ed1de8a; ezds=ffid%3D1%2Cw%3D1366%2Ch%3D768; _ga=GA1.1.1483287654.1720601925; __qca=P0-553542074-1720601931334; ezux_ifep_281878=true; __eoi=ID=b2b858b22cf76ecf:T=1720602297:RT=1720602297:S=AA-AfjbSOkRwiaGQbu1u6eQUWYzd; FCNEC=%5B%5B%22AKsRol_hW19SdzRLNYHTPFYd_-LvqXjpmB8i2CZya9X4QhJk5zlb4EBGBszmtmIkoEWGv-I_8pxpGHP3f5ZC9tV1iTPSw3xyZvW3mGfSZMUpCsTkEfUefGDGm0fx9KqZbAbI56SKsBpNwDMTLugSTG2-ORyX7XnX4g%3D%3D%22%5D%5D; _ga_4TJBHHVJX3=GS1.1.1720602218.1.1.1720602241.0.0.0; ezux_lpl_281878=1720602243424|47ebc111-e2e2-496b-7a4f-4f5b51d79696|false; ezohw=w%3D771%2Ch%3D607; cf_clearance=d_qwIopRvBPhT1rFHKI_3GnAy7ijMg2nltlmFOuJAyU-1720607964-1.0.1.1-N_fxCYc7y46vV_KRgkqC2PMOCGvDjnTUM6rw_.Khcsj6H4Mbig8IvwuRGJgW5h5EvmWI8ZR6AgzSxaLQTIYleA; active_template::281878=pub_site.1720608220; ezovuuidtime_281878=1720608221; _ga_E01B3M2GB8=GS1.1.1720607888.3.1.1720608150.0.0.0; ezux_et_281878=482; ezux_tos_281878=8792'
            }
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
