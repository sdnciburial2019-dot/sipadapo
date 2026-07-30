import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  User, 
  MapPin, 
  Users, 
  Award, 
  School, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types';
import { formatNisn, getStoredRombelList } from '../utils/storage';
import { 
  ROMBEL_LIST, 
  AGAMA_LIST, 
  PENDIDIKAN_LIST, 
  PEKERJAAN_LIST, 
  PENGHASILAN_LIST, 
  TRANSPORTASI_LIST, 
  JENIS_TINGGAL_LIST,
  ALASAN_LAYAK_PIP_LIST 
} from '../data/dapodikOptions';

interface StudentFormModalProps {
  student: Student | null; // null for new student
  onClose: () => void;
  onSave: (studentData: Student) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  student,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Student>({
    id: student?.id || `std-${Date.now()}`,
    rombel: student?.rombel || '1 A',
    namaSiswa: student?.namaSiswa || '',
    nipd: student?.nipd || '',
    jk: student?.jk || 'Laki-laki',
    nisn: student?.nisn || '',
    ttl: student?.ttl || '',
    nik: student?.nik || '',
    agama: student?.agama || 'Islam',
    alamat: student?.alamat || '',
    kecamatan: student?.kecamatan || 'Kec. Lembang',
    kodePos: student?.kodePos || '40391',
    jenisTinggal: student?.jenisTinggal || 'Orang Tua',
    transportasi: student?.transportasi || 'Motor',
    telepon: student?.telepon || '',
    hp: student?.hp || '',
    email: student?.email || '',
    penerimaKps: student?.penerimaKps || 'Tidak',
    noKps: student?.noKps || '',
    namaAyah: student?.namaAyah || '',
    tahunLahirAyah: student?.tahunLahirAyah || '',
    pendAyah: student?.pendAyah || 'SMA Sederajat',
    pekerjaanAyah: student?.pekerjaanAyah || 'Buruh',
    penghasilanAyah: student?.penghasilanAyah || '1.000.000 - 1.999.999',
    nikAyah: student?.nikAyah || '',
    namaIbu: student?.namaIbu || '',
    tahunLahirIbu: student?.tahunLahirIbu || '',
    pendIbu: student?.pendIbu || 'SMA Sederajat',
    pekerjaanIbu: student?.pekerjaanIbu || 'Tidak Bekerja',
    penghasilanIbu: student?.penghasilanIbu || 'Tidak Berpenghasilan',
    nikIbu: student?.nikIbu || '',
    namaWali: student?.namaWali || '',
    tahunLahirWali: student?.tahunLahirWali || '',
    pendWali: student?.pendWali || '',
    pekerjaanWali: student?.pekerjaanWali || '',
    penghasilanWali: student?.penghasilanWali || '',
    nikWali: student?.nikWali || '',
    noPesertaUN: student?.noPesertaUN || '',
    noSeriIjazah: student?.noSeriIjazah || '',
    penerimaKip: student?.penerimaKip || 'Tidak',
    nomorKip: student?.nomorKip || '',
    namaDiKip: student?.namaDiKip || '',
    nomorKks: student?.nomorKks || '',
    aktaLahir: student?.aktaLahir || '',
    bank: student?.bank || '',
    noRekening: student?.noRekening || '',
    rekeningAtasNama: student?.rekeningAtasNama || '',
    layakPip: student?.layakPip || 'Tidak',
    alasanLayakPip: student?.alasanLayakPip || '',
    kebutuhanKhusus: student?.kebutuhanKhusus || '',
    sekolahAsal: student?.sekolahAsal || 'RA/TK',
    anakKe: student?.anakKe || '1',
    noKK: student?.noKK || '',
    beratBadan: student?.beratBadan || '20',
    tinggiBadan: student?.tinggiBadan || '120',
    lingkarKepala: student?.lingkarKepala || '50',
    jmlSaudara: student?.jmlSaudara || '0',
    jarakSekolahKM: student?.jarakSekolahKM || '0.5',
    fotoUrl: student?.fotoUrl || '',
  });

