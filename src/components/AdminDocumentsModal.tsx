import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  CheckSquare, 
  UserCheck, 
  UserPlus, 
  UserMinus, 
  Award, 
  Users, 
  Edit3, 
  School,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  Maximize2,
  Search,
  Check,
  Plus,
  Trash2,
  BookOpen,
  Mail
} from 'lucide-react';
import { Student, SchoolInfo } from '../types';
import { ROMBEL_LIST } from '../data/dapodikOptions';
import { formatNisn, isStudentMutasi, getStoredRombelList } from '../utils/storage';
import { INDONESIAN_MONTHS, getTodayIndonesianDate, generateLetterNumber } from '../utils/letterUtils';

export type DocType = 
  | 'absensi' 
  | 'aktif' 
  | 'mutasi_masuk' 
  | 'mutasi_keluar' 
  | 'pip' 
  | 'undangan_rapat'
  | 'berita_acara_rapat'
  | 'rapat_ortu'
  | 'daftar_nilai';

interface AdminDocumentsModalProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  initialDocType?: DocType;
  initialStudent?: Student | null;
  onClose: () => void;
  onMutasiKeluar?: (student: Student) => void;
}

export const AdminDocumentsModal: React.FC<AdminDocumentsModalProps> = ({
  students,
  schoolInfo,
  initialDocType = 'absensi',
  initialStudent = null,
  onClose,
  onMutasiKeluar,
}) => {
  const [activeTab, setActiveTab] = useState<DocType>(initialDocType);

  // Selection States
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent ? initialStudent.id : (students[0]?.id || '')
  );
  const [selectedRombel, setSelectedRombel] = useState<string>('1 A');
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');

  // Filtered Students for Picker dropdown
  const filteredStudentsForPicker = useMemo(() => {
    if (!studentSearchTerm.trim()) return students;
    const term = studentSearchTerm.toLowerCase();
    return students.filter(
      s =>
        s.namaSiswa.toLowerCase().includes(term) ||
        (s.nisn && s.nisn.toLowerCase().includes(term)) ||
        (s.nipd && s.nipd.toLowerCase().includes(term)) ||
        (s.rombel && s.rombel.toLowerCase().includes(term)) ||
        (s.nik && s.nik.toLowerCase().includes(term))
    );
  }, [students, studentSearchTerm]);

  // Auto-select first matching student when searching if currently selected student is not in search results
  useEffect(() => {
    if (filteredStudentsForPicker.length > 0) {
      const exists = filteredStudentsForPicker.some(s => s.id === selectedStudentId);
      if (!exists) {
        setSelectedStudentId(filteredStudentsForPicker[0].id);
      }
    }
  }, [filteredStudentsForPicker, selectedStudentId]);

  // Page Orientation, Margin & Scale State
  const [pageOrientation, setPageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [customMargin, setCustomMargin] = useState<number>(15);
  const [customScale, setCustomScale] = useState<number>(100);

  // Custom Logo States (Saved in localStorage)
  const [logoPemda, setLogoPemda] = useState<string | null>(() => {
    return localStorage.getItem('doc_logo_pemda') || null;
  });
  const [logoSekolah, setLogoSekolah] = useState<string | null>(() => {
    return localStorage.getItem('doc_logo_sekolah') || null;
  });

  // Automatically update default orientation based on tab selected
  useEffect(() => {
    if (activeTab === 'absensi' || activeTab === 'rapat_ortu' || activeTab === 'daftar_nilai') {
      setPageOrientation('landscape');
    } else {
      setPageOrientation('portrait');
    }
  }, [activeTab]);

  // Currently Selected Student Object
  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0] || null;
  }, [students, selectedStudentId]);

  // Letter & Document Customization Options
  const [nomorSurat, setNomorSurat] = useState<string>(generateLetterNumber());
  const [tanggalSurat, setTanggalSurat] = useState<string>('24 Juli 2026');

  // 1. Absensi Specific
  const [bulanAbsensi, setBulanAbsensi] = useState<string>('Juli');
  const [tahunAbsensi, setTahunAbsensi] = useState<string>('2026');
  const [absensiType, setAbsensiType] = useState<'presensi_31' | 'rekap_sia'>('presensi_31');

  // 2. Surat Aktif Specific
  const [keperluanAktif, setKeperluanAktif] = useState<string>(
    'Persyaratan Kelengkapan Administrasi Beasiswa / Pembuatan Rekening Bank Penyalur / Kartu Identitas Anak (KIA)'
  );

  // 3. Mutasi Masuk Specific (Surat Keterangan Penerimaan Mutasi)
  const [sekolahAsal, setSekolahAsal] = useState<string>('SD Negeri 1 Kayuambon');
  const [npsnSekolahAsal, setNpsnSekolahAsal] = useState<string>('20205515');
  const [alamatSekolahAsal, setAlamatSekolahAsal] = useState<string>(
    'Jl. Kenanga No. 42 Desa Kayuambon Kec. Lembang Kab. Bandung Barat Provinsi Jawa Barat'
  );
  const [diterimaDiKelas, setDiterimaDiKelas] = useState<string>('4 B');
  const [tahunPelajaranMasuk, setTahunPelajaranMasuk] = useState<string>('2026/2027');

  // 4. Mutasi Keluar Specific (Surat Keterangan Mutasi Sekolah)
  const [sekolahTujuan, setSekolahTujuan] = useState<string>(
    'SD Negeri 2 Langensari Kec. Lembang Kabupaten Bandung Barat Provinsi Jawa Barat'
  );
  const [alasanMutasiKeluar, setAlasanMutasiKeluar] = useState<string>('Mengikuti Orang Tua');
  const [namaOrtuPindah, setNamaOrtuPindah] = useState<string>('Tidak/Rp. 500,000 - Rp. 999,999');
  const [pekerjaanOrtuPindah, setPekerjaanOrtuPindah] = useState<string>('1970');

  // 5. PIP Specific (Surat Keterangan Kepala Sekolah untuk PIP)
  const [nomorRekeningPip, setNomorRekeningPip] = useState<string>("'201601034644506");
  const [akunVirtualPip, setAkunVirtualPip] = useState<string>('NG100120207938060005RS');
  const [tahapPencairanPip, setTahapPencairanPip] = useState<string>('1');

  // 6. Rapat Ortu Specific (Daftar Hadir)
  const [namaRapat, setNamaRapat] = useState<string>(
    'Rapat Sosialisasi Program Sekolah, Evaluasi Belajar, & Komite TA 2026/2027'
  );
  const [hariTanggalRapat, setHariTanggalRapat] = useState<string>('Sabtu, 25 Juli 2026');
  const [waktuTempatRapat, setWaktuTempatRapat] = useState<string>('08:30 WIB - Selesai @ Ruang Kelas SD Negeri Ciburial');

  // 7. Surat Undangan Rapat Specific
  const [jenisRapatUndangan, setJenisRapatUndangan] = useState<'ortu' | 'guru' | 'komite' | 'kustom'>('ortu');
  const [halSuratUndangan, setHalSuratUndangan] = useState<string>(
    'Undangan Rapat Sosialisasi Program Sekolah & Orang Tua / Wali Murid'
  );
  const [tujuanSuratUndangan, setTujuanSuratUndangan] = useState<string>(
    'Bapak/Ibu Orang Tua / Wali Murid'
  );
  const [pengantarUndangan, setPengantarUndangan] = useState<string>(
    'Sehubungan dengan dimulainya Tahun Ajaran Baru 2026/2027 serta sosialisasi program kerja sekolah dan tata tertib siswa, kami mengharapkan kehadiran Bapak/Ibu Orang Tua / Wali Murid pada:'
  );
  const [hariTanggalUndangan, setHariTanggalUndangan] = useState<string>('Sabtu, 25 Juli 2026');
  const [waktuUndangan, setWaktuUndangan] = useState<string>('08:00 WIB s.d. Selesai');
  const [tempatUndangan, setTempatUndangan] = useState<string>('Ruang Aula / Kelas SD Negeri Ciburial');
  const [agendaUndangan, setAgendaUndangan] = useState<string>(
    '1. Sosialisasi Program Kerja Sekolah & Kurikulum Operasional\n2. Pembahasan Tata Tertib Siswa & Komite Sekolah\n3. Tanya Jawab & Musyawarah Orang Tua\n4. Penutup'
  );
  const [catatanUndangan, setCatatanUndangan] = useState<string>(
    'Mengingat pentingnya acara ini, dimohon kehadiran Bapak/Ibu tepat pada waktunya dan tidak diwakilkan.'
  );

  const handlePresetChange = (type: 'ortu' | 'guru' | 'komite' | 'kustom') => {
    setJenisRapatUndangan(type);
    if (type === 'ortu') {
      setHalSuratUndangan('Undangan Rapat Sosialisasi Program Sekolah & Orang Tua / Wali Murid');
      setTujuanSuratUndangan('Bapak/Ibu Orang Tua / Wali Murid');
      setPengantarUndangan('Sehubungan dengan dimulainya Tahun Ajaran Baru 2026/2027 serta sosialisasi program kerja sekolah dan tata tertib siswa, kami mengharapkan kehadiran Bapak/Ibu Orang Tua / Wali Murid pada:');
      setAgendaUndangan('1. Sosialisasi Program Kerja Sekolah & Kurikulum Operasional\n2. Pembahasan Tata Tertib Siswa & Komite Sekolah\n3. Tanya Jawab & Musyawarah Orang Tua\n4. Penutup');
    } else if (type === 'guru') {
      setHalSuratUndangan('Undangan Rapat Dewan Guru & Evaluation Pembelajaran');
      setTujuanSuratUndangan('Bapak/Ibu Dewan Guru & Tenaga Kependidikan');
      setPengantarUndangan('Sehubungan dengan pembagian tugas mengajar, penyusunan Perangkat Ajar, serta persiapan Kegiatan Belajar Mengajar (KBM), kami mengharapkan kehadiran Bapak/Ibu Dewan Guru pada:');
      setAgendaUndangan('1. Pembagian Tugas Mengajar & Jadwal Pelajaran\n2. Penyusunan Modul Ajar / RPP\n3. Pembahasan Kedisiplinan & Administrasi PTK\n4. Lain-lain');
    } else if (type === 'komite') {
      setHalSuratUndangan('Undangan Rapat Musyawarah Komite Sekolah');
      setTujuanSuratUndangan('Bapak/Ibu Pengurus Komite Sekolah & Tokoh Masyarakat');
      setPengantarUndangan('Dalam rangka meningkatkan mutu pelayanan pendidikan serta penyusunan Rencana Anggaran Pendapatan dan Belanja Sekolah (RAPBS), kami mengharapkan kehadiran Bapak/Ibu Pengurus Komite Sekolah pada:');
      setAgendaUndangan('1. Pembahasan Program Pengembangan Sekolah\n2. Penyusunan Rencana Anggaran (RAPBS)\n3. Evaluasi Sarana & Prasarana Sekolah\n4. Lain-lain');
    }
  };

  // 8. Berita Acara Rapat Specific
  const [jenisRapatBa, setJenisRapatBa] = useState<'ortu' | 'guru' | 'komite' | 'kustom'>('ortu');
  const [judulBeritaAcara, setJudulBeritaAcara] = useState<string>(
    'BERITA ACARA RAPAT SOSIALISASI PROGRAM KERJA & MUSYAWARAH ORANG TUA / WALI MURID'
  );
  const [hariTanggalBa, setHariTanggalBa] = useState<string>('Sabtu, 25 Juli 2026');
  const [waktuBa, setWaktuBa] = useState<string>('08:30 WIB s.d. 11:30 WIB');
  const [tempatBa, setTempatBa] = useState<string>('Ruang Aula / Kelas SD Negeri Ciburial');
  const [pimpinanRapat, setPimpinanRapat] = useState<string>('Della Juliana Rismalinda, S.Pd');
  const [jabatanPimpinan, setJabatanPimpinan] = useState<string>('Kepala Sekolah');
  const [notulisRapat, setNotulisRapat] = useState<string>('Siti Rahmawati, S.Pd');
  const [jabatanNotulis, setJabatanNotulis] = useState<string>('Notulis / Sekretaris Rapat');
  const [jumlahUndanganBa, setJumlahUndanganBa] = useState<string>('135 Orang');
  const [jumlahHadirBa, setJumlahHadirBa] = useState<string>('120 Orang');
  const [pokokBahasanBa, setPokokBahasanBa] = useState<string>(
    '1. Pemaparan Visi, Misi, dan Program Kerja Sekolah TA 2026/2027\n2. Sosialisasi Kurikulum Operasional Satuan Pendidikan (KOSP)\n3. Pembahasan Tata Tertib Siswa, Ekstrakurikuler, dan Komite Sekolah\n4. Musyawarah & Tanya Jawab Orang Tua / Wali Murid'
  );
  const [hasilKeputusanBa, setHasilKeputusanBa] = useState<string>(
    '1. Menyetujui dan mendukung penuh Program Kerja Sekolah dan Kurikulum TA 2026/2027.\n2. Mengesahkan Tata Tertib Siswa dan Kesepakatan Bersama Komite Sekolah.\n3. Menyepakati Pembentukan Paguyuban Orang Tua Murid di setiap Rombel.\n4. Menyetujui Pelaksanaan Kegiatan Ekstrakurikuler Wajib dan Pilihan.'
  );

  const handlePresetBaChange = (type: 'ortu' | 'guru' | 'komite' | 'kustom') => {
    setJenisRapatBa(type);
    if (type === 'ortu') {
      setJudulBeritaAcara('BERITA ACARA RAPAT SOSIALISASI PROGRAM KERJA & MUSYAWARAH ORANG TUA / WALI MURID');
      setPokokBahasanBa('1. Pemaparan Visi, Misi, dan Program Kerja Sekolah TA 2026/2027\n2. Sosialisasi Kurikulum Operasional Satuan Pendidikan (KOSP)\n3. Pembahasan Tata Tertib Siswa, Ekstrakurikuler, dan Komite Sekolah\n4. Musyawarah & Tanya Jawab Orang Tua / Wali Murid');
      setHasilKeputusanBa('1. Menyetujui dan mendukung penuh Program Kerja Sekolah dan Kurikulum TA 2026/2027.\n2. Mengesahkan Tata Tertib Siswa dan Kesepakatan Bersama Komite Sekolah.\n3. Menyepakati Pembentukan Paguyuban Orang Tua Murid di setiap Rombel.\n4. Menyetujui Pelaksanaan Kegiatan Ekstrakurikuler Wajib dan Pilihan.');
      setPimpinanRapat(schoolInfo.kepalaSekolah || 'Della Juliana Rismalinda, S.Pd');
      setJabatanPimpinan('Kepala Sekolah');
      setNotulisRapat('Siti Rahmawati, S.Pd');
      setJabatanNotulis('Notulis / Sekretaris');
    } else if (type === 'guru') {
      setJudulBeritaAcara('BERITA ACARA RAPAT DEWAN GURU & EVALUASI PEMBELAJARAN');
      setPokokBahasanBa('1. Pembagian Tugas Mengajar & Beban Kerja Guru (JJM) TA 2026/2027\n2. Penyusunan Perangkat Ajar (Modul Ajar, ATP, Prota, Promes)\n3. Pembahasan Kedisiplinan Guru, Piket, dan Administrasi Dapodik\n4. Evaluasi Hasil Belajar & Program Remedial / Pengayaan');
      setHasilKeputusanBa('1. Menetapkan Pembagian Tugas Mengajar dan Tugas Tambahan PTK.\n2. Menyepakati Batas Waktu Pengumpulan Perangkat Ajar Lengkap.\n3. Menetapkan Jadwal Piket Harian dan Pembina Upacara.\n4. Menyepakati Strategi Peningkatan Kedisiplinan & Mutu Pembelajaran.');
      setPimpinanRapat(schoolInfo.kepalaSekolah || 'Della Juliana Rismalinda, S.Pd');
      setJabatanPimpinan('Kepala Sekolah');
      setNotulisRapat('Guru K3S / Sekretaris Sekolah');
      setJabatanNotulis('Notulis Rapat');
    } else if (type === 'komite') {
      setJudulBeritaAcara('BERITA ACARA RAPAT MUSYAWARAH KOMITE SEKOLAH & PENGEMBANGAN SARPRAS');
      setPokokBahasanBa('1. Pembahasan Rencana Anggaran Pendapatan dan Belanja Sekolah (RAPBS)\n2. Evaluasi Sarana dan Prasarana Penunjang Belajar Siswa\n3. Program Kemitraan Sekolah dengan Masyarakat & Stakeholder\n4. Rencana Kerja Bakti dan Gotong Royong Lingkungan Sekolah');
      setHasilKeputusanBa('1. Menyetujui Rancangan Anggaran Pendapatan & Belanja Sekolah (RAPBS).\n2. Sepakat Menggalang Dukungan Sarpras Penunjang Kegiatan Ekstrakurikuler.\n3. Menyetujui Program Kemitraan dan Program Gotong Royong Berkala.');
      setPimpinanRapat('H. Ahmad Hidayat, S.Pd.I');
      setJabatanPimpinan('Ketua Komite Sekolah');
      setNotulisRapat('Drs. M. Ridwan');
      setJabatanNotulis('Sekretaris Komite');
    }
  };

  // 7. Daftar Nilai Specific
  const [mataPelajaran, setMataPelajaran] = useState<string>('Ilmu Pengetahuan Alam dan Sosial (IPAS)');
  const [judulPenilaian, setJudulPenilaian] = useState<string>('Penilaian Akhir Semester (PAS) / Sumatif');
  const [gradeColumns, setGradeColumns] = useState<string[]>([
    'Tugas 1', 'Tugas 2', 'STS', 'SAS', 'Nilai Akhir'
  ]);
  const [newGradeColInput, setNewGradeColInput] = useState<string>('');
  const [studentScores, setStudentScores] = useState<Record<string, Record<string, string>>>({});

  // Handlers for Grade Columns
  const handleAddGradeColumn = () => {
    const trimmed = newGradeColInput.trim();
    if (!trimmed) return;
    if (gradeColumns.includes(trimmed)) {
      alert(`Kolom "${trimmed}" sudah ada.`);
      return;
    }
    setGradeColumns(prev => [...prev, trimmed]);
    setNewGradeColInput('');
  };

  const handleDeleteGradeColumn = (index: number) => {
    setGradeColumns(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetGradeColumns = () => {
    setGradeColumns(['Tugas 1', 'Tugas 2', 'STS', 'SAS', 'Nilai Akhir']);
  };

  const handleScoreChange = (studentId: string, colName: string, value: string) => {
    setStudentScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [colName]: value
      }
    }));
  };

  // Update default fields when currentStudent changes
  useEffect(() => {
    if (currentStudent) {
      if (currentStudent.namaAyah || currentStudent.namaIbu) {
        setNamaOrtuPindah(currentStudent.namaIbu || currentStudent.namaAyah || 'Novitasari');
      }
      if (currentStudent.pekerjaanAyah) {
        setPekerjaanOrtuPindah(currentStudent.pekerjaanAyah);
      }
      if (currentStudent.rombel) {
        setDiterimaDiKelas(currentStudent.rombel);
      }
    }
  }, [selectedStudentId, currentStudent]);

  // Filtered Students by Selected Rombel
  const rombelStudents = useMemo(() => {
    if (selectedRombel === 'semua') return students;
    return students.filter(s => s.rombel === selectedRombel);
  }, [students, selectedRombel]);

  // Print Handler
  const handlePrint = () => {
    if (activeTab === 'mutasi_keluar' && currentStudent && !isStudentMutasi(currentStudent) && onMutasiKeluar) {
      if (confirm(`Surat Mutasi Keluar untuk "${currentStudent.namaSiswa}" akan dicetak. Apakah Anda ingin langsung mengeluarkan murid ini dari Rombel ${currentStudent.rombel} dan memindahkannya ke Tab Murid Mutasi?`)) {
        onMutasiKeluar(currentStudent);
      }
    }
    window.print();
  };

  // Regenerate fresh letter number
  const handleRefreshNomor = () => {
    setNomorSurat(generateLetterNumber());
  };

  // Effective Logos (from School Info or LocalStorage)
  const effectiveLogoPemda = schoolInfo.logoPemda || logoPemda || null;
  const effectiveLogoSekolah = schoolInfo.logoSekolah || logoSekolah || null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto animate-fadeIn modal-print-overlay">
      {/* Dynamic Print CSS for Page Size A4, Custom Margin and Custom Scale */}
      <style>{`
        @media print {
          @page {
            size: A4 ${pageOrientation};
            margin: ${customMargin}mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .printable-paper {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid !important;
            transform: scale(${customScale / 100});
            transform-origin: top left;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl max-w-6xl w-full my-4 shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[94vh] modal-print-card">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between border-b border-slate-800 shrink-0 gap-3 no-print">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Pusat Dokumen & Surat Administrasi Murid
              </h2>
              <p className="text-xs text-slate-400">
                Format Resmi A4 • Custom Margin & Scale • {schoolInfo.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Tabs Bar */}
        <div className="bg-slate-800 text-slate-300 p-2 flex items-center gap-1 overflow-x-auto shrink-0 border-b border-slate-700 no-print text-xs font-medium">
          <button
            onClick={() => setActiveTab('absensi')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'absensi'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Daftar Absensi Murid</span>
          </button>

          <button
            onClick={() => setActiveTab('aktif')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'aktif'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Surat Murid Aktif</span>
          </button>

          <button
            onClick={() => setActiveTab('mutasi_masuk')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'mutasi_masuk'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Mutasi Masuk</span>
          </button>

          <button
            onClick={() => setActiveTab('mutasi_keluar')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'mutasi_keluar'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserMinus className="w-4 h-4" />
            <span>Mutasi Keluar</span>
          </button>

          <button
            onClick={() => setActiveTab('pip')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'pip'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Surat Keterangan PIP</span>
          </button>

          <button
            onClick={() => setActiveTab('undangan_rapat')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'undangan_rapat'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Surat Undangan Rapat</span>
          </button>

          <button
            onClick={() => setActiveTab('berita_acara_rapat')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'berita_acara_rapat'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Berita Acara Rapat</span>
          </button>

          <button
            onClick={() => setActiveTab('rapat_ortu')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'rapat_ortu'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Hadir Rapat Ortu</span>
          </button>

          <button
            onClick={() => setActiveTab('daftar_nilai')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'daftar_nilai'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Daftar Nilai Siswa</span>
          </button>
        </div>

        {/* Modal Main Content Container (Control Sidebar + Printable Paper Preview) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100 modal-print-body">
          {/* Controls Sidebar */}
          <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 overflow-y-auto shrink-0 space-y-4 no-print text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5 text-sm">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              Parameter & Layout Dokumen
            </h3>

            {/* Page Orientation, Custom Margin & Custom Scale Controls */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Sliders className="w-4 h-4 text-emerald-600" />
                Pengaturan Kertas & Margin:
              </label>

              {/* Orientasi */}
              <div>
                <span className="text-[11px] font-semibold text-slate-700 block mb-1">Orientasi A4:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPageOrientation('portrait')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border text-center transition-all cursor-pointer ${
                      pageOrientation === 'portrait'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Portrait (Tegak)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageOrientation('landscape')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border text-center transition-all cursor-pointer ${
                      pageOrientation === 'landscape'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Landscape (Mendatar)
                  </button>
                </div>
              </div>

              {/* Custom Margin Input & Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Custom Margin:</span>
                  <span className="font-mono text-emerald-700 font-bold">{customMargin} mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="1"
                    value={customMargin}
                    onChange={e => setCustomMargin(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="5"
                    max="35"
                    value={customMargin}
                    onChange={e => setCustomMargin(Math.max(5, Math.min(35, Number(e.target.value))))}
                    className="w-14 p-1 bg-white border border-slate-300 rounded text-center text-xs font-bold font-mono"
                  />
                </div>
              </div>

              {/* Custom Scale Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Skala Cetak (Scale):</span>
                  <span className="font-mono text-emerald-700 font-bold">{customScale} %</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="60"
                    max="120"
                    step="5"
                    value={customScale}
                    onChange={e => setCustomScale(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomScale(100)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold hover:bg-slate-100"
                    title="Reset Skala 100%"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Student Picker for Individual Letters */}
            {['aktif', 'mutasi_masuk', 'mutasi_keluar', 'pip'].includes(activeTab) && (
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block text-xs">Cari Murid:</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={studentSearchTerm}
                    onChange={e => setStudentSearchTerm(e.target.value)}
                    placeholder="Cari Nama / NISN / NIPD..."
                    className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {studentSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setStudentSearchTerm('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      title="Clear Search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="font-semibold text-slate-700 block text-xs">
                    Pilih Murid Target ({filteredStudentsForPicker.length}):
                  </label>
                  {studentSearchTerm.trim() && filteredStudentsForPicker.length > 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Auto-pilih hasil pencarian
                    </span>
                  )}
                </div>

                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {filteredStudentsForPicker.length === 0 ? (
                    <option value="">-- Murid tidak ditemukan --</option>
                  ) : (
                    filteredStudentsForPicker.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.namaSiswa} ({s.rombel}) - NISN: {formatNisn(s.nisn) || '-'}
                      </option>
                    ))
                  )}
                </select>

                {/* Quick Selection List when searching */}
                {studentSearchTerm.trim() && filteredStudentsForPicker.length > 0 && (
                  <div className="mt-1 space-y-1 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-1.5 bg-slate-50">
                    <div className="text-[10px] text-slate-500 font-medium px-1 pb-1 border-b border-slate-200">
                      Klik untuk memilih murid dari hasil pencarian:
                    </div>
                    {filteredStudentsForPicker.map(s => {
                      const isSelected = s.id === selectedStudentId;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedStudentId(s.id)}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white font-bold shadow-xs'
                              : 'hover:bg-slate-200 text-slate-800 bg-white border border-slate-200'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="block font-semibold">{s.namaSiswa}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                              Rombel {s.rombel} • NISN: {formatNisn(s.nisn) || '-'}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Rombel Picker for Group Documents */}
            {['absensi', 'rapat_ortu', 'daftar_nilai'].includes(activeTab) && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Pilih Rombel / Kelas:</label>
                <select
                  value={selectedRombel}
                  onChange={e => setSelectedRombel(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="semua">Semua Rombel ({students.length} Murid)</option>
                  {getStoredRombelList().map(r => {
                    const cnt = students.filter(s => s.rombel === r).length;
                    return (
                      <option key={r} value={r}>
                        Kelas {r} ({cnt} Murid)
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Common Letter Metadata */}
            {['aktif', 'mutasi_masuk', 'mutasi_keluar', 'pip', 'undangan_rapat', 'berita_acara_rapat'].includes(activeTab) && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700">Nomor Surat Resmi:</label>
                    <button
                      onClick={handleRefreshNomor}
                      className="text-[10px] text-emerald-600 hover:underline font-medium cursor-pointer flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Acak
                    </button>
                  </div>
                  <input
                    type="text"
                    value={nomorSurat}
                    onChange={e => setNomorSurat(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Tanggal Surat:</label>
                  <input
                    type="text"
                    value={tanggalSurat}
                    onChange={e => setTanggalSurat(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </>
            )}

            {/* TAB SPECIFIC CONTROLS */}

            {/* Mutasi Masuk Controls */}
            {activeTab === 'mutasi_masuk' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Sekolah Asal:</label>
                  <input
                    type="text"
                    value={sekolahAsal}
                    onChange={e => setSekolahAsal(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">NPSN Sekolah Asal:</label>
                  <input
                    type="text"
                    value={npsnSekolahAsal}
                    onChange={e => setNpsnSekolahAsal(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Alamat Sekolah Asal:</label>
                  <textarea
                    rows={2}
                    value={alamatSekolahAsal}
                    onChange={e => setAlamatSekolahAsal(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Diterima di Kelas:</label>
                  <input
                    type="text"
                    value={diterimaDiKelas}
                    onChange={e => setDiterimaDiKelas(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Tahun Pelajaran:</label>
                  <input
                    type="text"
                    value={tahunPelajaranMasuk}
                    onChange={e => setTahunPelajaranMasuk(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </>
            )}

            {/* Mutasi Keluar Controls */}
            {activeTab === 'mutasi_keluar' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Nama Orang Tua / Wali:</label>
                  <input
                    type="text"
                    value={namaOrtuPindah}
                    onChange={e => setNamaOrtuPindah(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Pekerjaan Ortu / Wali:</label>
                  <input
                    type="text"
                    value={pekerjaanOrtuPindah}
                    onChange={e => setPekerjaanOrtuPindah(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Mengajukan Pindah Ke:</label>
                  <textarea
                    rows={2}
                    value={sekolahTujuan}
                    onChange={e => setSekolahTujuan(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Alasan Kepindahan:</label>
                  <input
                    type="text"
                    value={alasanMutasiKeluar}
                    onChange={e => setAlasanMutasiKeluar(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                {currentStudent && (
                  <div className="pt-2">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <UserMinus className="w-4 h-4 text-amber-600" />
                        Status Keanggotaan Rombel:
                      </div>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        {isStudentMutasi(currentStudent) ? (
                          <span className="font-bold text-rose-700 block">
                            ✓ Murid ini sudah berstatus Mutasi Keluar & berada di Tab Murid Mutasi.
                          </span>
                        ) : (
                          <span className="block">
                            Murid ini aktif di <strong>Rombel {currentStudent.rombel}</strong>.
                          </span>
                        )}
                      </p>
                      {!isStudentMutasi(currentStudent) && onMutasiKeluar && (
                        <button
                          type="button"
                          onClick={() => onMutasiKeluar(currentStudent)}
                          className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          Proses & Pindahkan ke Tab Murid Mutasi
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PIP Controls */}
            {activeTab === 'pip' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Nomor Rekening PIP:</label>
                  <input
                    type="text"
                    value={nomorRekeningPip}
                    onChange={e => setNomorRekeningPip(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Akun Virtual PIP:</label>
                  <input
                    type="text"
                    value={akunVirtualPip}
                    onChange={e => setAkunVirtualPip(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Tahap Pencairan:</label>
                  <input
                    type="text"
                    value={tahapPencairanPip}
                    onChange={e => setTahapPencairanPip(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </>
            )}

            {/* Absensi Controls */}
            {activeTab === 'absensi' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Bulan Absensi:</label>
                  <select
                    value={bulanAbsensi}
                    onChange={e => setBulanAbsensi(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  >
                    {INDONESIAN_MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Tahun:</label>
                  <input
                    type="text"
                    value={tahunAbsensi}
                    onChange={e => setTahunAbsensi(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Format Lembar:</label>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="absensiType"
                        checked={absensiType === 'presensi_31'}
                        onChange={() => setAbsensiType('presensi_31')}
                      />
                      <span>Presensi Harian Bulan (Grid Tgl 1 - 31)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="absensiType"
                        checked={absensiType === 'rekap_sia'}
                        onChange={() => setAbsensiType('rekap_sia')}
                      />
                      <span>Rekapitulasi Absensi (Sakit / Izin / Alpha)</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Surat Aktif Controls */}
            {activeTab === 'aktif' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Maksud & Keperluan Surat:</label>
                <textarea
                  rows={3}
                  value={keperluanAktif}
                  onChange={e => setKeperluanAktif(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            )}

            {/* Surat Undangan Rapat Controls */}
            {activeTab === 'undangan_rapat' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block text-xs">Pilih Preset Undangan Rapat:</label>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handlePresetChange('ortu')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatUndangan === 'ortu'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Orang Tua / Wali
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('guru')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatUndangan === 'guru'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Dewan Guru
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('komite')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatUndangan === 'komite'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Komite Sekolah
                    </button>
                    <button
                      type="button"
                      onClick={() => setJenisRapatUndangan('kustom')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatUndangan === 'kustom'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Kustom
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Perihal / Hal Surat:</label>
                  <input
                    type="text"
                    value={halSuratUndangan}
                    onChange={e => setHalSuratUndangan(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Kepada Yth (Tujuan):</label>
                  <input
                    type="text"
                    value={tujuanSuratUndangan}
                    onChange={e => setTujuanSuratUndangan(e.target.value)}
                    placeholder="Contoh: Bapak/Ibu Orang Tua / Wali Murid Kelas 1 s.d 6"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Kalimat Pembuka / Pengantar:</label>
                  <textarea
                    rows={3}
                    value={pengantarUndangan}
                    onChange={e => setPengantarUndangan(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Hari / Tanggal Rapat:</label>
                  <input
                    type="text"
                    value={hariTanggalUndangan}
                    onChange={e => setHariTanggalUndangan(e.target.value)}
                    placeholder="Contoh: Sabtu, 25 Juli 2026"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Waktu Rapat:</label>
                  <input
                    type="text"
                    value={waktuUndangan}
                    onChange={e => setWaktuUndangan(e.target.value)}
                    placeholder="Contoh: 08:00 WIB s.d. Selesai"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Tempat Rapat:</label>
                  <input
                    type="text"
                    value={tempatUndangan}
                    onChange={e => setTempatUndangan(e.target.value)}
                    placeholder="Contoh: Ruang Aula / Kelas SD Negeri Ciburial"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Agenda / Susunan Acara:</label>
                  <textarea
                    rows={4}
                    value={agendaUndangan}
                    onChange={e => setAgendaUndangan(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Catatan Tambahan / Himbauan:</label>
                  <textarea
                    rows={2}
                    value={catatanUndangan}
                    onChange={e => setCatatanUndangan(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </>
            )}

            {/* Berita Acara Rapat Controls */}
            {activeTab === 'berita_acara_rapat' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block text-xs">Pilih Preset Berita Acara:</label>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handlePresetBaChange('ortu')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatBa === 'ortu'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Orang Tua / Wali
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetBaChange('guru')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatBa === 'guru'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Dewan Guru
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetBaChange('komite')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatBa === 'komite'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Komite Sekolah
                    </button>
                    <button
                      type="button"
                      onClick={() => setJenisRapatBa('kustom')}
                      className={`p-1.5 rounded-lg border font-medium transition-all text-center ${
                        jenisRapatBa === 'kustom'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Kustom
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Judul / Tema Berita Acara:</label>
                  <textarea
                    rows={2}
                    value={judulBeritaAcara}
                    onChange={e => setJudulBeritaAcara(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-bold uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Hari / Tanggal Rapat:</label>
                  <input
                    type="text"
                    value={hariTanggalBa}
                    onChange={e => setHariTanggalBa(e.target.value)}
                    placeholder="Contoh: Sabtu, 25 Juli 2026"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Waktu Rapat:</label>
                    <input
                      type="text"
                      value={waktuBa}
                      onChange={e => setWaktuBa(e.target.value)}
                      placeholder="08:30 s.d. 11:30 WIB"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Tempat Rapat:</label>
                    <input
                      type="text"
                      value={tempatBa}
                      onChange={e => setTempatBa(e.target.value)}
                      placeholder="Ruang Aula Sekolah"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Pimpinan Rapat:</label>
                    <input
                      type="text"
                      value={pimpinanRapat}
                      onChange={e => setPimpinanRapat(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Jabatan Pimpinan:</label>
                    <input
                      type="text"
                      value={jabatanPimpinan}
                      onChange={e => setJabatanPimpinan(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Notulis Rapat:</label>
                    <input
                      type="text"
                      value={notulisRapat}
                      onChange={e => setNotulisRapat(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Jabatan Notulis:</label>
                    <input
                      type="text"
                      value={jabatanNotulis}
                      onChange={e => setJabatanNotulis(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Jumlah Undangan:</label>
                    <input
                      type="text"
                      value={jumlahUndanganBa}
                      onChange={e => setJumlahUndanganBa(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Jumlah Hadir:</label>
                    <input
                      type="text"
                      value={jumlahHadirBa}
                      onChange={e => setJumlahHadirBa(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Pokok Bahasan / Agenda:</label>
                  <textarea
                    rows={4}
                    value={pokokBahasanBa}
                    onChange={e => setPokokBahasanBa(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Hasil Keputusan / Kesepakatan:</label>
                  <textarea
                    rows={4}
                    value={hasilKeputusanBa}
                    onChange={e => setHasilKeputusanBa(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                  />
                </div>
              </>
            )}

            {/* Rapat Ortu Controls */}
            {activeTab === 'rapat_ortu' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Nama / Agenda Rapat:</label>
                  <textarea
                    rows={2}
                    value={namaRapat}
                    onChange={e => setNamaRapat(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Hari / Tanggal Rapat:</label>
                  <input
                    type="text"
                    value={hariTanggalRapat}
                    onChange={e => setHariTanggalRapat(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Waktu & Tempat:</label>
                  <input
                    type="text"
                    value={waktuTempatRapat}
                    onChange={e => setWaktuTempatRapat(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </>
            )}

            {/* Daftar Nilai Controls */}
            {activeTab === 'daftar_nilai' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Mata Pelajaran / Mapel:</label>
                  <input
                    type="text"
                    value={mataPelajaran}
                    onChange={e => setMataPelajaran(e.target.value)}
                    placeholder="Contoh: Bahasa Indonesia, IPAS, Matematika..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Judul / Jenis Penilaian:</label>
                  <input
                    type="text"
                    value={judulPenilaian}
                    onChange={e => setJudulPenilaian(e.target.value)}
                    placeholder="Contoh: Sumatif Akhir Semester (SAS)"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                {/* Custom Grade Columns Section */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block text-xs">
                      Custom Kolom Nilai ({gradeColumns.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleResetGradeColumns}
                      className="text-[10px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Reset Default
                    </button>
                  </div>

                  {/* Input Tambah Kolom Nilai */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newGradeColInput}
                      onChange={e => setNewGradeColInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGradeColumn();
                        }
                      }}
                      placeholder="Nama kolom baru..."
                      className="flex-1 p-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddGradeColumn}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>

                  {/* List Columns Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {gradeColumns.map((col, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-slate-100 border border-slate-300 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-2xs"
                      >
                        <span>{col}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteGradeColumn(idx)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer rounded"
                          title="Hapus Kolom"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 mt-2">
                    <span className="font-bold block">📌 Kolom Keterangan:</span>
                    <p className="text-[10px] leading-tight text-amber-800">
                      Kolom akhir <strong>"Keterangan"</strong> otomatis ditambahkan di posisi paling kanan tabel.
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1 text-[11px]">
              <span className="font-bold flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-emerald-700" />
                Format Cetak A4 / PDF:
              </span>
              <p>
                Dokumen disesuaikan dengan standar resmi instansi. Margin 15mm aktif secara otomatis.
              </p>
            </div>
          </div>

          {/* Printable Live Paper Preview Window */}
          <div className="flex-1 bg-slate-200 p-4 sm:p-8 overflow-x-auto overflow-y-auto flex flex-col items-center modal-print-preview">
            
            {/* Live Orientation Status Indicator Bar */}
            <div className="mb-4 w-full max-w-4xl flex items-center justify-between text-xs font-sans text-slate-700 no-print bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-sm shrink-0">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Preview Tampilan Live: <strong className="text-slate-900 uppercase">A4 {pageOrientation} ({pageOrientation === 'landscape' ? '297 × 210 mm' : '210 × 297 mm'})</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Margin {customMargin}mm
                </span>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Skala {customScale}%
                </span>
              </div>
            </div>

            <div 
              style={{
                padding: `${customMargin}mm`,
                transform: customScale !== 100 ? `scale(${customScale / 100})` : undefined,
                transformOrigin: 'top center',
              }}
              className={`bg-white shadow-2xl rounded-xs text-slate-900 font-serif text-xs leading-relaxed space-y-5 print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full printable-paper transition-all duration-300 border border-slate-300 ${
                pageOrientation === 'landscape' 
                  ? 'w-[297mm] max-w-none min-h-[210mm] text-[11px]' 
                  : 'w-[210mm] max-w-full min-h-[297mm]'
              }`}
            >
              
              {/* KOP SURAT RESMI (SESUAI CONTOH) */}
              <div className="border-b-4 border-double border-slate-900 pb-2 flex items-center justify-between text-center">
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                  {/* Emblem / Logo Kiri (Pemda) */}
                  {effectiveLogoPemda ? (
                    <img src={effectiveLogoPemda} alt="Logo Pemda" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="w-14 h-14 bg-amber-500/10 border-2 border-amber-600 rounded-sm flex flex-col items-center justify-center text-[7px] font-bold text-amber-900 leading-none p-1 text-center">
                      <span>KABUPATEN</span>
                      <span>BANDUNG BARAT</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 px-2 space-y-0.5">
                  <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase font-sans">
                    PEMERINTAH KABUPATEN BANDUNG BARAT
                  </h3>
                  <h1 className="text-base font-black uppercase text-slate-1200 font-sans tracking-wide">
                    {schoolInfo.name.toUpperCase()}
                  </h1>
                  <p className="text-[11px] font-sans text-slate-800 leading-tight">
                    {schoolInfo.address} {schoolInfo.kecamatan} Kode Pos {schoolInfo.kodePos}
                  </p>
                  <p className="text-[10px] font-sans text-slate-800">
                    {schoolInfo.kabupaten} Kode Pos : {schoolInfo.kodePos} Tlp. {schoolInfo.phone} | email : {schoolInfo.email}
                  </p>
                </div>

                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                  {/* Emblem / Logo Kanan (Sekolah) */}
                  {effectiveLogoSekolah ? (
                    <img src={effectiveLogoSekolah} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="w-14 h-14 bg-emerald-500/10 border-2 border-emerald-600 rounded-full flex flex-col items-center justify-center text-[7px] font-bold text-emerald-900 leading-none p-1 text-center">
                      <span>SD NEGERI</span>
                      <span>CIBURIAL</span>
                    </div>
                  )}
                </div>
              </div>

              {/* DOKUMEN 1: SURAT KETERANGAN PIP (SESUAI EXACT EXAMPLE PDF 1) */}
              {activeTab === 'pip' && currentStudent && (
                <div className="space-y-4 font-sans text-slate-900">
                  <div className="text-center space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-900 inline-block pb-0.5">
                      SURAT KETERANGAN KEPALA SEKOLAH
                    </h2>
                    <p className="text-xs font-mono font-medium">
                      Nomor : {nomorSurat}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p>Yang bertanda tangan di bawah ini :</p>
                    <table className="ml-4 w-full">
                      <tbody>
                        <tr>
                          <td className="w-28 py-0.5 font-medium">Nama</td>
                          <td className="w-4">:</td>
                          <td className="font-bold">{schoolInfo.kepalaSekolah}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">NIP</td>
                          <td>:</td>
                          <td className="font-mono">{schoolInfo.nipKepala}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">Jabatan</td>
                          <td>:</td>
                          <td>Kepala {schoolInfo.name}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p>Dengan ini menerangkan bahwa nama tersebut di bawah ini, :</p>
                    <table className="ml-4 w-full">
                      <tbody>
                        <tr>
                          <td className="w-48 py-0.5 font-medium">Nama Murid</td>
                          <td className="w-4">:</td>
                          <td className="font-bold uppercase">{currentStudent.namaSiswa}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">Kelas</td>
                          <td>:</td>
                          <td>{currentStudent.rombel}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">NISN</td>
                          <td>:</td>
                          <td className="font-mono font-bold">{currentStudent.nisn || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">Tempat Tanggal Lahir</td>
                          <td>:</td>
                          <td>{currentStudent.ttl}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">Nama Orang Tua Kandung</td>
                          <td>:</td>
                          <td>{currentStudent.namaIbu || currentStudent.namaAyah || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">Nomor Rekening</td>
                          <td>:</td>
                          <td className="font-mono">{nomorRekeningPip}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-medium">Akun Virtual</td>
                          <td>:</td>
                          <td className="font-mono">{akunVirtualPip}</td>
                        </tr>                        
                        <tr>
                          <td className="py-0.5 font-medium">Tahap Pencairan</td>
                          <td>:</td>
                          <td className="font-bold">{tahapPencairanPip}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-justify leading-relaxed indent-8 pt-2">
                    adalah <strong>benar murid SD Negeri Ciburial dan yang bersangkutan sebagai penerima dana PIP (Program Indonesia Pintar)</strong>
                  </p>

                  <p className="text-justify leading-relaxed indent-8">
                    Demikian surat keterangan ini dibuat untuk dipergunakan sebagai salah satu persyaratan untuk pencairan dana PIP di bank penyalur.
                  </p>

                  <div className="pt-6 flex justify-end text-xs font-sans">
                    <div className="text-center w-64 space-y-1">
                      <p>Bandung Barat, {tanggalSurat}</p>
                      <p className="font-bold">Kepala SD Negeri Ciburial</p>
                      <div className="h-16" />
                      <p className="font-bold underline propercase">{schoolInfo.kepalaSekolah}</p>
                      <p className="text-[11px] font-mono">NIP. {schoolInfo.nipKepala}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN 2: SURAT MUTASI KELUAR (SESUAI EXACT EXAMPLE PDF 2 - FIT ON ONE PAGE) */}
              {activeTab === 'mutasi_keluar' && currentStudent && (
                <div className="space-y-2.5 font-sans text-slate-900 text-xs leading-tight">
                  <div className="text-center space-y-0.5">
                    <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-900 inline-block pb-0.5">
                      SURAT KETERANGAN MUTASI SEKOLAH
                    </h2>
                    <p className="text-xs font-mono font-medium">
                      Nomor : {nomorSurat}
                    </p>
                  </div>

                  <p className="text-justify leading-snug">
                    Yang bertanda tangan di bawah ini, Kepala Sekolah Dasar Negeri Ciburial, Kecamatan Lembang Kabupaten Bandung Barat Propinsi Jawa Barat, menerangkan bahwa :
                  </p>

                  <div className="ml-4 space-y-0.5 text-xs">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="w-40 py-[1px] font-medium">Nama Lengkap</td>
                          <td className="w-4">:</td>
                          <td className="font-bold uppercase">{currentStudent.namaSiswa}</td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">No. Induk Siswa</td>
                          <td>:</td>
                          <td className="font-mono">{currentStudent.nipd || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">NISN</td>
                          <td>:</td>
                          <td className="font-mono font-bold">{currentStudent.nisn || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Tempat, Tanggal Lahir</td>
                          <td>:</td>
                          <td>{currentStudent.ttl}</td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Kelas</td>
                          <td>:</td>
                          <td>{currentStudent.rombel}</td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Jenis Kelamin</td>
                          <td>:</td>
                          <td>{currentStudent.jk}</td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Alamat</td>
                          <td>:</td>
                          <td>{currentStudent.alamat || 'Kp. Langensari 003/012 RT 3 RW 12 Langensari'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-0.5 text-xs pt-0.5">
                    <p>Sesuai surat permohonan pindah sekolah oleh orang tua:</p>
                    <table className="ml-4 w-full">
                      <tbody>
                        <tr>
                          <td className="w-40 py-[1px] font-medium">Nama</td>
                          <td className="w-4">:</td>
                          <td className="font-bold">{namaOrtuPindah}</td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Pekerjaan</td>
                          <td>:</td>
                          <td>{pekerjaanOrtuPindah}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-justify leading-snug">
                    telah mengajukan pindah ke <strong>{sekolahTujuan}</strong> dengan alasan <strong>{alasanMutasiKeluar}</strong>. Bersama ini kami sertakan Buku Raport yang bersangkutan.
                  </p>

                  <div className="pt-2 flex justify-end text-xs font-sans">
                    <div className="text-center w-64 space-y-1">
                      <p>Bandung Barat, {tanggalSurat}</p>
                      <p className="font-bold leading-normal">Kepala Sekolah SD Negeri Ciburial,</p>
                      <div className="h-14" />
                      <p className="font-bold underline propercase">{schoolInfo.kepalaSekolah}</p>
                      <p className="text-[11px] font-mono">NIP. {schoolInfo.nipKepala}</p>
                    </div>
                  </div>

                  {/* Cut Slip - Isian Balikan Pindah Sekolah */}
                  <div className="pt-1 space-y-1 font-sans">
                    <div className="py-1 flex items-center gap-2">
                      <span className="text-[11px] font-bold">✂</span>
                      <div className="flex-1 border-b border-dashed border-slate-900" />
                    </div>

                    <p className="text-[11px] text-slate-900 font-medium">
                      Setelah anak diterima di sekolah ini, isian di bawah ini harap dikirim kembali pada kami.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span>NPSN :</span>
                      <div className="flex gap-1 font-mono">
                        {Array.from({ length: 8 }, (_, i) => (
                          <div key={i} className="w-4 h-4 border border-slate-900 flex items-center justify-center text-center text-xs">
                            {/* Empty box for NSS */}
                          </div>
                        ))}
                      </div>
                    </div>

                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="w-32 py-[1px] font-medium">Nama Sekolah</td>
                          <td className="w-3">:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Status Sekolah</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Alamat</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Desa</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Kecamatan</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Kabupaten</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Nama Murid</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Diterima di kelas</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                        <tr>
                          <td className="py-[1px] font-medium">Diterima tanggal</td>
                          <td>:</td>
                          <td className="border-b border-dotted border-slate-700"></td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="pt-2 flex justify-end text-xs font-sans">
                      <div className="text-center w-56 space-y-1">
                        <p>.............., ...............</p>
                        <p className="font-bold">Kepala Sekolah,</p>
                        <div className="h-12" />
                        <div className="inline-block text-left w-36">
                          <div className="border-b border-slate-900 w-full mb-0.5" />
                          <p className="text-[10px] font-mono font-medium">NIP.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN 3: SURAT MUTASI MASUK (SESUAI EXACT EXAMPLE PDF 3) */}
              {activeTab === 'mutasi_masuk' && currentStudent && (
                <div className="space-y-4 font-sans text-slate-900">
                  <div className="text-center space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-900 inline-block pb-0.5">
                      SURAT KETERANGAN
                    </h2>
                    <p className="text-xs font-mono font-medium">
                      Nomor : {nomorSurat}
                    </p>
                  </div>

                  <p className="text-justify leading-relaxed indent-8">
                    Yang bertanda tangan di bawah ini Kepala Sekolah Dasar Negeri Ciburial Kecamatan Lembang Kabupaten Bandung Barat menerangkan bahwa :
                  </p>

                  <div className="ml-6 space-y-1 text-xs">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="w-44 py-1 font-medium">Nama Lengkap</td>
                          <td className="w-4">:</td>
                          <td className="font-bold uppercase">{currentStudent.namaSiswa}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Tempat, Tanggal Lahir</td>
                          <td>:</td>
                          <td>{currentStudent.ttl}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">NISN</td>
                          <td>:</td>
                          <td className="font-mono font-bold">{currentStudent.nisn || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Jenis Kelamin</td>
                          <td>:</td>
                          <td>{currentStudent.jk}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Nama Orang Tua / Wali</td>
                          <td>:</td>
                          <td>{currentStudent.namaAyah || currentStudent.namaIbu || currentStudent.namaWali || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">NPSN Sekolah</td>
                          <td>:</td>
                          <td className="font-mono">{npsnSekolahAsal}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Asal Sekolah</td>
                          <td>:</td>
                          <td className="font-bold">{sekolahAsal}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium align-top">Alamat Sekolah</td>
                          <td className="align-top">:</td>
                          <td className="align-top">{alamatSekolahAsal}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-justify leading-relaxed indent-8">
                    Akan diterima sebagai murid kelas <strong>{diterimaDiKelas}</strong> di SD Negeri Ciburial NPSN 20207938 Kecamatan Lembang Kabupaten Bandung Barat Provinsi Jawa Barat pada tahun pelajaran <strong>{tahunPelajaranMasuk}</strong> setelah memenuhi seluruh persyaratan administrasi pindah sekolah yaitu :
                  </p>

                  <ol className="list-decimal list-inside ml-8 space-y-1 text-xs">
                    <li>Surat Mutasi dari Sekolah</li>
                    <li>Surat Mutasi dari Dapodik</li>
                    <li>FC. Kartu NISN</li>
                  </ol>

                  <p className="text-justify leading-relaxed indent-8">
                    Demikian surat keterangan ini dibuat untuk dipergunakan sebagai persyaratan pindah sekolah dari sekolah asal.
                  </p>

                  <div className="pt-6 flex justify-end text-xs font-sans">
                    <div className="text-center w-64 space-y-1">
                      <p>Bandung Barat, {tanggalSurat}</p>
                      <p className="font-bold">Kepala SD Negeri Ciburial</p>
                      <div className="h-16" />
                      <p className="font-bold underline propercase">{schoolInfo.kepalaSekolah}</p>
                      <p className="text-[11px] font-mono">NIP. {schoolInfo.nipKepala}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN 4: SURAT MURID AKTIF */}
              {activeTab === 'aktif' && currentStudent && (
                <div className="space-y-4 font-sans text-slate-900">
                  <div className="text-center space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-900 inline-block pb-0.5">
                      SURAT KETERANGAN MURID AKTIF
                    </h2>
                    <p className="text-xs font-mono font-medium">
                      Nomor : {nomorSurat}
                    </p>
                  </div>

                  <p className="text-justify leading-relaxed indent-8">
                    Yang bertanda tangan di bawah ini Kepala Sekolah <strong>{schoolInfo.name}</strong>, Kecamatan {schoolInfo.kecamatan}, Kabupaten {schoolInfo.kabupaten}, Provinsi {schoolInfo.provinsi}, dengan ini menerangkan bahwa:
                  </p>

                  <div className="ml-6 space-y-1 text-xs">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="w-44 py-1 font-medium">Nama Lengkap Murid</td>
                          <td className="w-4">:</td>
                          <td className="font-bold uppercase">{currentStudent.namaSiswa}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Tempat, Tanggal Lahir</td>
                          <td>:</td>
                          <td>{currentStudent.ttl}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Jenis Kelamin</td>
                          <td>:</td>
                          <td>{currentStudent.jk}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">NISN / NIPD</td>
                          <td>:</td>
                          <td className="font-mono font-bold">{currentStudent.nisn || '-'} / {currentStudent.nipd || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">NIK Murid</td>
                          <td>:</td>
                          <td className="font-mono">{currentStudent.nik || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Terdaftar di Kelas (Rombel)</td>
                          <td>:</td>
                          <td className="font-bold">Kelas {currentStudent.rombel}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Nama Orang Tua / Wali</td>
                          <td>:</td>
                          <td>{currentStudent.namaAyah || currentStudent.namaIbu || currentStudent.namaWali || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Alamat Tempat Tinggal</td>
                          <td>:</td>
                          <td>{currentStudent.alamat}, Kec. {currentStudent.kecamatan}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-justify leading-relaxed indent-8">
                    Adalah benar yang bersangkutan saat ini terdaftar aktif sebagai murid di <strong>{schoolInfo.name}</strong> pada Tahun Ajaran <strong>{schoolInfo.tahunAjaran}</strong> Semester <strong>{schoolInfo.semester}</strong>, serta berkelakuan baik.
                  </p>

                  <p className="text-justify leading-relaxed indent-8">
                    Demikian surat keterangan murid aktif ini dibuat dengan sebenarnya untuk dipergunakan sebagai: <strong className="underline">{keperluanAktif}</strong>.
                  </p>

                  <div className="pt-6 flex justify-end text-xs font-sans">
                    <div className="text-center w-64 space-y-1">
                      <p>Bandung Barat, {tanggalSurat}</p>
                      <p className="font-bold">Kepala {schoolInfo.name}</p>
                      <div className="h-16" />
                      <p className="font-bold underline propercase">{schoolInfo.kepalaSekolah}</p>
                      <p className="text-[11px] font-mono">NIP. {schoolInfo.nipKepala}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN 5: DAFTAR ABSENSI MURID */}
              {activeTab === 'absensi' && (
                <div className="space-y-4 font-sans text-slate-900">
                  <div className="text-center space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-900 inline-block pb-0.5">
                      DAFTAR PRESENSI KEHADIRAN MURID
                    </h2>
                    <p className="text-xs font-medium">
                      Bulan: {bulanAbsensi} {tahunAbsensi} • Rombel: {selectedRombel === 'semua' ? 'Semua Kelas' : `Kelas ${selectedRombel}`}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-900 text-[10px]">
                      <thead className="bg-slate-100 font-bold uppercase text-[9px] text-center">
                        <tr>
                          <th className="border border-slate-900 px-1 py-1 w-6">No</th>
                          <th className="border border-slate-900 px-1.5 py-1 w-20">NISN</th>
                          <th className="border border-slate-900 px-2 py-1 text-left">Nama Murid</th>
                          <th className="border border-slate-900 px-1 py-1 w-6">L/P</th>
                          <th className="border border-slate-900 px-1 py-1 w-10">Kelas</th>
                          {Array.from({ length: 31 }, (_, i) => (
                            <th key={i + 1} className="border border-slate-900 px-0.5 py-0.5 w-4 text-[8px]">
                              {i + 1}
                            </th>
                          ))}
                          <th className="border border-slate-900 px-1 py-1 w-5 bg-amber-50">S</th>
                          <th className="border border-slate-900 px-1 py-1 w-5 bg-sky-50">I</th>
                          <th className="border border-slate-900 px-1 py-1 w-5 bg-rose-50">A</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rombelStudents.map((s, idx) => (
                          <tr key={s.id}>
                            <td className="border border-slate-900 px-1 py-1 text-center font-semibold">{idx + 1}</td>
                            <td className="border border-slate-900 px-1.5 py-1 text-center font-mono text-[9px]">
                              {s.nisn || '-'}
                            </td>
                            <td className="border border-slate-900 px-2 py-1 font-bold uppercase">
                              {s.namaSiswa}
                            </td>
                            <td className="border border-slate-900 px-1 py-1 text-center font-semibold">
                              {s.jk === 'Laki-laki' ? 'L' : 'P'}
                            </td>
                            <td className="border border-slate-900 px-1 py-1 text-center">
                              {s.rombel}
                            </td>
                            {Array.from({ length: 31 }, (_, i) => (
                              <td key={i + 1} className="border border-slate-900 p-0 text-center"></td>
                            ))}
                            <td className="border border-slate-900 p-1 text-center bg-amber-50/50"></td>
                            <td className="border border-slate-900 p-1 text-center bg-sky-50/50"></td>
                            <td className="border border-slate-900 p-1 text-center bg-rose-50/50"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-4 max-w-2xl mx-auto flex justify-between px-8 text-xs font-sans">
                    <div className="text-center w-56 space-y-1">
                      <p>Mengetahui,</p>
                      <p className="font-bold">Kepala {schoolInfo.name}</p>
                      <div className="h-12 flex items-end justify-center">
                        <div>
                          <p className="font-bold underline propercase">{schoolInfo.kepalaSekolah}</p>
                          <p className="text-[11px] font-mono">NIP. {schoolInfo.nipKepala}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center w-56 space-y-1">
                      <p>.................., ....................................</p>
                      <p className="font-bold">Guru / Wali Kelas {selectedRombel}</p>
                      <div className="h-12 flex items-end justify-center">
                        <div>
                          <p className="font-bold underline uppercase">....................................</p>
                          <p className="text-[10px]">NIP. ....................................</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN: SURAT UNDANGAN RAPAT */}
              {activeTab === 'undangan_rapat' && (
                <div className="space-y-4 font-sans text-slate-900 leading-relaxed">
                  {/* Letter Metadata / Header Right & Left */}
                  <div className="flex justify-between items-start text-xs pt-2 border-t border-slate-900/10 gap-4">
                    <div className="space-y-1">
                      <table className="text-xs">
                        <tbody>
                          <tr>
                            <td className="w-20 py-0.5 font-medium text-slate-700">Nomor</td>
                            <td className="w-3 font-bold text-slate-700">:</td>
                            <td className="font-mono font-semibold text-slate-900">{nomorSurat}</td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium text-slate-700">Lampiran</td>
                            <td className="font-bold text-slate-700">:</td>
                            <td className="text-slate-900">-</td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium text-slate-700 align-top">Perihal</td>
                            <td className="font-bold text-slate-700 align-top">:</td>
                            <td className="font-bold underline text-slate-900">{halSuratUndangan}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="text-right whitespace-nowrap shrink-0 pt-0.5">
                      <p className="font-medium text-xs text-slate-900">Kab. Bandung Barat, {tanggalSurat}</p>
                    </div>
                  </div>

                  {/* Recipient / Kepada Yth */}
                  <div className="text-xs space-y-0.5 pt-2">
                    <p className="text-slate-700">Kepada Yth.</p>
                    <p className="font-bold text-xs uppercase text-slate-900">{tujuanSuratUndangan}</p>
                    <p className="font-semibold text-slate-800">{schoolInfo.name}</p>
                    <p className="text-slate-700">di Tempat</p>
                  </div>

                  {/* Salam Pembuka */}
                  <div className="text-xs pt-1 space-y-2">
                    <p className="font-semibold text-slate-900">Assalamu'alaikum Wr. Wb. / Salam Sejahtera,</p>
                    <p className="text-justify leading-relaxed indent-8 text-slate-900">
                      {pengantarUndangan}
                    </p>
                  </div>

                  {/* Rincian Rapat Box */}
                  <div className="my-3 p-3.5 bg-slate-50/90 border border-slate-300 rounded-lg text-xs space-y-1.5 mx-2 shadow-2xs">
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="w-36 py-1 font-semibold text-slate-700">Hari / Tanggal</td>
                          <td className="w-4 font-bold text-slate-700">:</td>
                          <td className="font-bold text-slate-900">{hariTanggalUndangan}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-semibold text-slate-700">Waktu Pelaksanaan</td>
                          <td className="font-bold text-slate-700">:</td>
                          <td className="font-bold text-slate-900">{waktuUndangan}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-semibold text-slate-700">Tempat Rapat</td>
                          <td className="font-bold text-slate-700">:</td>
                          <td className="font-bold text-slate-900">{tempatUndangan}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-semibold text-slate-700 align-top">Agenda / Acara</td>
                          <td className="font-bold text-slate-700 align-top">:</td>
                          <td className="align-top font-medium whitespace-pre-line leading-relaxed text-slate-900">
                            {agendaUndangan}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Penutup & Catatan */}
                  <div className="text-xs space-y-2.5">
                    <p className="text-justify leading-relaxed indent-8">
                      Mengingat pentingnya agenda acara tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya.
                    </p>
                    {catatanUndangan && (
                      <p className="text-xs italic text-slate-800 bg-amber-50/90 p-2.5 rounded-md border-l-3 border-amber-500">
                        <strong>Catatan:</strong> {catatanUndangan}
                      </p>
                    )}
                    <p className="pt-0.5">
                      Demikian surat undangan ini kami sampaikan. Atas perhatian, kehadiran, dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.
                    </p>
                    <p className="font-semibold text-slate-900 pt-0.5">Wassalamu'alaikum Wr. Wb.</p>
                  </div>

                  {/* Tanda Tangan Kepala Sekolah */}
                  <div className="pt-6 flex justify-end text-xs font-sans">
                    <div className="text-center w-64 space-y-1">
                      <p className="font-semibold">Kepala {schoolInfo.name}</p>
                      <div className="h-20" />
                      <p className="font-bold underline uppercase tracking-wide">{schoolInfo.kepalaSekolah}</p>
                      <p className="text-[11px] font-mono text-slate-800">NIP. {schoolInfo.nipKepala}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN: BERITA ACARA RAPAT */}
              {activeTab === 'berita_acara_rapat' && (
                <div className="space-y-4 font-sans text-slate-900 leading-relaxed">
                  {/* Document Title & Number */}
                  <div className="text-center space-y-1 pt-1">
                    <h2 className="text-sm font-bold uppercase tracking-wide underline decoration-1 underline-offset-4">
                      BERITA ACARA RAPAT
                    </h2>
                    <p className="text-xs font-bold text-slate-800 uppercase max-w-xl mx-auto px-4">
                      {judulBeritaAcara}
                    </p>
                    <p className="text-xs font-mono text-slate-700">
                      Nomor: {nomorSurat}
                    </p>
                  </div>

                  {/* Pengantar Berita Acara */}
                  <div className="text-xs pt-1 space-y-2">
                    <p className="text-justify leading-relaxed indent-8 text-slate-900">
                      Pada hari ini <strong className="font-bold text-slate-900">{hariTanggalBa}</strong>, bertempat di <strong className="font-bold text-slate-900">{tempatBa}</strong>, telah diselenggarakan musyawarah rapat <strong className="font-bold text-slate-900 lowercase">{judulBeritaAcara}</strong> yang dihadiri oleh unsur pimpinan rapat, pihak sekolah, komite, serta peserta rapat yang berkepentingan.
                    </p>
                  </div>

                  {/* Rincian Pelaksanaan Rapat */}
                  <div className="my-2 p-3 bg-slate-50/90 border border-slate-300 rounded-lg text-xs space-y-1.5 mx-1 shadow-2xs">
                    <p className="font-bold text-xs border-b border-slate-200 pb-1 text-slate-800">
                      A. PELAKSANAAN & PRESENSI RAPAT
                    </p>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="w-36 py-0.5 font-semibold text-slate-700">Hari / Tanggal</td>
                          <td className="w-4 font-bold text-slate-700">:</td>
                          <td className="font-bold text-slate-900">{hariTanggalBa}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-700">Waktu Pelaksanaan</td>
                          <td className="font-bold text-slate-700">:</td>
                          <td className="font-medium text-slate-900">{waktuBa}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-700">Tempat Rapat</td>
                          <td className="font-bold text-slate-700">:</td>
                          <td className="font-medium text-slate-900">{tempatBa}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-700">Pimpinan Rapat</td>
                          <td className="font-bold text-slate-700">:</td>
                          <td className="font-semibold text-slate-900">{pimpinanRapat} ({jabatanPimpinan})</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-700">Notulis / Sekretaris</td>
                          <td className="font-bold text-slate-700">:</td>
                          <td className="font-medium text-slate-900">{notulisRapat} ({jabatanNotulis})</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-700">Kehadiran Peserta</td>
                          <td className="font-bold text-slate-700">:</td>
                          <td className="font-medium text-slate-900">
                            Diundang: <span className="font-bold text-slate-800">{jumlahUndanganBa}</span> | Hadir: <span className="font-bold text-emerald-800">{jumlahHadirBa}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pokok Bahasan / Agenda */}
                  <div className="space-y-1 text-xs pt-1">
                    <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 uppercase text-[11px]">
                      B. POKOK BAHASAN & AGENDA RAPAT
                    </h3>
                    <div className="whitespace-pre-line leading-relaxed pl-2 font-medium text-slate-900">
                      {pokokBahasanBa}
                    </div>
                  </div>

                  {/* Hasil Keputusan & Kesepakatan */}
                  <div className="space-y-1 text-xs pt-1">
                    <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 uppercase text-[11px]">
                      C. HASIL MUSYAWARAH & KEPUTUSAN RAPAT
                    </h3>
                    <div className="whitespace-pre-line leading-relaxed pl-2 font-semibold text-slate-900 bg-slate-50/70 p-2.5 rounded border border-slate-200">
                      {hasilKeputusanBa}
                    </div>
                  </div>

                  {/* Penutup */}
                  <div className="text-xs pt-2 space-y-1">
                    <p className="text-justify leading-relaxed indent-8 text-slate-900">
                      Demikian Berita Acara Rapat ini dibuat dan disahkan dengan sebenarnya dengan penuh rasa tanggung jawab untuk dipergunakan sebagaimana mestinya.
                    </p>
                  </div>

                  {/* Tanda Tangan Notulis, Pimpinan & Mengetahui Kepala Sekolah */}
                  <div className="pt-4 space-y-4 font-sans text-xs">
                    <div className="flex justify-between items-start px-4">
                      <div className="text-center w-52 space-y-1">
                        <p className="font-medium text-slate-700">{jabatanNotulis}</p>
                        <div className="h-16" />
                        <p className="font-bold underline text-slate-900">{notulisRapat}</p>
                      </div>

                      <div className="text-center w-52 space-y-1">
                        <p className="font-medium text-slate-700">{jabatanPimpinan}</p>
                        <div className="h-16" />
                        <p className="font-bold underline text-slate-900">{pimpinanRapat}</p>
                      </div>
                    </div>

                    <div className="text-center w-64 mx-auto pt-2 space-y-1">
                      <p className="text-slate-700">Mengetahui,</p>
                      <p className="font-bold text-slate-900">Kepala {schoolInfo.name}</p>
                      <div className="h-16" />
                      <p className="font-bold underline uppercase tracking-wide text-slate-900">{schoolInfo.kepalaSekolah}</p>
                      <p className="text-[11px] font-mono text-slate-800">NIP. {schoolInfo.nipKepala}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN 6: DAFTAR HADIR RAPAT ORANG TUA */}
              {activeTab === 'rapat_ortu' && (
                <div className="space-y-4 font-sans text-slate-900">
                  <div className="text-center space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-900 inline-block pb-0.5">
                      DAFTAR HADIR RAPAT ORANG TUA / WALI MURID
                    </h2>
                    <p className="text-xs font-semibold">
                      {namaRapat}
                    </p>
                  </div>

                  <div className="border border-slate-300 rounded p-2 text-xs grid grid-cols-2 gap-1.5">
                    <div>Hari / Tanggal: <strong>{hariTanggalRapat}</strong></div>
                    <div>Waktu & Tempat: <strong>{waktuTempatRapat}</strong></div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-900 text-[10px]">
                      <thead className="bg-slate-100 font-bold uppercase text-[9px] text-center">
                        <tr>
                          <th className="border border-slate-900 px-1 py-1 w-6">No</th>
                          <th className="border border-slate-900 px-2 py-1 text-left">Nama Murid</th>
                          <th className="border border-slate-900 px-1 py-1 w-10">Kelas</th>
                          <th className="border border-slate-900 px-2 py-1 text-left">Nama Orang Tua / Wali</th>
                          <th className="border border-slate-900 px-2 py-1 w-32" colSpan={2}>
                            Tanda Tangan / Paraf
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rombelStudents.map((s, idx) => (
                          <tr key={s.id}>
                            <td className="border border-slate-900 px-1 py-1 text-center font-semibold">{idx + 1}</td>
                            <td className="border border-slate-900 px-2 py-1 font-bold uppercase">
                              {s.namaSiswa}
                            </td>
                            <td className="border border-slate-900 px-1 py-1 text-center">
                              {s.rombel}
                            </td>
                            <td className="border border-slate-900 px-2 py-1">
                              
                            </td>
                            <td className="border border-slate-900 px-1 py-1 w-16 text-[8px] text-slate-400">
                              {idx % 2 === 0 ? `${idx + 1}. .........` : ''}
                            </td>
                            <td className="border border-slate-900 px-1 py-1 w-16 text-[8px] text-slate-400">
                              {idx % 2 !== 0 ? `${idx + 1}. .........` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-4 max-w-2xl mx-auto flex justify-between px-8 text-xs font-sans">
                    <div className="text-center w-56 space-y-1">
                      <p>Mengetahui,</p>
                      <p className="font-bold">Komite Sekolah</p>
                      <div className="h-12 flex items-end justify-center">
                        <div>
                          <p className="font-bold underline uppercase">....................................</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center w-56 space-y-1">
                      <p>................., ...........................</p>
                      <p className="font-bold">Kepala {schoolInfo.name}</p>
                      <div className="h-12 flex items-end justify-center">
                        <div>
                          <p className="font-bold underline propercase">{schoolInfo.kepalaSekolah}</p>
                          <p className="text-[11px] font-mono">NIP. {schoolInfo.nipKepala}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOKUMEN 7: DAFTAR NILAI SISWA */}
              {activeTab === 'daftar_nilai' && (
                <div className="space-y-4 font-sans text-slate-900">
                  <div className="text-center space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-900 inline-block pb-0.5">
                      DAFTAR NILAI & REKAPITULASI EVALUASI BELAJAR MURID
                    </h2>
                    <p className="text-xs font-bold text-slate-800 uppercase">
                      MATA PELAJARAN: {mataPelajaran}
                    </p>
                  </div>

                  <div className="border border-slate-300 rounded p-2 text-xs grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50/50">
                    <div>Penilaian: <strong>{judulPenilaian}</strong></div>
                    <div>Kelas / Rombel: <strong>{selectedRombel === 'semua' ? 'Semua Rombel' : `Kelas ${selectedRombel}`}</strong></div>
                    <div>Semester: <strong>{schoolInfo.semester}</strong></div>
                    <div>Tahun Ajaran: <strong>{schoolInfo.tahunAjaran}</strong></div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-900 text-[10px]">
                      <thead className="bg-slate-100 font-bold uppercase text-[9px] text-center">
                        <tr>
                          <th className="border border-slate-900 px-1 py-1 w-6">No</th>
                          <th className="border border-slate-900 px-1.5 py-1 w-20">NISN</th>
                          <th className="border border-slate-900 px-2 py-1 text-left">Nama Murid</th>
                          <th className="border border-slate-900 px-1 py-1 w-6">L/P</th>
                          {gradeColumns.map((col, idx) => (
                            <th key={idx} className="border border-slate-900 px-2 py-1 min-w-16">
                              {col}
                            </th>
                          ))}
                          <th className="border border-slate-900 px-2 py-1 w-32 bg-amber-50 text-amber-950 font-bold">
                            Keterangan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rombelStudents.map((s, idx) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="border border-slate-900 px-1 py-1 text-center font-semibold">{idx + 1}</td>
                            <td className="border border-slate-900 px-1.5 py-1 text-center font-mono text-[9px]">
                              {s.nisn || '-'}
                            </td>
                            <td className="border border-slate-900 px-2 py-1 font-bold uppercase">
                              {s.namaSiswa}
                            </td>
                            <td className="border border-slate-900 px-1 py-1 text-center">
                              {s.jk === 'Laki-laki' ? 'L' : 'P'}
                            </td>
                            {gradeColumns.map((col, colIdx) => (
                              <td key={colIdx} className="border border-slate-900 p-0 text-center">
                                <input
                                  type="text"
                                  value={studentScores[s.id]?.[col] || ''}
                                  onChange={e => handleScoreChange(s.id, col, e.target.value)}
                                  className="w-full h-full px-1 py-1 text-center font-bold text-[10px] focus:outline-none focus:bg-amber-100 bg-transparent border-0"
                                />
                              </td>
                            ))}
                            <td className="border border-slate-900 p-0 bg-amber-50/30">
                              <input
                                type="text"
                                value={studentScores[s.id]?.['keterangan'] || ''}
                                onChange={e => handleScoreChange(s.id, 'keterangan', e.target.value)}
                                className="w-full h-full px-1.5 py-1 text-xs focus:outline-none focus:bg-amber-100 bg-transparent border-0 font-medium"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-6 flex justify-end px-8 text-xs font-sans">
                    <div className="text-center w-56 space-y-1">
                      <p>................, .....................</p>
                      <p className="font-bold">Guru / Wali Kelas {selectedRombel === 'semua' ? '' : selectedRombel}</p>
                      <div className="h-14 flex items-end justify-center">
                        <div>
                          <p className="font-bold underline uppercase">....................................</p>
                          <p className="text-[10px]">NIP. ....................................</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
