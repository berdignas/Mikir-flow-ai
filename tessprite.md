# Skenario Pengujian Otomatis Mikir Flow AI (TestSprite E2E Spec)

## Target Application URL
`http://localhost:3000`

---

## 1. Test Suite: Authentication & User Role Simulation
- **TC-01: Switch Role to PM**
  - **Action**: Klik User Profile Dropdown di Navbar -> Pilih Role `Project Manager`.
  - **Expected**: Header menampilkan badge `Project Manager` (warna oranye), seluruh fitur edit diagram & approval aktif.
- **TC-02: Switch Role to Developer**
  - **Action**: Klik User Profile Dropdown di Navbar -> Pilih Role `Developer`.
  - **Expected**: Header menampilkan badge `Developer` (warna biru), fitur pengubahan status task di `/task` aktif.
- **TC-03: Switch Role to Klien**
  - **Action**: Klik User Profile Dropdown di Navbar -> Pilih Role `Klien (PT Javas)`.
  - **Expected**: Header menampilkan badge `Klien` (warna hijau), fitur edit diagram terkunci (read-only), tab `Feedback` aktif untuk memberi masukan.

---

## 2. Test Suite: PRD & Flow Diagram Canvas (`/` & `/prd`)
- **TC-04: PRD Document Viewer**
  - **Action**: Navigasi ke `/prd`.
  - **Expected**: Dokumen PRD PT Javas berhasil dimuat dengan visualisasi clean & professional.
- **TC-05: Node Selection & Specs Edit**
  - **Action**: Klik Node `Autentikasi User` di canvas -> Isi `User Story` di Right Drawer -> Klik `Simpan Perubahan Sementara`.
  - **Expected**: Toast / notifikasi draf perubahan berhasil disimpan.

---

## 3. Test Suite: Team Collaboration & Feedback (`Feedback Tab`)
- **TC-06: Add Client Feedback**
  - **Action**: Login sebagai Klien -> Buka Right Drawer Modul -> Pilih Tab `Feedback` -> Ketik masukan -> Klik `Kirim Feedback`.
  - **Expected**: Feedback muncul secara real-time di riwayat masukan.

---

## 4. Test Suite: Module Approval & Kanban Task Distribution (`/task`)
- **TC-07: Approve Module**
  - **Action**: Login sebagai PM -> Pilih Modul -> Klik `Setujui Modul & Lempar ke Task`.
  - **Expected**: Status modul berubah menjadi `Selesai` dan tugas terlempar ke halaman `/task`.
- **TC-08: Developer Job Distribution (Assign Developer)**
  - **Action**: Navigasi ke `/task` -> Klik `+ Assign Dev` pada kartu task -> Pilih `Dev Team Lead`.
  - **Expected**: Avatar lingkaran & nama `Dev Team Lead` muncul di bagian bawah kartu task.
- **TC-09: Drag & Drop Progress Movement**
  - **Action**: Geser (drag & drop) kartu task dari kolom `Started` ke kolom `On Going` / `Completed`.
  - **Expected**: Kartu berpindah kolom, indikator progress bar berubah menjadi `60%` atau `100%`.
