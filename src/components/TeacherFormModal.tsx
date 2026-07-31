import React, { useState } from 'react';
import { X, User, Briefcase, MapPin, CreditCard, Save } from 'lucide-react';
import { Teacher } from '../types';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  teacherToEdit?: Teacher | null;
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacherToEdit
}) => {
  const [activeTab, setActiveTab] = useState<'identitas' | 'kepegawaian' | 'alamat' | 'keuangan'>('identitas');

  const [formData, setFormData] = useState<Partial<Teacher>>(() => {
    if (teacherToEdit) return { ...teacherToEdit };
    return {
      id: `ptk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      nama: '',
      nuptk: '',
      jk: 'Laki-laki',
      tempatLahir: '',
      tanggalLahir: '',
      nip: '',
      statusKepegawaian: 'PNS',
      jenisPtk: 'Guru Kelas',
      agama: 'Islam',
      alamatJalan: '',
      rt: '',
      rw: '',
      dusun: '',
      desa: '',
      kecamatan: 'Kec. Lembang',
      kodePos: '40391',
      telepon: '',
      hp: '',
      email: '',
      tugasTambahan: '',
      skCpns: '',
      tanggalCpns: '',
      skPengangkatan: '',
      tmtPengangkatan: '',
      lembagaPengangkatan: 'Pemerintah Kab/Kota',
      pangkatGolongan: 'III/a',
      sumberGaji: 'APBN',
      namaIbuKandung: '',
      statusPerkawinan: 'Kawin',
      namaSuamiIstri: '',
      nipSuamiIstri: '',
      pekerjaanSuamiIstri: '',
      tmtPns: '',
      lisensiKepalaSekolah: 'Tidak',
      diklatKepengawasan: 'Tidak',
      keahlianBraille: 'Tidak',
      keahlianBahasaIsyarat: 'Tidak',
      npwp: '',
      namaWajibPajak: '',
      kewarganegaraan: 'ID',
      bank: 'Bank Jabar Banten (BJB)',
      noRekening: '',
      rekeningAtasNama: '',
      nik: '',
      noKk: '',
      karpeg: '',
      karisKarsu: '',
      lintang: '',
      bujur: '',
      nuks: '',
      fotoUrl: ''
    };
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || formData.nama.trim() === '') {
      alert('Nama Guru/PTK wajib diisi!');
      return;
    }
    onSave(formData as Teacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <User className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {teacherToEdit ? 'Edit Data Guru & PTK' : 'Tambah Guru & PTK Baru'}
              </h2>
              <p className="text-xs text-emerald-100/80">
                Lengkapi rincian formulir Pendidik dan Tenaga Kependidikan Dapodik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('identitas')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'identitas'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            1. Identitas Diri
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kepegawaian')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'kepegawaian'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            2. Kepegawaian & Tugas
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alamat')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'alamat'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            3. Alamat & Kontak
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keuangan')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'keuangan'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            4. Keuangan & Lainnya
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: IDENTITAS DIRI */}
          {activeTab === 'identitas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap (Sesuai Ijazah/KTP) *</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama || ''}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Della Juliana Rismalinda, S.Pd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NUPTK</label>
                <input
                  type="text"
                  name="nuptk"
                  value={formData.nuptk || ''}
                  onChange={handleChange}
                  placeholder="16 digit NUPTK"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIK (No. KTP)</label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik || ''}
                  onChange={handleChange}
                  placeholder="16 digit NIK"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                <input
                  type="text"
                  name="noKk"
                  value={formData.noKk || ''}
                  onChange={handleChange}
                  placeholder="16 digit No. KK"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  name="jk"
                  value={formData.jk || 'Laki-laki'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Laki-laki">Laki-laki (L)</option>
                  <option value="Perempuan">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agama</label>
                <select
                  name="agama"
                  value={formData.agama || 'Islam'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir || ''}
                  onChange={handleChange}
                  placeholder="Kota / Kabupaten Lahir"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Ibu Kandung</label>
                <input
                  type="text"
                  name="namaIbuKandung"
                  value={formData.namaIbuKandung || ''}
                  onChange={handleChange}
                  placeholder="Nama Ibu Kandung"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Foto Pas (3x4)</label>
                <input
                  type="text"
                  name="fotoUrl"
                  value={formData.fotoUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/foto.jpg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: KEPEGAWAIAN & TUGAS */}
          {activeTab === 'kepegawaian' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP (Jika PNS/PPPK)</label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip || ''}
                  onChange={handleChange}
                  placeholder="18 digit NIP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Kepegawaian</label>
                <select
                  name="statusKepegawaian"
                  value={formData.statusKepegawaian || 'PNS'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="GTT/GTY">GTT/GTY (Guru Tidak Tetap)</option>
                  <option value="Honor Daerah">Honor Daerah</option>
                  <option value="PTT">PTT (Pegawai Tidak Tetap)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis PTK</label>
                <select
                  name="jenisPtk"
                  value={formData.jenisPtk || 'Guru Kelas'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="Guru Kelas">Guru Kelas</option>
                  <option value="Guru Mapel">Guru Mapel</option>
                  <option value="Guru BK">Guru BK</option>
                  <option value="Guru Inklusi">Guru Inklusi</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Tenaga Administrasi">Tenaga Administrasi</option>
                  <option value="Penjaga Sekolah">Penjaga Sekolah</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tugas Tambahan</label>
                <input
                  type="text"
                  name="tugasTambahan"
                  value={formData.tugasTambahan || ''}
                  onChange={handleChange}
                  placeholder="Contoh: Koordinator P5 / Pembina Ekstrakulikuler"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                <input
                  type="text"
                  name="pangkatGolongan"
                  value={formData.pangkatGolongan || ''}
                  onChange={handleChange}
                  placeholder="Contoh: III/c atau IX (PPPK)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sumber Gaji</label>
                <input
                  type="text"
                  name="sumberGaji"
                  value={formData.sumberGaji || ''}
                  onChange={handleChange}
                  placeholder="APBN / APBD Kabupaten/Kota / Yayasan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SK Pengangkatan</label>
                <input
                  type="text"
                  name="skPengangkatan"
                  value={formData.skPengangkatan || ''}
                  onChange={handleChange}
                  placeholder="Nomor SK Pengangkatan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">TMT Pengangkatan</label>
                <input
                  type="date"
                  name="tmtPengangkatan"
                  value={formData.tmtPengangkatan || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lembaga Pengangkatan</label>
                <input
                  type="text"
                  name="lembagaPengangkatan"
                  value={formData.lembagaPengangkatan || ''}
                  onChange={handleChange}
                  placeholder="Pemerintah Kab/Kota / Bupati / Kepala Sekolah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">TMT PNS</label>
                <input
                  type="date"
                  name="tmtPns"
                  value={formData.tmtPns || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sudah Lisensi Kepala Sekolah?</label>
                <select
                  name="lisensiKepalaSekolah"
                  value={formData.lisensiKepalaSekolah || 'Tidak'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ya">Ya</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pernah Diklat Kepengawasan?</label>
                <select
                  name="diklatKepengawasan"
                  value={formData.diklatKepengawasan || 'Tidak'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ya">Ya</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: ALAMAT & KONTAK */}
          {activeTab === 'alamat' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Alamat Jalan</label>
                <input
                  type="text"
                  name="alamatJalan"
                  value={formData.alamatJalan || ''}
                  onChange={handleChange}
                  placeholder="Jl. Sayuran No. 35B"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">RT</label>
                <input
                  type="text"
                  name="rt"
                  value={formData.rt || ''}
                  onChange={handleChange}
                  placeholder="01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">RW</label>
                <input
                  type="text"
                  name="rw"
                  value={formData.rw || ''}
                  onChange={handleChange}
                  placeholder="11"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Dusun / Kp</label>
                <input
                  type="text"
                  name="dusun"
                  value={formData.dusun || ''}
                  onChange={handleChange}
                  placeholder="Cibogo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Desa / Kelurahan</label>
                <input
                  type="text"
                  name="desa"
                  value={formData.desa || ''}
                  onChange={handleChange}
                  placeholder="Cibogo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan || ''}
                  onChange={handleChange}
                  placeholder="Kec. Lembang"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Pos</label>
                <input
                  type="text"
                  name="kodePos"
                  value={formData.kodePos || ''}
                  onChange={handleChange}
                  placeholder="40391"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp *</label>
                <input
                  type="text"
                  name="hp"
                  value={formData.hp || ''}
                  onChange={handleChange}
                  placeholder="081320705665"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Aktif</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="guru@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: KEUANGAN & LAINNYA */}
          {activeTab === 'keuangan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NPWP</label>
                <input
                  type="text"
                  name="npwp"
                  value={formData.npwp || ''}
                  onChange={handleChange}
                  placeholder="15 digit NPWP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Wajib Pajak</label>
                <input
                  type="text"
                  name="namaWajibPajak"
                  value={formData.namaWajibPajak || ''}
                  onChange={handleChange}
                  placeholder="Sesuai Kartu NPWP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Pembayaran Gaji</label>
                <input
                  type="text"
                  name="bank"
                  value={formData.bank || ''}
                  onChange={handleChange}
                  placeholder="Bank Jabar Banten (BJB) / BNI / BRI"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Rekening Bank</label>
                <input
                  type="text"
                  name="noRekening"
                  value={formData.noRekening || ''}
                  onChange={handleChange}
                  placeholder="Nomor Rekening"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rekening Atas Nama</label>
                <input
                  type="text"
                  name="rekeningAtasNama"
                  value={formData.rekeningAtasNama || ''}
                  onChange={handleChange}
                  placeholder="Sesuai Buku Tabungan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Perkawinan</label>
                <select
                  name="statusPerkawinan"
                  value={formData.statusPerkawinan || 'Kawin'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Kawin">Kawin</option>
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Duda/Janda">Duda / Janda</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Suami / Istri</label>
                <input
                  type="text"
                  name="namaSuamiIstri"
                  value={formData.namaSuamiIstri || ''}
                  onChange={handleChange}
                  placeholder="Nama Pasangan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Suami / Istri</label>
                <input
                  type="text"
                  name="pekerjaanSuamiIstri"
                  value={formData.pekerjaanSuamiIstri || ''}
                  onChange={handleChange}
                  placeholder="Wiraswasta / PNS / Lainnya"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kartu Pegawai (KARPEG)</label>
                <input
                  type="text"
                  name="karpeg"
                  value={formData.karpeg || ''}
                  onChange={handleChange}
                  placeholder="No. Karpeg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">KARIS / KARSU</label>
                <input
                  type="text"
                  name="karisKarsu"
                  value={formData.karisKarsu || ''}
                  onChange={handleChange}
                  placeholder="No. Karis/Karsu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
            <div className="text-xs text-slate-600">
              * Pastikan data NUPTK & NIP sesuai dengan SK Resmi Dapodik
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Data PTK
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
