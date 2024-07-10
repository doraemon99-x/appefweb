# Menggunakan image Node.js versi LTS sebagai base image
FROM node:lts-alpine

# Membuat direktori app di dalam container
WORKDIR /usr/src/app

# Menyalin package.json dan package-lock.json untuk instalasi dependensi
COPY package*.json ./

# Menginstal dependensi menggunakan npm
RUN npm install

# Menyalin seluruh kode sumber aplikasi ke dalam direktori app di dalam container
COPY . .

# Menjalankan aplikasi Node.js
CMD ["node", "app.js"]
