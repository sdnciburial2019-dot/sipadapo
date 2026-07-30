import * as XLSX from 'xlsx';
import { Student, SchoolInfo } from '../types';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import { DEFAULT_SCHOOL_INFO, ROMBEL_LIST } from '../data/dapodikOptions';
import { saveAllStudentsToFirestore, saveSchoolInfoToFirestore, clearAllStudentsFromFirestore } from '../lib/firebase';

const STORAGE_KEY_STUDENTS = 'sipa_dapodik_students_v1';
const STORAGE_KEY_SCHOOL = 'sipa_dapodik_school_v1';
const STORAGE_KEY_ROMBEL = 'sipa_dapodik_rombel_v1';

export function formatNisn(nisn: string | number | undefined | null): string {
  if (nisn === undefined || nisn === null) return '';
  let clean = String(nisn).trim();
  if (!clean) return '';
  
  // If 9 characters (or 9 digits), prepend '0' to make it 10 characters
  if (clean.length === 9) {
    clean = '0' + clean;
  } else if (/^\d+$/.test(clean) && clean.length > 0 && clean.length < 10) {
    clean = clean.padStart(10, '0');
  }
  
  return clean;
}

export function isStudentMutasi(s: Student): boolean {
  if (!s) return false;
  return s.statusSiswa === 'Mutasi Keluar' || s.rombel === 'Mutasi Keluar' || s.rombel === 'Mutasi';
}

export function isStudentAlumni(s: Student): boolean {
  if (!s) return false;
  return s.statusSiswa === 'Alumni' || s.rombel === 'Alumni' || s.rombel === 'Lulus' || s.rombel === 'Lulus / Alumni';
}

export function isStudentAktif(s: Student): boolean {
  if (!s) return true;
  return !isStudentMutasi(s) && !isStudentAlumni(s);
}

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (raw === null) {
      if (localStorage.getItem('sipa_dapodik_has_initialized') === 'true' || localStorage.getItem('sipa_dapodik_cleared') === 'true') {
        return [];
      }
      const formatted = INITIAL_STUDENTS.map(s => ({ ...s, nisn: formatNisn(s.nisn) }));
      saveStudents(formatted);
      return formatted;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : INITIAL_STUDENTS;
    return list.map((s: Student) => ({ ...s, nisn: formatNisn(s.nisn) }));
  } catch (err) {
    console.error('Error reading students from storage:', err);
    return [];
  }
}

export function saveStudents(students: Student[]): void {
  try {
    const formatted = students.map(s => ({ ...s, nisn: formatNisn(s.nisn) }));
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(formatted));
    localStorage.setItem('sipa_dapodik_has_initialized', 'true');
    if (formatted.length === 0) {
      localStorage.setItem('sipa_dapodik_cleared', 'true');
      clearAllStudentsFromFirestore().catch(err => {
        console.warn('Firestore async clear warning:', err);
      });
    } else {
      localStorage.removeItem('sipa_dapodik_cleared');
      saveAllStudentsToFirestore(formatted).catch(err => {
        console.warn('Firestore async sync warning:', err);
      });
    }
  } catch (err) {
    console.error('Error saving students to storage:', err);
  }
}

export function getStoredSchoolInfo(): SchoolInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCHOOL);
    if (!raw) return DEFAULT_SCHOOL_INFO;
    return { ...DEFAULT_SCHOOL_INFO, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SCHOOL_INFO;
  }
}

export function saveSchoolInfo(info: SchoolInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(info));
    saveSchoolInfoToFirestore(info).catch(err => {
      console.warn('Firestore school info sync warning:', err);
    });
  } catch (err) {
    console.error('Error saving school info:', err);
  }
}

export function getStoredRombelList(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROMBEL);
    if (!raw) return ROMBEL_LIST;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any) => String(item).trim()).filter(Boolean);
    }
    return ROMBEL_LIST;
  } catch (err) {
    return ROMBEL_LIST;
  }
}

export function saveRombelList(list: string[]): void {
  try {
    const cleanList = list.map(item => String(item).trim()).filter(Boolean);
    localStorage.setItem(STORAGE_KEY_ROMBEL, JSON.stringify(cleanList));
  } catch (err) {
    console.error('Error saving rombel list:', err);
  }
}

