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

export type PtkType = 'Guru Kelas' | 'Guru Mapel' | 'Guru BK' | 'Guru Inklusi' | 'Kepala Sekolah' | 'Tenaga Administrasi' | 'Penjaga Sekolah' | 'Lainnya';
export type StatusKepegawaian = 'PNS' | 'PPPK' | 'GTT/GTY' | 'Honor Daerah' | 'PTT' | 'Lainnya';

export interface Teacher {
  id: string;
  nama: string;
  nuptk: string;
  jk: 'L' | 'P' | 'Laki-laki' | 'Perempuan' | string;
  tempatLahir: string;
  tanggalLahir: string;
  nip: string;
  statusKepegawaian: StatusKepegawaian | string;
  jenisPtk: PtkType | string;
  agama: string;
  alamatJalan: string;
  rt: string;
  rw: string;
  dusun: string;
  desa: string;
  kecamatan: string;
  kodePos: string;
  telepon: string;
  hp: string;
  email: string;
  tugasTambahan: string;
  skCpns: string;
  tanggalCpns: string;
  skPengangkatan: string;
  tmtPengangkatan: string;
  lembagaPengangkatan: string;
  pangkatGolongan: string;
  sumberGaji: string;
  namaIbuKandung: string;
  statusPerkawinan: string;
  namaSuamiIstri: string;
  nipSuamiIstri: string;
  pekerjaanSuamiIstri: string;
  tmtPns: string;
  lisensiKepalaSekolah: string;
  diklatKepengawasan: string;
  keahlianBraille: string;
  keahlianBahasaIsyarat: string;
  npwp: string;
  namaWajibPajak: string;
  kewarganegaraan: string;
  bank: string;
  noRekening: string;
  rekeningAtasNama: string;
  nik: string;
  noKk: string;
  karpeg: string;
  karisKarsu: string;
  lintang: string;
  bujur: string;
  nuks: string;
  fotoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

