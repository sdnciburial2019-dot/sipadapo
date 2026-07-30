import React, { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Users, 
  Award, 
  FileText, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Sparkles, 
  School,
  CheckCircle2,
  AlertCircle,
  Building2,
  Check
} from 'lucide-react';
import { Student } from '../types';
import { calculateStudentCompleteness, formatNisn } from '../utils/storage';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onPrintCard: (student: Student) => void;
  onPrintFpd: (student: Student) => void;
  onOpenDocsModal?: (docType?: string, student?: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEdit,
  onDelete,
  onPrintCard,
  onPrintFpd,
  onOpenDocsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'pribadi' | 'alamat' | 'ortu' | 'pip' | 'dokumen'>('pribadi');

  if (!student) return null;

  const { percentage, missing } = calculateStudentCompleteness(student);
  const isPip = student.layakPip === 'Ya' || student.penerimaKip === 'Ya';

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-5 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
                {student.namaSiswa.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">{student.namaSiswa}</h2>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Rombel {student.rombel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-3">
                  <span>NISN: <strong className="text-slate-200">{formatNisn(student.nisn) || '-'}</strong></span>
                  <span>•</span>
                  <span>NIPD: <strong className="text-slate-200">{student.nipd || '-'}</strong></span>
                  <span>•</span>
                  <span>NIK: <strong className="text-slate-200">{student.nik || '-'}</strong></span>
                </p>
              </div>
            </div>

            {/* Completeness Badge */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 text-right shrink-0">
              <span className="text-[11px] text-slate-400 block">Kelengkapan Data</span>
              <span className={`text-lg font-black ${
                percentage >= 85 ? 'text-emerald-400' : percentage >= 65 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {percentage}%
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('pribadi')}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pribadi' 
                  ? 'border-emerald-400 text-emerald-300 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Data Pribadi
            </button>

            <button
              onClick={() => setActiveTab('alamat')}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alamat' 
                  ? 'border-emerald-400 text-emerald-300 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Alamat & Kontak
            </button>

            <button
              onClick={() => setActiveTab('ortu')}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ortu' 
                  ? 'border-emerald-400 text-emerald-300 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Orang Tua / Wali
            </button>

            <button
              onClick={() => setActiveTab('pip')}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pip' 
                  ? 'border-emerald-400 text-emerald-300 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Beasiswa PIP & Bank
            </button>

            <button
              onClick={() => setActiveTab('dokumen')}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dokumen' 
                  ? 'border-emerald-400 text-emerald-300 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              Sekolah & Periodik
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-700 bg-slate-50/50">
          {/* TAB 1: DATA PRIBADI */}
          {activeTab === 'pribadi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm">Identitas Utama</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Lengkap</span>
                    <span className="font-semibold text-slate-900">{student.namaSiswa}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Jenis Kelamin</span>
                    <span className="font-semibold text-slate-900">{student.jk}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tempat, Tanggal Lahir</span>
                    <span className="font-semibold text-slate-900">{student.ttl || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Agama</span>
                    <span className="font-semibold text-slate-900">{student.agama || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">No. Registrasi Akta Lahir</span>
                    <span className="font-mono font-semibold text-slate-800">{student.aktaLahir || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Anak Ke-</span>
                    <span className="font-semibold text-slate-900">{student.anakKe || '1'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm">Nomor Induk & Kartu Keluarga</h3>
                
                <div className="space-y-2 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">NIK Siswa</span>
                    <span className="font-bold text-slate-900 text-sm">{student.nik || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nomor Kartu Keluarga (KK)</span>
                    <span className="font-bold text-slate-900 text-sm">{student.noKK || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Kebutuhan Khusus</span>
                    <span className="font-sans text-slate-800">{student.kebutuhanKhusus || 'Tidak Ada'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALAMAT & KONTAK */}
          {activeTab === 'alamat' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm">Alamat Domisili</h3>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Alamat Lengkap</span>
                    <span className="font-semibold text-slate-900">{student.alamat || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kecamatan</span>
                      <span className="font-semibold text-slate-900">{student.kecamatan || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kode Pos</span>
                      <span className="font-semibold text-slate-900">{student.kodePos || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Jenis Tempat Tinggal</span>
                    <span className="font-semibold text-slate-900">{student.jenisTinggal || 'Orang Tua'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm">Kontak & Transportasi</h3>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">No. Handphone / WhatsApp Ortu</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{student.hp || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Alamat Email</span>
                    <span className="font-mono text-slate-800">{student.email || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Alat Transportasi</span>
                      <span className="font-semibold text-slate-900">{student.transportasi || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Jarak Rumah ke Sekolah</span>
                      <span className="font-semibold text-slate-900">{student.jarakSekolahKM ? `${student.jarakSekolahKM} KM` : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORANG TUA / WALI */}
          {activeTab === 'ortu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data Ayah */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm flex items-center justify-between">
                  <span>Data Ayah Kandung</span>
                  <span className="text-[10px] text-slate-400 font-mono">NIK: {student.nikAyah || '-'}</span>
                </h3>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Ayah</span>
                    <span className="font-bold text-slate-900">{student.namaAyah || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tahun Lahir</span>
                      <span className="font-semibold text-slate-900">{student.tahunLahirAyah || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Pendidikan Terakhir</span>
                      <span className="font-semibold text-slate-900">{student.pendAyah || '-'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Pekerjaan</span>
                      <span className="font-semibold text-slate-900">{student.pekerjaanAyah || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Penghasilan Bulanan</span>
                      <span className="font-semibold text-slate-900">{student.penghasilanAyah || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Ibu */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm flex items-center justify-between">
                  <span>Data Ibu Kandung</span>
                  <span className="text-[10px] text-slate-400 font-mono">NIK: {student.nikIbu || '-'}</span>
                </h3>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Ibu</span>
                    <span className="font-bold text-slate-900">{student.namaIbu || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tahun Lahir</span>
                      <span className="font-semibold text-slate-900">{student.tahunLahirIbu || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Pendidikan Terakhir</span>
                      <span className="font-semibold text-slate-900">{student.pendIbu || '-'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Pekerjaan</span>
                      <span className="font-semibold text-slate-900">{student.pekerjaanIbu || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Penghasilan Bulanan</span>
                      <span className="font-semibold text-slate-900">{student.penghasilanIbu || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BEASISWA PIP & BANK */}
          {activeTab === 'pip' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Status Program Indonesia Pintar (PIP)
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700">Layak PIP / Penerima KIP:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                      isPip ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isPip ? 'Ya (Usulan Sekolah)' : 'Tidak'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Alasan Kelayakan PIP</span>
                    <span className="font-semibold text-slate-900">{student.alasanLayakPip || '-'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nomor KIP</span>
                      <span className="font-semibold text-slate-800">{student.nomorKip || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nomor KPS / PKH</span>
                      <span className="font-semibold text-slate-800">{student.noKps || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  Rekening Bank Penyalur PIP
                </h3>
                
                <div className="space-y-2 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Bank</span>
                    <span className="font-bold text-slate-900 font-sans">{student.bank || 'Bank Rakyat Indonesia (BRI)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nomor Rekening Bank</span>
                    <span className="font-bold text-emerald-700 text-sm">{student.noRekening || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Rekening Atas Nama</span>
                    <span className="font-sans text-slate-800 font-semibold">{student.rekeningAtasNama || student.namaSiswa}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEKOLAH & DOKUMEN */}
          {activeTab === 'dokumen' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm">Riwayat Sekolah & Ijazah</h3>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sekolah Asal (PAUD/TK)</span>
                    <span className="font-semibold text-slate-900">{student.sekolahAsal || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">No Peserta Ujian</span>
                      <span className="font-semibold text-slate-800">{student.noPesertaUN || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">No Seri Ijazah/SKHUN</span>
                      <span className="font-semibold text-slate-800">{student.noSeriIjazah || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 border-b pb-2 text-sm">Data Fisik & Periodik</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tinggi Badan</span>
                    <span className="font-bold text-slate-900 text-sm">{student.tinggiBadan || '120'} cm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Berat Badan</span>
                    <span className="font-bold text-slate-900 text-sm">{student.beratBadan || '20'} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lingkar Kepala</span>
                    <span className="font-semibold text-slate-900">{student.lingkarKepala || '50'} cm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Jumlah Saudara Kandung</span>
                    <span className="font-semibold text-slate-900">{student.jmlSaudara || '0'} orang</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completeness Warning list if any missing */}
          {missing.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Catatan Kelengkapan Data Dapodik:</p>
                <p className="text-[11px] mt-0.5 text-amber-800">
                  Field berikut belum diisi: <span className="font-semibold">{missing.join(', ')}</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Action Buttons */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPrintCard(student)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Cetak Kartu Murid
            </button>

            <button
              onClick={() => onPrintFpd(student)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Form Biodata F-PD
            </button>

            {onOpenDocsModal && (
              <button
                onClick={() => onOpenDocsModal('aktif', student)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <School className="w-4 h-4" />
                Cetak Surat Resmi
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(student)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold rounded-lg shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-amber-600" />
              Edit Data
            </button>

            <button
              onClick={() => onDelete(student)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
