import React from 'react';
import { X, Printer, GraduationCap, Download } from 'lucide-react';
import { Student, SchoolInfo } from '../types';
import { formatNisn } from '../utils/storage';

interface StudentCardPrintModalProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onClose: () => void;
}

export const StudentCardPrintModal: React.FC<StudentCardPrintModalProps> = ({
  students,
  schoolInfo,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Cetak Kartu Murid Digital ({students.length} Murid)</h2>
              <p className="text-xs text-slate-400">Pratinjau Kartu Murid Siap Cetak (Format Standard CR-80)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Sekarang
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Content Area */}
        <div id="printable-cards-area" className="p-8 overflow-y-auto flex-1 bg-slate-100 space-y-8 print:p-0 print:bg-white print:space-y-6">
          {students.map((student, idx) => (
            <div key={student.id || idx} className="page-break-inside-avoid flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* FRONT CARD */}
              <div className="w-[85.6mm] h-[53.98mm] bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white rounded-xl shadow-xl border border-slate-700/80 p-3 relative flex flex-col justify-between overflow-hidden shrink-0 print:border print:border-slate-400 print:shadow-none">
                {/* Decorative background shapes */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center space-x-2 border-b border-emerald-500/30 pb-2 z-10">
                  <div className="w-8 h-8 rounded-lg bg-white border border-emerald-400/50 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-xs overflow-hidden">
                    {schoolInfo.logoSekolah ? (
                      <img src={schoolInfo.logoSekolah} alt="Logo Sekolah" className="w-full h-full object-contain p-0.5" />
                    ) : (
                      <span className="font-black text-[10px] text-emerald-800">SD</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-emerald-300 truncate">
                      {schoolInfo.name}
                    </h3>
                    <p className="text-[8px] text-slate-300 truncate">
                      NPSN: {schoolInfo.npsn} • TA: {schoolInfo.tahunAjaran}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex items-center space-x-3 my-auto z-10">
                  {/* Photo Placeholder */}
                  <div className="w-16 h-20 bg-slate-800 border-2 border-emerald-400/50 rounded-md flex flex-col items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-inner">
                    {student.fotoUrl ? (
                      <img src={student.fotoUrl} alt={student.namaSiswa} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold">
                          {student.namaSiswa.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[7px] text-slate-400 mt-1">3x4 cm</span>
                      </>
                    )}
                  </div>

                  {/* Student Attributes */}
                  <div className="min-w-0 flex-1 space-y-0.5 text-[9px]">
                    <h4 className="font-extrabold text-white text-[11px] truncate text-emerald-200">
                      {student.namaSiswa}
                    </h4>
                    <p className="text-slate-300 font-mono">
                      NISN: <span className="font-bold text-white">{formatNisn(student.nisn) || '-'}</span>
                    </p>
                    <p className="text-slate-300 font-mono">
                      NIPD: <span className="font-bold text-white">{student.nipd || '-'}</span>
                    </p>
                    <p className="text-slate-300">
                      TTL: <span className="text-slate-100">{student.ttl || '-'}</span>
                    </p>
                    <p className="text-slate-300">
                      Rombel: <span className="font-bold text-emerald-400">Kelas {student.rombel}</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer Barcode & Stamp */}
                <div className="flex items-end justify-between border-t border-emerald-500/20 pt-1 z-10 text-[7px] text-slate-400">
                  <div>
                    <p className="font-mono text-[8px] text-slate-300">KARTU TANDA PELAJAR</p>
                  </div>

                  {/* Barcode representation */}
                  <div className="flex items-center space-x-0.5 bg-white p-0.5 rounded shadow-2xs">
                    <div className="w-0.5 h-3 bg-slate-900"></div>
                    <div className="w-1 h-3 bg-slate-900"></div>
                    <div className="w-0.5 h-3 bg-slate-900"></div>
                    <div className="w-1.5 h-3 bg-slate-900"></div>
                    <div className="w-0.5 h-3 bg-slate-900"></div>
                    <div className="w-1 h-3 bg-slate-900"></div>
                  </div>
                </div>
              </div>

              {/* BACK CARD */}
              <div className="w-[85.6mm] h-[53.98mm] bg-white text-slate-800 rounded-xl shadow-xl border border-slate-300 p-3 relative flex flex-col justify-between overflow-hidden shrink-0 print:border print:border-slate-400 print:shadow-none text-[8px]">
                <div className="border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase">TATA TERTIB PEMEGANG KARTU</span>
                  <span className="text-[7px] text-slate-500 font-mono">SIPA-CARD</span>
                </div>

                <ol className="list-decimal list-inside space-y-0.5 text-[7.5px] text-slate-600 leading-tight">
                  <li>Kartu ini adalah kartu identitas resmi murid {schoolInfo.name}.</li>
                  <li>Wajib dibawa selama kegiatan belajar di sekolah.</li>
                  <li>Jika menemukan kartu ini, harap mengembalikan ke {schoolInfo.address}.</li>
                </ol>

                <div className="flex items-end justify-between border-t border-slate-200 pt-1.5">
                  <div className="space-y-0.5 text-[7px] text-slate-500">
                    <p>Alamat: {schoolInfo.address}</p>
                    <p>Telp: {schoolInfo.phone || '022-2786500'}</p>
                  </div>

                  <div className="text-center font-sans text-[7.5px]">
                    <p className="text-slate-600">Lembang, Juli 2026</p>
                    <p className="font-bold text-slate-800 mt-0.5">Kepala Sekolah,</p>
                    <div className="h-4 my-0.5 flex items-center justify-center">
                      <span className="font-serif italic text-emerald-800 font-bold opacity-80 text-[8px]">[ TTD & Stempel ]</span>
                    </div>
                    <p className="font-bold underline text-slate-900">{schoolInfo.kepalaSekolah}</p>
                    <p className="text-[6.5px] text-slate-500 font-mono">NIP. {schoolInfo.nipKepala}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
