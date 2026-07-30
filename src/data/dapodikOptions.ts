export const ROMBEL_LIST = [
  '1 A', '1 B', '2 A', '2 B', '3 A', '3 B', 
  '4 A', '4 B', '5 A', '5 B', '6 A', '6 B'
];

export const AGAMA_LIST = [
  'Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu', 'Lainnya'
];

export const PENDIDIKAN_LIST = [
  'Tidak Sekolah', 'SD Sederajat', 'SMP Sederajat', 'SMA Sederajat', 
  'D1/D2/D3', 'D4/S1', 'S2', 'S3'
];

export const PEKERJAAN_LIST = [
  'Tidak Bekerja', 'Buruh', 'Tani', 'Wiraswasta', 'Karyawan Swasta', 
  'PNS/TNI/Polri', 'Pedagang', 'Peternak', 'Nelayan', 'Lainnya'
];

export const PENGHASILAN_LIST = [
  'Tidak Berpenghasilan',
  'Kurang dari 500.000',
  '500.000 - 999.999',
  '1.000.000 - 1.999.999',
  '2.000.000 - 4.999.999',
  '5.000.000 - 20.000.000',
  'Lebih dari 20.000.000'
];

export const TRANSPORTASI_LIST = [
  'Jalan Kaki', 'Motor', 'Jemputan Sekolah', 'Angkutan Umum', 'Sepeda', 'Mobil Pribadi', 'Lainnya'
];

export const JENIS_TINGGAL_LIST = [
  'Orang Tua', 'Wali', 'Kos', 'Asrama', 'Panti Asuhan', 'Lainnya'
];

export const ALASAN_LAYAK_PIP_LIST = [
  'Pemegang PKH / KPS / KIP',
  'Penghasilan Ortu < 1 Juta',
  'Siswa Yatim / Piatu / Yatim Piatu',
  'Dampak Bencana Alam',
  'Rentan Putus Sekolah',
  'Lainnya'
];

export const DEFAULT_SCHOOL_INFO = {
  name: "SD NEGERI CIBURIAL",
  npsn: "20202931",
  address: "Jalan Ciburial Tengah No. 12 Desa Cibogo",
  kecamatan: "Kec. Lembang",
  kabupaten: "Kab. Bandung Barat",
  provinsi: "Jawa Barat",
  kodePos: "40391",
  email: "sdnegericiburial@gmail.com",
  phone: "022-2786500",
  kepalaSekolah: "Hj. Nina Marlina, M.Pd.",
  nipKepala: "197204151996032002",
  tahunAjaran: "2025/2026",
  semester: "Ganjil" as const
};