export function calculateStudentCompleteness(s: Student): { percentage: number; missing: string[] } {
  const fieldsToCheck: { name: string; key: keyof Student }[] = [
    { name: 'Rombel', key: 'rombel' },
    { name: 'Nama Siswa', key: 'namaSiswa' },
    { name: 'NIPD', key: 'nipd' },
    { name: 'Jenis Kelamin', key: 'jk' },
    { name: 'NISN', key: 'nisn' },
    { name: 'Tempat Tanggal Lahir', key: 'ttl' },
    { name: 'NIK Siswa', key: 'nik' },
    { name: 'Agama', key: 'agama' },
    { name: 'Alamat', key: 'alamat' },
    { name: 'Kecamatan', key: 'kecamatan' },
    { name: 'Kode Pos', key: 'kodePos' },
    { name: 'No HP Ortu/Siswa', key: 'hp' },
    { name: 'Nama Ayah', key: 'namaAyah' },
    { name: 'Pekerjaan Ayah', key: 'pekerjaanAyah' },
    { name: 'Penghasilan Ayah', key: 'penghasilanAyah' },
    { name: 'NIK Ayah', key: 'nikAyah' },
    { name: 'Nama Ibu', key: 'namaIbu' },
    { name: 'Pekerjaan Ibu', key: 'pekerjaanIbu' },
    { name: 'NIK Ibu', key: 'nikIbu' },
    { name: 'No KK', key: 'noKK' },
    { name: 'No Registrasi Akta Lahir', key: 'aktaLahir' },
    { name: 'Sekolah Asal', key: 'sekolahAsal' },
    { name: 'Tinggi Badan', key: 'tinggiBadan' },
    { name: 'Berat Badan', key: 'beratBadan' }
  ];

  const missing: string[] = [];
  let filledCount = 0;

  fieldsToCheck.forEach(f => {
    const val = s[f.key];
    if (val && String(val).trim().length > 0) {
      filledCount++;
    } else {
      missing.push(f.name);
    }
  });

  const percentage = Math.round((filledCount / fieldsToCheck.length) * 100);
  return { percentage, missing };
}

