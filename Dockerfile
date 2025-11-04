# 1. Gunakan base image Node.js (sesuai package.json Anda)
FROM node:18-alpine

# 2. Tentukan folder kerja di dalam kontainer
WORKDIR /usr/src/app

# 3. Salin package.json dan package-lock.json
# Ini memanfaatkan cache Docker. 'npm install' hanya berjalan
# jika file-file ini berubah.
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Salin sisa kode aplikasi Anda
COPY . .

# 6. Port yang digunakan aplikasi Anda (dari file .env Anda)
EXPOSE 5000

# 7. Perintah untuk menjalankan aplikasi
# Kita gunakan 'start:dev' (nodemon) agar hot-reload berfungsi
# dengan volume mount di docker-compose
CMD [ "npm", "run", "start:dev" ]