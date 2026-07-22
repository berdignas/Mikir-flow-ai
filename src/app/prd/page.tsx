'use client';

import { useState, useEffect } from 'react';
import { useFlowContext } from '@/context/FlowContext';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  Sparkles, 
  Eye, 
  Copy, 
  Check, 
  Globe, 
  Clock, 
  Heart,
  FileCode,
  X
} from 'lucide-react';

const MASTER_PRD_CONVERTER_PROMPT = `[ROLE & GOAL]
Kamu adalah Senior Technical Product Manager dan Lead System Architect di MikirFlow AI. 
Tugas utamamu adalah mendistilasi & mengonversi dokumen/kebutuhan mentah dari Klien menjadi Product Requirements Document (PRD) berstruktur standar MikirFlow AI.

[RAW CLIENT INPUT / REQUIREMENTS]
Silakan baca dokumen/catatan kebutuhan dari Klien di bawah ini:
=== DOKUMEN KLIEN MULA ===
{{PASTE_TEKS_PRD_ATAU_KEBUTUHAN_KLIEN_DI_SINI}}
=== DOKUMEN KLIEN SELESAI ===

[ATURAN PENGONVERSIAN]
1. Identifikasi Nama Sistem Utama dan jadikan sebagai '# ROOT NODE: [Nama Sistem]'.
2. Kelompokkan kebutuhan klien ke dalam minimal 3 hingga 5 Modul Utama ('## FEATURE: [Nama Modul] (Badge: FASE 1)').
3. Di dalam setiap Modul Utama, uraikan 2 hingga 4 Sub-Fitur teknis ('### SUB-FEATURE: [Nama Sub-Fitur]').
4. Untuk setiap Sub-Feature, tuliskan:
   - User Story (Format: "Sebagai [pengguna], saya ingin [tindakan] agar [manfaat].")
   - Acceptance Criteria (Kriteria penerimaan 1, 2, 3)
   - Developer Tasks (Tugas Frontend, Backend, QA)

[FORMAT OUTPUT WAJIB]
Hasilkan output persis mengikuti struktur Markdown di bawah ini tanpa teks pembuka atau penutup lain:

# ROOT NODE: [Nama Aplikasi / Sistem Utama]
**Tujuan Utama:** [Ringkasan value proposition aplikasi 1-2 kalimat]

## FEATURE: [Nama Modul Utama 1] (Badge: FASE 1)
**Deskripsi Modul:** [Penjelasan modul singkat]

### SUB-FEATURE: [Nama Sub-Fitur 1.1]
- **User Story:** Sebagai [aktor], saya ingin [aksi] agar [hasil].
- **Acceptance Criteria:**
  1. [Kriteria 1]
  2. [Kriteria 2]
- **Developer Tasks:**
  - *Frontend:* [UI Component / Page]
  - *Backend:* [API Endpoint / DB Logic]
  - *QA:* [Skenario Pengujian]

### SUB-FEATURE: [Nama Sub-Fitur 1.2]
- **User Story:** [User Story]
- **Acceptance Criteria:**
  1. [Kriteria 1]
- **Developer Tasks:**
  - *Frontend:* [Task]
  - *Backend:* [Task]

## FEATURE: [Nama Modul Utama 2] (Badge: FASE 1)
**Deskripsi Modul:** [Penjelasan modul]

### SUB-FEATURE: [Nama Sub-Fitur 2.1]
- **User Story:** [User Story]
- **Acceptance Criteria:**
  1. [Kriteria 1]
- **Developer Tasks:**
  - *Frontend:* [Task]
  - *Backend:* [Task]`;

