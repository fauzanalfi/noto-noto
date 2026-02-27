# Contributing / Panduan Kontribusi

## English

Thank you for your interest in contributing to this project.

### How to Contribute
- Report bugs through GitHub Issues.
- Suggest features through GitHub Issues.
- Submit fixes and improvements through Pull Requests.

### Development Setup
1. Fork this repository.
2. Clone your fork.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment file and configure Firebase:
   ```bash
   cp .env.example .env
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

### Branch Naming
Use clear branch names:
- `feat/short-description`
- `fix/short-description`
- `chore/short-description`
- `docs/short-description`

### Commit Message Style
Prefer Conventional Commits:
- `feat: add notebook rename action`
- `fix: prevent note list flicker`
- `docs: update setup instructions`

### Pull Request Guidelines
- Keep PRs focused and small when possible.
- Explain the problem and the solution clearly.
- Link related issue(s) using `Closes #123`.
- Add screenshots for UI changes.
- Ensure tests pass before requesting review.

### Testing
Run tests locally:
```bash
npm run test:run
```

### Code Style
- Follow existing project structure and naming.
- Keep functions/components readable and focused.
- Avoid unrelated refactors in the same PR.

---

## Bahasa Indonesia

Terima kasih atas minat Anda untuk berkontribusi pada proyek ini.

### Cara Berkontribusi
- Laporkan bug melalui GitHub Issues.
- Usulkan fitur melalui GitHub Issues.
- Kirim perbaikan dan peningkatan melalui Pull Request.

### Setup Pengembangan
1. Fork repositori ini.
2. Clone hasil fork Anda.
3. Install dependensi:
   ```bash
   npm install
   ```
4. Salin file environment dan konfigurasi Firebase:
   ```bash
   cp .env.example .env
   ```
5. Jalankan server development:
   ```bash
   npm run dev
   ```

### Penamaan Branch
Gunakan nama branch yang jelas:
- `feat/deskripsi-singkat`
- `fix/deskripsi-singkat`
- `chore/deskripsi-singkat`
- `docs/deskripsi-singkat`

### Format Pesan Commit
Disarankan menggunakan Conventional Commits:
- `feat: add notebook rename action`
- `fix: prevent note list flicker`
- `docs: update setup instructions`

### Panduan Pull Request
- Upayakan PR tetap fokus dan kecil.
- Jelaskan masalah dan solusi dengan jelas.
- Tautkan issue terkait dengan `Closes #123`.
- Tambahkan screenshot untuk perubahan UI.
- Pastikan test lolos sebelum meminta review.

### Pengujian
Jalankan test di lokal:
```bash
npm run test:run
```

### Gaya Kode
- Ikuti struktur proyek dan penamaan yang sudah ada.
- Jaga fungsi/komponen agar tetap mudah dibaca dan fokus.
- Hindari refactor yang tidak terkait dalam PR yang sama.

---

By contributing, you agree to follow this repository's Code of Conduct.

Dengan berkontribusi, Anda setuju untuk mengikuti Kode Etik pada repositori ini.