  const [activeStep, setActiveStep] = useState<'pribadi' | 'alamat' | 'ortu' | 'pip' | 'fisik'>('pribadi');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (key: keyof Student, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNisnBlur = () => {
    if (formData.nisn) {
      setFormData(prev => ({ ...prev, nisn: formatNisn(prev.nisn) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaSiswa.trim()) {
      setErrorMsg('Nama Murid wajib diisi.');
      setActiveStep('pribadi');
      return;
    }
    if (!formData.rombel) {
      setErrorMsg('Rombel (Kelas) wajib dipilih.');
      setActiveStep('pribadi');
      return;
    }

    const formattedNisn = formatNisn(formData.nisn);

    onSave({
      ...formData,
      nisn: formattedNisn,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 relative border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              {student ? 'Edit Data Murid' : 'Tambah Murid Baru (Dapodik)'}
            </h2>
            <p className="text-xs text-slate-400">Lengkapi formulir standar Dapodik sekolah secara akurat.</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Navigation Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveStep('pribadi')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeStep === 'pribadi' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            1. Data Pribadi
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('alamat')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeStep === 'alamat' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            2. Alamat & Kontak
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('ortu')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeStep === 'ortu' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            3. Orang Tua & Wali
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('pip')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeStep === 'pip' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            4. Bantuan & PIP
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('fisik')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeStep === 'fisik' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            5. Fisik & Dokumen
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form id="form-student" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {/* STEP 1: DATA PRIBADI */}
          {activeStep === 'pribadi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Nama Siswa Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.namaSiswa}
                  onChange={e => handleChange('namaSiswa', e.target.value)}
                  placeholder="Contoh: AGHNIA PUTRI SUBAGJA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Rombel (Kelas) Saat Ini *</label>
                <select
                  value={formData.rombel}
                  onChange={e => handleChange('rombel', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <optgroup label="--- Rombel (Kelas) ---">
                    {getStoredRombelList().map(r => (
                      <option key={r} value={r}>Kelas {r}</option>
                    ))}
                  </optgroup>
                  <optgroup label="--- Kelulusan & Mutasi ---">
                    <option value="Mutasi Keluar">📤 Mutasi Keluar</option>
                    <option value="Alumni">🎓 Alumni / Lulus</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Jenis Kelamin</label>
                <select
                  value={formData.jk}
                  onChange={e => handleChange('jk', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">NISN (10 Digit)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.nisn}
                  onChange={e => handleChange('nisn', e.target.value)}
                  onBlur={handleNisnBlur}
                  placeholder="Contoh: 0320552988"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <p className="text-[10px] text-emerald-600 mt-1 font-medium">
                  NISN wajib 10 digit (jika diisi 9 digit, otomatis ditambah angka '0' di depan)
                </p>
              </div>

              <div>
                <label className="font-semibold block mb-1">NIPD (Nomor Induk Peserta Didik)</label>
                <input
                  type="text"
                  value={formData.nipd}
                  onChange={e => handleChange('nipd', e.target.value)}
                  placeholder="Contoh: 262701002"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">NIK Siswa (16 Digit)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.nik}
                  onChange={e => handleChange('nik', e.target.value)}
                  placeholder="Contoh: 3217015003200007"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Tempat, Tanggal Lahir</label>
                <input
                  type="text"
                  value={formData.ttl}
                  onChange={e => handleChange('ttl', e.target.value)}
                  placeholder="Contoh: Bandung, 10 Maret 2020"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Agama</label>
                <select
                  value={formData.agama}
                  onChange={e => handleChange('agama', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {AGAMA_LIST.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">No. Registrasi Akta Lahir</label>
                <input
                  type="text"
                  value={formData.aktaLahir}
                  onChange={e => handleChange('aktaLahir', e.target.value)}
                  placeholder="Contoh: 3217-LT-26032025-0010"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Anak Ke- Berapa</label>
                <input
                  type="number"
                  value={formData.anakKe}
                  onChange={e => handleChange('anakKe', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 2: ALAMAT & KONTAK */}
          {activeStep === 'alamat' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="font-semibold block mb-1">Alamat Jalan / Kp / RT / RW</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={e => handleChange('alamat', e.target.value)}
                  placeholder="Kp. Ciburial RT 03 RW 05 Desa Cibogo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={e => handleChange('kecamatan', e.target.value)}
                  placeholder="Kec. Lembang"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={e => handleChange('kodePos', e.target.value)}
                  placeholder="40391"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">No. HP / WhatsApp Orang Tua</label>
                <input
                  type="text"
                  value={formData.hp}
                  onChange={e => handleChange('hp', e.target.value)}
                  placeholder="085137265476"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="sandisubagja1998@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Jenis Tempat Tinggal</label>
                <select
                  value={formData.jenisTinggal}
                  onChange={e => handleChange('jenisTinggal', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {JENIS_TINGGAL_LIST.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Alat Transportasi</label>
                <select
                  value={formData.transportasi}
                  onChange={e => handleChange('transportasi', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {TRANSPORTASI_LIST.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Jarak Rumah ke Sekolah (KM)</label>
                <input
                  type="text"
                  value={formData.jarakSekolahKM}
                  onChange={e => handleChange('jarakSekolahKM', e.target.value)}
                  placeholder="0.5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 3: ORANG TUA */}
          {activeStep === 'ortu' && (
            <div className="space-y-6">
              {/* Ayah */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-1">Data Ayah Kandung</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Nama Ayah</label>
                    <input
                      type="text"
                      value={formData.namaAyah}
                      onChange={e => handleChange('namaAyah', e.target.value)}
                      placeholder="Sandi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">NIK Ayah (16 Digit)</label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.nikAyah}
                      onChange={e => handleChange('nikAyah', e.target.value)}
                      placeholder="3217012505980012"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Tahun Lahir Ayah</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.tahunLahirAyah}
                      onChange={e => handleChange('tahunLahirAyah', e.target.value)}
                      placeholder="1998"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Pendidikan Ayah</label>
                    <select
                      value={formData.pendAyah}
                      onChange={e => handleChange('pendAyah', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {PENDIDIKAN_LIST.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Pekerjaan Ayah</label>
                    <select
                      value={formData.pekerjaanAyah}
                      onChange={e => handleChange('pekerjaanAyah', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {PEKERJAAN_LIST.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Penghasilan Ayah</label>
                    <select
                      value={formData.penghasilanAyah}
                      onChange={e => handleChange('penghasilanAyah', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {PENGHASILAN_LIST.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ibu */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-1">Data Ibu Kandung</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Nama Ibu</label>
                    <input
                      type="text"
                      value={formData.namaIbu}
                      onChange={e => handleChange('namaIbu', e.target.value)}
                      placeholder="Eva Oktaviani"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">NIK Ibu (16 Digit)</label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.nikIbu}
                      onChange={e => handleChange('nikIbu', e.target.value)}
                      placeholder="3217016810990021"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Tahun Lahir Ibu</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.tahunLahirIbu}
                      onChange={e => handleChange('tahunLahirIbu', e.target.value)}
                      placeholder="1999"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Pendidikan Ibu</label>
                    <select
                      value={formData.pendIbu}
                      onChange={e => handleChange('pendIbu', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {PENDIDIKAN_LIST.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Pekerjaan Ibu</label>
                    <select
                      value={formData.pekerjaanIbu}
                      onChange={e => handleChange('pekerjaanIbu', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {PEKERJAAN_LIST.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Penghasilan Ibu</label>
                    <select
                      value={formData.penghasilanIbu}
                      onChange={e => handleChange('penghasilanIbu', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {PENGHASILAN_LIST.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BANTUAN & PIP */}
          {activeStep === 'pip' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Penerima KPS / PKH</label>
                <select
                  value={formData.penerimaKps}
                  onChange={e => handleChange('penerimaKps', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Tidak">Tidak</option>
                  <option value="Ya">Ya</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Nomor KPS / PKH (Jika Ya)</label>
                <input
                  type="text"
                  value={formData.noKps}
                  onChange={e => handleChange('noKps', e.target.value)}
                  placeholder="KPS-3217-0891"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Penerima KIP (Kartu Indonesia Pintar)</label>
                <select
                  value={formData.penerimaKip}
                  onChange={e => handleChange('penerimaKip', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Tidak">Tidak</option>
                  <option value="Ya">Ya</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Nomor KIP (Jika Ya)</label>
                <input
                  type="text"
                  value={formData.nomorKip}
                  onChange={e => handleChange('nomorKip', e.target.value)}
                  placeholder="KIP-3217-0029"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Layak PIP (Usulan dari Sekolah)</label>
                <select
                  value={formData.layakPip}
                  onChange={e => handleChange('layakPip', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="Tidak">Tidak</option>
                  <option value="Ya">Ya (Usulkan PIP)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Alasan Layak PIP</label>
                <select
                  value={formData.alasanLayakPip}
                  onChange={e => handleChange('alasanLayakPip', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">-- Pilih Alasan --</option>
                  {ALASAN_LAYAK_PIP_LIST.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Nama Bank Penyalur PIP</label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={e => handleChange('bank', e.target.value)}
                  placeholder="BRI / Mandiri / BNI"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Nomor Rekening Bank</label>
                <input
                  type="text"
                  value={formData.noRekening}
                  onChange={e => handleChange('noRekening', e.target.value)}
                  placeholder="0192-01-029103-53-1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 5: FISIK & DOKUMEN */}
          {activeStep === 'fisik' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Nomor Kartu Keluarga (KK)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.noKK}
                  onChange={e => handleChange('noKK', e.target.value)}
                  placeholder="3217011103200012"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Sekolah Asal (PAUD/TK)</label>
                <input
                  type="text"
                  value={formData.sekolahAsal}
                  onChange={e => handleChange('sekolahAsal', e.target.value)}
                  placeholder="RA/BA/TA AL-IKHLAS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  value={formData.tinggiBadan}
                  onChange={e => handleChange('tinggiBadan', e.target.value)}
                  placeholder="117"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Berat Badan (kg)</label>
                <input
                  type="number"
                  value={formData.beratBadan}
                  onChange={e => handleChange('beratBadan', e.target.value)}
                  placeholder="18"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Lingkar Kepala (cm)</label>
                <input
                  type="number"
                  value={formData.lingkarKepala}
                  onChange={e => handleChange('lingkarKepala', e.target.value)}
                  placeholder="50"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Jumlah Saudara Kandung</label>
                <input
                  type="number"
                  value={formData.jmlSaudara}
                  onChange={e => handleChange('jmlSaudara', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Batal
          </button>

          <div className="flex items-center space-x-2">
            {activeStep !== 'pribadi' && (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 'alamat') setActiveStep('pribadi');
                  if (activeStep === 'ortu') setActiveStep('alamat');
                  if (activeStep === 'pip') setActiveStep('ortu');
                  if (activeStep === 'fisik') setActiveStep('pip');
                }}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Sebelumnya
              </button>
            )}

            {activeStep !== 'fisik' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 'pribadi') setActiveStep('alamat');
                  else if (activeStep === 'alamat') setActiveStep('ortu');
                  else if (activeStep === 'ortu') setActiveStep('pip');
                  else if (activeStep === 'pip') setActiveStep('fisik');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Data Siswa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