const sampleParsedPRD = `# ROOT NODE: E-Commerce Marketplace Platform
**Tujuan Utama:** Platform transaksi jual-beli online terintegrasi dengan sistem pembayaran otomatis dan manajemen pengiriman paket.

## FEATURE: Manajemen Akun & Autentikasi (Badge: FASE 1)
**Deskripsi Modul:** Modul autentikasi pengguna multi-role untuk pembeli dan penjual.

### SUB-FEATURE: Login & Register Multi-Role
- **User Story:** Sebagai pengguna, saya ingin login dengan email & OTP WhatsApp agar akun saya aman.
- **Acceptance Criteria:**
  1. Verifikasi OTP dikirim melalui WhatsApp API.
  2. Session token disimpan dengan aman di local storage.
- **Developer Tasks:**
  - *Frontend:* Form UI Login & OTP Modal
  - *Backend:* API Authentication JWT & WA Gateway integration

### SUB-FEATURE: Manajer Alamat Pengiriman
- **User Story:** Sebagai pembeli, saya ingin menyimpan beberapa alamat pengiriman agar memudahkan checkout.
- **Acceptance Criteria:**
  1. Integrasi API RajaOngkir untuk autocompletion kota & kecamatan.

## FEATURE: Katalog & Keranjang Belanja (Badge: FASE 1)
**Deskripsi Modul:** Modul pencarian produk dan manajemen keranjang belanja pembeli.

### SUB-FEATURE: Filter Kategori & Pencarian Cepat
- **User Story:** Sebagai pembeli, saya ingin memfilter produk berdasarkan kategori dan harga agar cepat menemukan produk.
- **Acceptance Criteria:**
  1. Real-time search filter dengan latency di bawah 300ms.

### SUB-FEATURE: Keranjang Belanja Interaktif
- **User Story:** Sebagai pembeli, saya ingin menambahkan produk ke keranjang dan mengubah kuantitas barang.
- **Acceptance Criteria:**
  1. Perhitungan subtotal produk terupdate secara otomatis.

## FEATURE: Payment & Order Processing (Badge: FASE 1)
**Deskripsi Modul:** Modul transaksi pembayaran online dan pembuatan pesanan.

### SUB-FEATURE: Integrasi Payment Gateway (QRIS & VA)
- **User Story:** Sebagai pembeli, saya ingin membayar via QRIS atau Virtual Account agar transaksi instan.
- **Acceptance Criteria:**
  1. Notifikasi webhook callback mengubah status pembayaran otomatis menjadi Selesai.`;

