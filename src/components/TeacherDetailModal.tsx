import React from 'react';
import { X, Printer, User, Briefcase, MapPin, CreditCard, Award, Phone, Mail, GraduationCap, BookOpen } from 'lucide-react';
import { Teacher, SchoolInfo } from '../types';

interface TeacherDetailModalProps {
  teacher: Teacher | null;
  schoolInfo: SchoolInfo;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  teacher,
  schoolInfo,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!isOpen || !teacher) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-none print:max-h-none print:fixed print:inset-0 print:bg-white print:z-[9999]">
        
        {/* MODAL HEADER - HIDDEN IN PRINT */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Profil Lengkap PTK / Guru</h2>
              <p className="text-xs text-slate-400">Formulir Data Pendidik & Tenaga Kependidikan (F-PTK)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(teacher)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Edit Data
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Cetak Form F-PTK
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE PROFIL CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 print:p-8 print:text-black print:overflow-visible">
          
          {/* FORMULIR F-PTK HEADER */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</div>
              <h1 className="text-lg font-black text-slate-900 uppercase">FORMULIR PTK (PENDIDIK DAN TENAGA KEPENDIDIKAN)</h1>
              <p className="text-xs font-medium text-slate-600">
                {schoolInfo.name} - NPSN: {schoolInfo.npsn} | {schoolInfo.kecamatan}, {schoolInfo.kabupaten}
              </p>
            </div>
            <div className="text-right shrink-0 border border-slate-300 p-2 rounded-lg bg-slate-50 text-[10px]">
              <div className="font-bold text-slate-700">KODE PTK</div>
              <div className="font-mono font-bold text-emerald-700">{teacher.id}</div>
            </div>
          </div>

          {/* PTK PROFILE SUMMARY CARD */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-32 bg-slate-200 rounded-xl border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
              {teacher.fotoUrl ? (
                <img src={teacher.fotoUrl} alt={teacher.nama} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 stroke-1" />
              )}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold tracking-wider uppercase">
                  {teacher.statusKepegawaian || 'PNS'}
                </span>
                <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[10px] font-bold">
                  {teacher.jenisPtk || 'Guru Kelas'}
                </span>
                {teacher.tugasTambahan && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[10px] font-bold">
                    {teacher.tugasTambahan}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900">{teacher.nama}</h2>
              <div className="text-xs text-slate-600 font-mono space-x-3">
                <span>NUPTK: {teacher.nuptk || '-'}</span>
                <span>•</span>
                <span>NIP: {teacher.nip || '-'}</span>
              </div>
              <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 pt-2 border-t border-slate-200">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {teacher.hp || '-'}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-600" /> {teacher.email || '-'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: IDENTITAS DIRI */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" /> 1. IDENTITAS PENDIDIK & TENAGA KEPENDIDIKAN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-200">
              <div><span className="text-slate-500 block text-[10px]">Nama Lengkap:</span><span className="font-semibold">{teacher.nama}</span></div>
              <div><span className="text-slate-500 block text-[10px]">NIK (KTP):</span><span className="font-semibold font-mono">{teacher.nik || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">No. Kartu Keluarga:</span><span className="font-semibold font-mono">{teacher.noKk || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Jenis Kelamin:</span><span className="font-semibold">{teacher.jk}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Tempat, Tgl Lahir:</span><span className="font-semibold">{teacher.tempatLahir ? `${teacher.tempatLahir}, ${teacher.tanggalLahir || ''}` : '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Agama:</span><span className="font-semibold">{teacher.agama || 'Islam'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Nama Ibu Kandung:</span><span className="font-semibold">{teacher.namaIbuKandung || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Status Perkawinan:</span><span className="font-semibold">{teacher.statusPerkawinan || 'Kawin'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Nama Pasangan:</span><span className="font-semibold">{teacher.namaSuamiIstri || '-'}</span></div>
            </div>
          </div>

          {/* SECTION 2: KEPEGAWAIAN & TUGAS */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" /> 2. DATA KEPEGAWAIAN & SK
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-200">
              <div><span className="text-slate-500 block text-[10px]">Status Kepegawaian:</span><span className="font-bold text-emerald-700">{teacher.statusKepegawaian || 'PNS'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Jenis PTK:</span><span className="font-semibold">{teacher.jenisPtk || 'Guru Kelas'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Tugas Tambahan:</span><span className="font-semibold">{teacher.tugasTambahan || 'Tidak ada'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">NIP:</span><span className="font-semibold font-mono">{teacher.nip || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">NUPTK:</span><span className="font-semibold font-mono">{teacher.nuptk || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Pangkat / Golongan:</span><span className="font-semibold">{teacher.pangkatGolongan || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">SK Pengangkatan:</span><span className="font-semibold">{teacher.skPengangkatan || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">TMT Pengangkatan:</span><span className="font-semibold">{teacher.tmtPengangkatan || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Lembaga Pengangkatan:</span><span className="font-semibold">{teacher.lembagaPengangkatan || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Sumber Gaji:</span><span className="font-semibold">{teacher.sumberGaji || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">TMT PNS:</span><span className="font-semibold">{teacher.tmtPns || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Lisensi Kepala Sekolah:</span><span className="font-semibold">{teacher.lisensiKepalaSekolah || 'Tidak'}</span></div>
            </div>
          </div>

          {/* SECTION 3: TUGAS MENGAJAR & SERDIK */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" /> 3. DATA TUGAS MENGAJAR & SERDIK
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs bg-indigo-50/40 p-3 rounded-lg border border-indigo-100">
              <div><span className="text-slate-500 block text-[10px]">Mata Pelajaran Diampu:</span><span className="font-bold text-indigo-900">{teacher.mapelDiampu || teacher.jenisPtk || 'Guru Kelas SD'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Rombel / Kelas Mengajar:</span><span className="font-bold text-slate-800">{teacher.rombelMengajar || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Jam Mengajar (JJM):</span><span className="font-bold text-emerald-700">{teacher.jumlahJamMengajar ? `${teacher.jumlahJamMengajar} Jam/Minggu` : '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">SK Tugas Mengajar:</span><span className="font-semibold font-mono">{teacher.skMengajar || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Tanggal SK Mengajar:</span><span className="font-semibold">{teacher.tanggalSkMengajar || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Status Sertifikasi:</span><span className="font-bold text-teal-800">{teacher.statusSertifikasi || 'Sudah Sertifikasi'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">No. Registrasi Guru (NRG):</span><span className="font-semibold font-mono">{teacher.nrg || '-'}</span></div>
            </div>
          </div>

          {/* SECTION 4: ALAMAT DOMISILI */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> 4. ALAMAT DOMISILI & KONTAK
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-200">
              <div className="sm:col-span-2"><span className="text-slate-500 block text-[10px]">Alamat Jalan:</span><span className="font-semibold">{teacher.alamatJalan || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">RT / RW:</span><span className="font-semibold">{teacher.rt || '0'}/{teacher.rw || '0'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Dusun / Kampung:</span><span className="font-semibold">{teacher.dusun || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Desa / Kelurahan:</span><span className="font-semibold">{teacher.desa || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Kecamatan:</span><span className="font-semibold">{teacher.kecamatan || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Kode Pos:</span><span className="font-semibold">{teacher.kodePos || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">No. Handphone:</span><span className="font-semibold">{teacher.hp || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Email:</span><span className="font-semibold">{teacher.email || '-'}</span></div>
            </div>
          </div>

          {/* SECTION 4: KEUANGAN & DOKUMEN */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" /> 4. KEUANGAN, PAJAK & DOKUMEN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-200">
              <div><span className="text-slate-500 block text-[10px]">NPWP:</span><span className="font-semibold font-mono">{teacher.npwp || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Nama Wajib Pajak:</span><span className="font-semibold">{teacher.namaWajibPajak || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Bank Pembayaran Gaji:</span><span className="font-semibold">{teacher.bank || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Nomor Rekening:</span><span className="font-semibold font-mono">{teacher.noRekening || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Rekening Atas Nama:</span><span className="font-semibold">{teacher.rekeningAtasNama || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">No. KARPEG:</span><span className="font-semibold">{teacher.karpeg || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">KARIS / KARSU:</span><span className="font-semibold">{teacher.karisKarsu || '-'}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Lintang / Bujur:</span><span className="font-semibold font-mono">{teacher.lintang || '-'}, {teacher.bujur || '-'}</span></div>
            </div>
          </div>

          {/* TANDA TANGAN SECTION FOR PRINT */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center border-t border-slate-300 print:mt-10">
            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-900 mt-0.5">Kepala Sekolah</p>
              <div className="h-20"></div>
              <p className="font-bold underline text-slate-900">{schoolInfo.kepalaSekolah || '(....................................)'}</p>
              <p className="text-[10px] text-slate-500">NIP: {schoolInfo.nipKepala || '....................................'}</p>
            </div>
            <div>
              <p className="text-slate-600">{schoolInfo.kabupaten || 'Lembang'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold text-slate-900 mt-0.5">Guru / PTK Bersangkutan</p>
              <div className="h-20"></div>
              <p className="font-bold underline text-slate-900">{teacher.nama}</p>
              <p className="text-[10px] text-slate-500">NIP/NUPTK: {teacher.nip || teacher.nuptk || '-'}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