export function exportToExcel(students: Student[], fileName = 'data_siswa_dapodik.xlsx'): void {
  const data = students.map(s => ({
    'Rombel Saat Ini': s.rombel || '',
    'Nama Siswa': s.namaSiswa || '',
    'NIPD': s.nipd || '',
    'JK': s.jk || '',
    'NISN': s.nisn || '',
    'Tempat Tanggal Lahir': s.ttl || '',
    'NIK': s.nik || '',
    'Agama': s.agama || '',
    'Alamat': s.alamat || '',
    'Kecamatan': s.kecamatan || '',
    'Kode Pos': s.kodePos || '',
    'Jenis Tinggal': s.jenisTinggal || '',
    'Alat Transportasi': s.transportasi || '',
    'HP': s.hp || '',
    'Email': s.email || '',
    'Penerima KPS': s.penerimaKps || 'Tidak',
    'No. KPS': s.noKps || '',
    'Nama Ayah': s.namaAyah || '',
    'Tahun Lahir Ayah': s.tahunLahirAyah || '',
    'Pend. Ayah': s.pendAyah || '',
    'Pekerjaan Ayah': s.pekerjaanAyah || '',
    'Penghasilan Ayah': s.penghasilanAyah || '',
    'NIK Ayah': s.nikAyah || '',
    'Nama Ibu': s.namaIbu || '',
    'Tahun Lahir Ibu': s.tahunLahirIbu || '',
    'Pend. Ibu': s.pendIbu || '',
    'Pekerjaan Ibu': s.pekerjaanIbu || '',
    'Penghasilan Bulanan Ibu': s.penghasilanIbu || '',
    'NIK Ibu': s.nikIbu || '',
    'Penerima KIP': s.penerimaKip || 'Tidak',
    'Nomor KIP': s.nomorKip || '',
    'Nama di KIP': s.namaDiKip || '',
    'Nomor KKS': s.nomorKks || '',
    'No Registrasi Akta Lahir': s.aktaLahir || '',
    'Bank': s.bank || '',
    'Nomor Rekening Bank': s.noRekening || '',
    'Rekening Atas Nama': s.rekeningAtasNama || '',
    'Layak PIP': s.layakPip || 'Tidak',
    'Alasan Layak PIP': s.alasanLayakPip || '',
    'Sekolah Asal': s.sekolahAsal || '',
    'Anak ke': s.anakKe || '',
    'No KK': s.noKK || '',
    'Berat Badan': s.beratBadan || '',
    'Tinggi Badan': s.tinggiBadan || '',
    'Lingkar Kepala': s.lingkarKepala || '',
    'Jml. Saudara Kandung': s.jmlSaudara || '',
    'Jarak Rumah ke Sekolah': s.jarakSekolahKM || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
  XLSX.writeFile(workbook, fileName);
}

export function exportToCsv(students: Student[], fileName = 'data_siswa_dapodik.csv'): void {
  exportToExcel(students, fileName.replace(/\.csv$/, '.xlsx'));
}

export function downloadExcelTemplate(): void {
  const sampleData = [
    {
      'Rombel Saat Ini': '1 A',
      'Nama Siswa': 'ANDI PRASETYO',
      'NIPD': '262701001',
      'JK': 'Laki-laki',
      'NISN': '0123456789',
      'Tempat Tanggal Lahir': 'Bandung, 10 Mei 2018',
      'NIK': '3217011005180001',
      'Agama': 'Islam',
      'Alamat': 'Kp. Ciburial RT 01 RW 02 Desa Ciburial',
      'Kecamatan': 'Kec. Lembang',
      'Kode Pos': '40391',
      'Jenis Tinggal': 'Orang Tua',
      'Alat Transportasi': 'Motor',
      'HP': '081234567890',
      'Email': '',
      'Penerima KPS': 'Tidak',
      'No. KPS': '',
      'Nama Ayah': 'BUDI PRASETYO',
      'Tahun Lahir Ayah': '1985',
      'Pend. Ayah': 'SMA Sederajat',
      'Pekerjaan Ayah': 'Wiraswasta',
      'Penghasilan Ayah': '2.000.000 - 4.999.999',
      'NIK Ayah': '3217011005850001',
      'Nama Ibu': 'SITI AMINAH',
      'Tahun Lahir Ibu': '1988',
      'Pend. Ibu': 'SMA Sederajat',
      'Pekerjaan Ibu': 'Ibu Rumah Tangga',
      'Penghasilan Bulanan Ibu': 'Tidak Berpenghasilan',
      'NIK Ibu': '3217011005880002',
      'Penerima KIP': 'Tidak',
      'Nomor KIP': '',
      'Nama di KIP': '',
      'Nomor KKS': '',
      'No Registrasi Akta Lahir': '12345/DIS/2018',
      'Bank': '',
      'Nomor Rekening Bank': '',
      'Rekening Atas Nama': '',
      'Layak PIP': 'Tidak',
      'Alasan Layak PIP': '',
      'Sekolah Asal': 'TK Ciburial',
      'Anak ke': '1',
      'No KK': '3217011005180000',
      'Berat Badan': '22',
      'Tinggi Badan': '122',
      'Lingkar Kepala': '51',
      'Jml. Saudara Kandung': '1',
      'Jarak Rumah ke Sekolah': '0.5'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Siswa');
  XLSX.writeFile(workbook, 'template_import_siswa_dapodik.xlsx');
}

export function parseExcelFile(file: File): Promise<Partial<Student>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
        if (!rawRows || rawRows.length === 0) {
          resolve([]);
          return;
        }

        // Find header row or default to row 0
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
          const rowStr = (rawRows[i] || []).join(' ').toLowerCase();
          if (rowStr.includes('nama') || rowStr.includes('rombel') || rowStr.includes('nisn')) {
            headerRowIndex = i;
            break;
          }
        }

        const headers = (rawRows[headerRowIndex] || []).map((h: any) => String(h).trim().toLowerCase());
        const dataRows = rawRows.slice(headerRowIndex + 1).filter(r => r && r.some((c: any) => String(c).trim().length > 0));

        const getColIdx = (keywords: string[], defaultIdx: number) => {
          const idx = headers.findIndex((h: string) => keywords.some(kw => h.includes(kw)));
          return idx !== -1 ? idx : defaultIdx;
        };

        const idxRombel = getColIdx(['rombel'], 0);
        const idxNama = getColIdx(['nama siswa', 'nama lengkap', 'nama'], 1);
        const idxNipd = getColIdx(['nipd', 'nis'], 2);
        const idxJk = getColIdx(['jk', 'jenis kelamin'], 3);
        const idxNisn = getColIdx(['nisn'], 4);
        const idxTtl = getColIdx(['ttl', 'tempat tanggal lahir', 'tempat lahir'], 5);
        const idxNik = getColIdx(['nik'], 6);
        const idxAgama = getColIdx(['agama'], 7);
        const idxAlamat = getColIdx(['alamat'], 8);
        const idxKecamatan = getColIdx(['kecamatan'], 9);
        const idxKodePos = getColIdx(['kode pos', 'pos'], 10);
        const idxJenisTinggal = getColIdx(['jenis tinggal', 'tinggal'], 11);
        const idxTransportasi = getColIdx(['transportasi', 'alat transportasi'], 12);
        const idxHp = getColIdx(['hp', 'telepon', 'no. hp', 'no hp'], 13);
        const idxEmail = getColIdx(['email'], 14);
        const idxPenerimaKps = getColIdx(['penerima kps', 'kps'], 15);
        const idxNoKps = getColIdx(['no. kps', 'no kps'], 16);
        const idxNamaAyah = getColIdx(['nama ayah', 'ayah'], 17);
        const idxThnAyah = getColIdx(['tahun lahir ayah', 'thn lahir ayah'], 18);
        const idxPendAyah = getColIdx(['pend. ayah', 'pendidikan ayah'], 19);
        const idxPekAyah = getColIdx(['pekerjaan ayah', 'pek ayah'], 20);
        const idxPengAyah = getColIdx(['penghasilan ayah'], 21);
        const idxNikAyah = getColIdx(['nik ayah'], 22);
        const idxNamaIbu = getColIdx(['nama ibu', 'ibu'], 23);
        const idxThnIbu = getColIdx(['tahun lahir ibu', 'thn lahir ibu'], 24);
        const idxPendIbu = getColIdx(['pend. ibu', 'pendidikan ibu'], 25);
        const idxPekIbu = getColIdx(['pekerjaan ibu', 'pek ibu'], 26);
        const idxPengIbu = getColIdx(['penghasilan ibu', 'penghasilan bulanan ibu'], 27);
        const idxNikIbu = getColIdx(['nik ibu'], 28);
        const idxPenerimaKip = getColIdx(['penerima kip', 'kip'], 29);
        const idxNomorKip = getColIdx(['nomor kip', 'no kip'], 30);
        const idxAkta = getColIdx(['akta lahir', 'no registrasi akta'], 33);
        const idxLayakPip = getColIdx(['layak pip', 'pip'], 37);
        const idxAlasanPip = getColIdx(['alasan layak pip'], 38);
        const idxSekolahAsal = getColIdx(['sekolah asal'], 39);
        const idxAnakKe = getColIdx(['anak ke'], 40);
        const idxNoKK = getColIdx(['no kk', 'nomor kk'], 41);
        const idxBerat = getColIdx(['berat badan', 'bb'], 42);
        const idxTinggi = getColIdx(['tinggi badan', 'tb'], 43);
        const idxLingkar = getColIdx(['lingkar kepala'], 44);
        const idxSaudara = getColIdx(['saudara'], 45);
        const idxJarak = getColIdx(['jarak'], 46);

        const students: Partial<Student>[] = dataRows.map((cols: any[], idx: number) => {
          const val = (i: number) => (cols[i] !== undefined && cols[i] !== null ? String(cols[i]).trim() : '');

          const jkVal = val(idxJk).toLowerCase();
          const jk = (jkVal.startsWith('l') ? 'Laki-laki' : 'Perempuan') as 'Laki-laki' | 'Perempuan';

          return {
            id: `std-imp-${Date.now()}-${idx}`,
            rombel: val(idxRombel) || '1 A',
            namaSiswa: val(idxNama) || `Siswa Baru ${idx + 1}`,
            nipd: val(idxNipd),
            jk,
            nisn: formatNisn(val(idxNisn)),
            ttl: val(idxTtl),
            nik: val(idxNik),
            agama: val(idxAgama) || 'Islam',
            alamat: val(idxAlamat),
            kecamatan: val(idxKecamatan) || 'Kec. Lembang',
            kodePos: val(idxKodePos) || '40391',
            jenisTinggal: val(idxJenisTinggal) || 'Orang Tua',
            transportasi: val(idxTransportasi) || 'Motor',
            hp: val(idxHp),
            email: val(idxEmail),
            penerimaKps: val(idxPenerimaKps).toLowerCase() === 'ya' ? 'Ya' : 'Tidak',
            noKps: val(idxNoKps),
            namaAyah: val(idxNamaAyah),
            tahunLahirAyah: val(idxThnAyah),
            pendAyah: val(idxPendAyah) || 'SMA Sederajat',
            pekerjaanAyah: val(idxPekAyah) || 'Buruh',
            penghasilanAyah: val(idxPengAyah) || '1.000.000 - 1.999.999',
            nikAyah: val(idxNikAyah),
            namaIbu: val(idxNamaIbu),
            tahunLahirIbu: val(idxThnIbu),
            pendIbu: val(idxPendIbu) || 'SMA Sederajat',
            pekerjaanIbu: val(idxPekIbu) || 'Tidak Bekerja',
            penghasilanIbu: val(idxPengIbu) || 'Tidak Berpenghasilan',
            nikIbu: val(idxNikIbu),
            penerimaKip: val(idxPenerimaKip).toLowerCase() === 'ya' ? 'Ya' : 'Tidak',
            nomorKip: val(idxNomorKip),
            aktaLahir: val(idxAkta),
            layakPip: val(idxLayakPip).toLowerCase() === 'ya' ? 'Ya' : 'Tidak',
            alasanLayakPip: val(idxAlasanPip),
            sekolahAsal: val(idxSekolahAsal) || 'RA/TK',
            anakKe: val(idxAnakKe) || '1',
            noKK: val(idxNoKK),
            beratBadan: val(idxBerat) || '20',
            tinggiBadan: val(idxTinggi) || '120',
            lingkarKepala: val(idxLingkar) || '50',
            jmlSaudara: val(idxSaudara) || '0',
            jarakSekolahKM: val(idxJarak) || '0.5'
          };
        });

        resolve(students);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function parseTsvOrCsv(text: string): Partial<Student>[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const firstLine = lines[0];
  const sep = firstLine.includes('\t') ? '\t' : ',';

  const isHeader = firstLine.toLowerCase().includes('nama') || firstLine.toLowerCase().includes('rombel');
  const dataLines = isHeader ? lines.slice(1) : lines;

  return dataLines.map((line, idx) => {
    const cols = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''));
    return {
      id: `std-imp-${Date.now()}-${idx}`,
      rombel: cols[0] || '1 A',
      namaSiswa: cols[1] || `Siswa Baru ${idx + 1}`,
      nipd: cols[2] || '',
      jk: (cols[3] && cols[3].toLowerCase().startsWith('l') ? 'Laki-laki' : 'Perempuan') as any,
      nisn: formatNisn(cols[4]),
      ttl: cols[5] || '',
      nik: cols[6] || '',
      agama: cols[7] || 'Islam',
      alamat: cols[8] || '',
      kecamatan: cols[9] || 'Kec. Lembang',
      kodePos: cols[10] || '40391',
      jenisTinggal: cols[11] || 'Orang Tua',
      transportasi: cols[12] || 'Motor',
      hp: cols[14] || cols[13] || '',
      email: cols[15] || '',
      penerimaKps: (cols[17] && cols[17].toLowerCase() === 'ya' ? 'Ya' : 'Tidak'),
      noKps: cols[18] || '',
      namaAyah: cols[19] || '',
      tahunLahirAyah: cols[20] || '',
      pendAyah: cols[21] || 'SMA Sederajat',
      pekerjaanAyah: cols[22] || 'Buruh',
      penghasilanAyah: cols[23] || '1.000.000 - 1.999.999',
      nikAyah: cols[24] || '',
      namaIbu: cols[25] || '',
      tahunLahirIbu: cols[26] || '',
      pendIbu: cols[27] || 'SMA Sederajat',
      pekerjaanIbu: cols[28] || 'Tidak Bekerja',
      penghasilanIbu: cols[29] || 'Tidak Berpenghasilan',
      nikIbu: cols[30] || '',
      aktaLahir: cols[43] || '',
      layakPip: (cols[47] && cols[47].toLowerCase() === 'ya' ? 'Ya' : 'Tidak'),
      alasanLayakPip: cols[48] || '',
      sekolahAsal: cols[50] || 'RA/TK',
      anakKe: cols[51] || '1',
      noKK: cols[54] || '',
      beratBadan: cols[55] || '20',
      tinggiBadan: cols[56] || '120',
      lingkarKepala: cols[57] || '50',
      jmlSaudara: cols[58] || '0',
      jarakSekolahKM: cols[59] || '0.5'
    };
  });
}