export default function PRDPage() {
  const { loadNodesFromPRD, activeProject, updateActiveProjectPRD } = useFlowContext();
  const { currentUser } = useAuthContext();
  const router = useRouter();

  const [prdContent, setPrdContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [language, setLanguage] = useState('Bahasa Indonesia');
  const [isOpenLangMenu, setIsOpenLangMenu] = useState(false);

  const isClient = currentUser?.role === 'client';

  // Automatically update local PRD content state whenever active project changes
  useEffect(() => {
    if (activeProject && activeProject.prd_text !== undefined) {
      setPrdContent(activeProject.prd_text);
    }
  }, [activeProject]);

  const handleTextChange = (text: string) => {
    setPrdContent(text);
    updateActiveProjectPRD(text);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(MASTER_PRD_CONVERTER_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleGenerate = () => {
    const textToLoad = prdContent.trim() || sampleParsedPRD;
    setIsGenerating(true);
    
    setTimeout(() => {
      loadNodesFromPRD(textToLoad);
      setIsGenerating(false);
      router.push('/');
    }, 500);
  };

  return (
    <div 
      className="h-full w-full flex flex-col justify-between p-6 sm:p-10 overflow-y-auto font-sans select-none"
      style={{
        backgroundColor: '#F5F5F5',
        backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      
      {/* Upper Content Wrapper */}
      <div className="max-w-3xl w-full mx-auto space-y-8 my-auto">
        
        {/* Read Only Alert for Client */}
        {isClient && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm shadow-2xs">
            <Eye className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Anda login sebagai <strong>Client</strong> (Read-Only). Anda dapat membaca PRD ini. Pembuatan PRD dilakukan oleh Project Manager.
            </span>
          </div>
        )}

        {/* Hero Title Section with Mikir flow ai Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <Logo size="large" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
            Mau mikir flow apa?
          </h1>

          <div className="inline-block bg-orange-100/70 border border-orange-200 px-3 py-1 rounded-full">
            <p className="text-xs font-bold text-[#EA580C]">
              Proyek Aktif: {activeProject ? `${activeProject.title} (${activeProject.client_name})` : 'E-Commerce Marketplace'}
            </p>
          </div>

          <p className="text-[#6B7280] text-sm sm:text-base font-normal max-w-lg mx-auto flex flex-wrap items-center justify-center gap-2">
            <span>Ubah ide atau requirement proyek kamu menjadi peta alur arsitektur Node secara otomatis.</span>
          </p>

          {/* Prompt AI Converter Quick Action Bar */}
          {!isClient && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 bg-[#FFEDD5] text-[#EA580C] hover:bg-orange-200 border border-orange-200 text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Prompt Konverter AI Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Prompt AI Konverter PRD Klien 🤖</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="inline-flex items-center gap-1.5 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs"
              >
                <FileCode className="w-4 h-4 text-gray-500" />
                <span>Lihat Panduan Konverter PRD</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Central Card Form adhering strictly to design.md */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 space-y-4 relative">
          <textarea
            disabled={isClient}
            value={prdContent}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={7}
            className="w-full text-sm sm:text-base text-[#0A0A0A] placeholder-[#6B7280] border-none outline-none resize-none bg-transparent font-mono leading-relaxed"
            placeholder='Ketik atau tempelkan PRD requirement Anda di sini... (Contoh: "Aplikasi e-commerce marketplace dengan fitur login multi-role, katalog produk, dan payment gateway QRIS...")'
          />

          {/* Card Footer Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
            {/* Language Selector Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpenLangMenu(!isOpenLangMenu)}
                className="flex items-center gap-1.5 bg-[#F5F5F5] hover:bg-white border border-[#E5E7EB] hover:border-[#FF6B4D]/40 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#0A0A0A] transition-all cursor-pointer shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>{language}</span>
                <span className="text-[#6B7280] text-[9px] ml-0.5">▼</span>
              </button>

              {isOpenLangMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-44 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {['Bahasa Indonesia', 'English'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setIsOpenLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                        language === lang ? 'bg-orange-50 text-[#FF6B4D] font-bold' : 'hover:bg-gray-50 text-[#0A0A0A]'
                      }`}
                    >
                      <span>{lang}</span>
                      {language === lang && <Check className="w-3.5 h-3.5 text-[#FF6B4D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Submit Button */}
            {!isClient && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center justify-center gap-2 bg-[#FF6B4D] hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>{isGenerating ? 'Memuat Flow...' : 'Buat Flow Diagram'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-action link below card */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => handleTextChange(sampleParsedPRD)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#0A0A0A] transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Muat Sampel Format PRD</span>
          </button>
        </div>

      </div>

      {/* Template Converter Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF6B4D]" /> Panduan Konverter PRD Klien ke MikirFlow AI
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Gunakan Prompt AI ini di ChatGPT / Gemini / Claude untuk mengonversi requirement mentah klien.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-700">Langkah Penggunaan:</p>
              <ol className="text-xs text-gray-600 space-y-1.5 list-decimal pl-4">
                <li>Klik tombol **Salin Prompt AI** di bawah.</li>
                <li>Buka ChatGPT / Claude / Gemini Anda.</li>
                <li>Tempelkan prompt ini dan ganti bagian <code className="bg-gray-100 px-1 py-0.5 rounded text-orange-600 font-bold">{`{{PASTE_TEKS_PRD_ATAU_KEBUTUHAN_KLIEN_DI_SINI}}`}</code> dengan catatan/PRD dari Klien.</li>
                <li>Salin teks Markdown hasil konversi AI lalu tempelkan ke kolom form PRD MikirFlow AI ini.</li>
              </ol>

              <div className="bg-gray-900 text-gray-100 rounded-2xl p-4 text-xs font-mono max-h-60 overflow-y-auto whitespace-pre-wrap border border-gray-800 leading-relaxed">
                {MASTER_PRD_CONVERTER_PROMPT}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-5 py-2.5 bg-[#FF6B4D] hover:bg-[#e65a3d] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt AI Sekarang'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Footer (Berdikari Digital Nusantara) */}
      <footer className="pt-8 pb-2 border-t border-[#E5E7EB] mt-auto text-center space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse inline" /> by <strong className="text-[#0A0A0A] font-semibold">Berdikari Digital Nusantara</strong>
          </span>

          <span className="hidden sm:inline text-gray-300">•</span>

          {/* Social Media Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-red-50 border border-[#E5E7EB] text-[#0A0A0A] hover:text-red-600 text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YouTube</span>
            </a>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 border border-[#E5E7EB] text-[#0A0A0A] hover:text-indigo-600 text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-indigo-500" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              <span>Discord</span>
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 border border-[#E5E7EB] text-[#0A0A0A] hover:text-black text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-[#0A0A0A]" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-pink-50 border border-[#E5E7EB] text-[#0A0A0A] hover:text-pink-600 text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-pink-500" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
