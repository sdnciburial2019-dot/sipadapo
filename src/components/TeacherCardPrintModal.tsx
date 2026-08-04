import React from 'react';
import { X, Printer, Download, CreditCard, Sparkles, Building2, User } from 'lucide-react';
import { Teacher, SchoolInfo } from '../types';

interface TeacherCardPrintModalProps {
  teacher: Teacher | null;
  schoolInfo: SchoolInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherCardPrintModal: React.FC<TeacherCardPrintModalProps> = ({
  teacher,
  schoolInfo,
  isOpen,
  onClose
}) => {
  if (!isOpen || !teacher) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-none print:max-h-none print:fixed print:inset-0 print:bg-white print:z-[9999]">
        
        {/* MODAL HEADER - HIDDEN IN PRINT */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Kartu PTK / Guru Digital</h2>
              <p className="text-xs text-emerald-100/80">Kartu Identitas Resmi Pendidik & Tenaga Kependidikan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              Cetak Kartu PTK
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CARD CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center justify-center gap-8 bg-slate-100 print:bg-white print:p-0">
          
          {/* CR-80 CARD DIMENSION FRAME (85.6mm x 53.9mm standard) */}
          <div className="relative w-[340px] h-[215px] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-emerald-500/30 flex flex-col justify-between p-3.5 shrink-0 print:shadow-none print:border print:border-slate-300">
            
            {/* CARD BACKGROUND ACCENT DECORATION */}
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* CARD HEADER */}
            <div className="relative z-10 flex items-start gap-2 border-b border-emerald-500/30 pb-2">
              <div className="w-9 h-9 bg-white rounded-lg p-1 shrink-0 shadow-sm flex items-center justify-center">
                {schoolInfo.logoSekolah ? (
                  <img src={schoolInfo.logoSekolah} alt="Logo Sekolah" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-6 h-6 text-emerald-800" />
                )}
              </div>
              <div className="flex-1 leading-tight">
                <div className="text-[8px] font-bold text-emerald-300 tracking-wider uppercase">KARTU PTK DITJEN PAUD DASMEN</div>
                <h3 className="text-[11px] font-black text-white uppercase line-clamp-1">{schoolInfo.name}</h3>
                <p className="text-[8px] text-slate-300">NPSN: {schoolInfo.npsn} | {schoolInfo.kecamatan}</p>
              </div>
            </div>

            {/* CARD BODY */}
            <div className="relative z-10 flex items-center gap-3 my-auto">
              <div className="w-16 h-20 bg-slate-800/80 rounded-lg border-2 border-emerald-400/50 overflow-hidden shrink-0 shadow-md flex items-center justify-center text-slate-400">
                {teacher.fotoUrl ? (
                  <img src={teacher.fotoUrl} alt={teacher.nama} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 stroke-1 text-slate-400" />
                )}
              </div>

              <div className="flex-1 text-[10px] space-y-0.5">
                <div className="inline-block px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded text-[7.5px] font-bold uppercase mb-0.5">
                  {teacher.statusKepegawaian || 'PNS'} • {teacher.jenisPtk || 'Guru'}
                </div>
                <h4 className="font-extrabold text-white text-[12px] leading-snug line-clamp-1">{teacher.nama}</h4>
                <p className="text-emerald-200 font-mono text-[9px]">NUPTK: {teacher.nuptk || '-'}</p>
                <p className="text-slate-300 font-mono text-[8.5px]">NIP: {teacher.nip || '-'}</p>
                <p className="text-amber-300 font-semibold text-[8.5px] line-clamp-1">
                  Mengajar: {teacher.mapelDiampu || teacher.jenisPtk || 'Guru Kelas SD'} {teacher.rombelMengajar ? `(${teacher.rombelMengajar})` : ''}
                </p>
                {teacher.tugasTambahan && (
                  <p className="text-amber-300 font-semibold text-[8.5px] line-clamp-1">Tugas: {teacher.tugasTambahan}</p>
                )}
              </div>
            </div>

            {/* CARD FOOTER */}
            <div className="relative z-10 flex items-center justify-between border-t border-emerald-500/30 pt-1.5 text-[8px] text-slate-300">
              <div>
                <span>Berlaku: </span>
                <span className="font-semibold text-white">T.A. {schoolInfo.tahunAjaran}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-300 uppercase">SIPA DAPODIK RESMI</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center max-w-md print:hidden">
            Kartu PTK ini diformat khusus sesuai ukuran standar cetak ID Card (85.6mm x 53.9mm). Gunakan opsi cetak browser atau simpan sebagai PDF.
          </p>

        </div>
      </div>
    </div>
  );
};
