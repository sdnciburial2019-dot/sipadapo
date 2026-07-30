export type Gender = 'Laki-laki' | 'Perempuan';

export type StudentStatus = 'Aktif' | 'Mutasi Keluar' | 'Alumni';

export interface Student {
  id: string;
  rombel: string; // e.g., '1 A', '1 B', '2 A', '3 A', '4 A', '5 A', '6 A', 'Mutasi Keluar', 'Alumni'
  statusSiswa?: StudentStatus;
  namaSiswa: string;
  nipd: string;
  jk: Gender;
  nisn: string;
  ttl: string; // Tempat Tanggal Lahir, e.g. "Bandung, 10 Maret 2020"
  nik: string;
  agama: string;
  alamat: string;
  kecamatan: string;
  kodePos: string;
  jenisTinggal: string;
  transportasi: string;
  telepon?: string;
  hp: string;
  email: string;
  skhun?: string;
  penerimaKps: 'Ya' | 'Tidak';
  noKps?: string;
  
  // Data Ayah
  namaAyah: string;
  tahunLahirAyah: string;
  pendAyah: string;
  pekerjaanAyah: string;
  penghasilanAyah: string;
  nikAyah: string;
  
  // Data Ibu
  namaIbu: string;
  tahunLahirIbu: string;
  pendIbu: string;
  pekerjaanIbu: string;
  penghasilanIbu: string;
  nikIbu: string;
  
  // Data Wali
  namaWali?: string;
  tahunLahirWali?: string;
  pendWali?: string;
  pekerjaanWali?: string;
  penghasilanWali?: string;
  nikWali?: string;

  // Ujian & Ijazah
  noPesertaUN?: string;
  noSeriIjazah?: string;

  // Beasiswa & PIP
  penerimaKip: 'Ya' | 'Tidak';
  nomorKip?: string;
  namaDiKip?: string;
  nomorKks?: string;
  aktaLahir?: string;

  // Bank
  bank?: string;
  noRekening?: string;
  rekeningAtasNama?: string;

  // PIP Usulan
  layakPip: 'Ya' | 'Tidak';
  alasanLayakPip?: string;

  // Lainnya
  kebutuhanKhusus?: string;
  sekolahAsal: string;
  anakKe: string;
  lintang?: string;
  bujur?: string;
  noKK: string;
  beratBadan: string; // kg
  tinggiBadan: string; // cm
  lingkarKepala?: string; // cm
  jmlSaudara: string;
  jarakSekolahKM?: string; // km
  
  // Custom internal fields
  fotoUrl?: string;
  updatedAt?: string;
}

export interface SchoolInfo {
  name: string;
  npsn: string;
  address: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  email: string;
  phone: string;
  kepalaSekolah: string;
  nipKepala: string;
  tahunAjaran: string; // e.g. "2025/2026"
  semester: 'Ganjil' | 'Genap';
  logoUrl?: string;
  logoPemda?: string;
  logoSekolah?: string;
}

export interface FilterOptions {
  search: string;
  rombel: string;
  jk: string;
  pipStatus: string;
  agama: string;
  dataCompleteness: 'all' | 'complete' | 'incomplete';
}

export interface AiAnalysisResult {
  completenessScore: number;
  statusAlert: string;
  missingFields: string[];
  dataWarnings: string[];
  pipAssessment?: {
    recommended: boolean;
    reason: string;
  };
  summaryNotes: string;
}

export interface GeneratedLetter {
  nomorSurat: string;
  perihal: string;
  pembuka: string;
  isiPerernyataan: string;
  penutup: string;
  tujuanMaksud: string;
}
