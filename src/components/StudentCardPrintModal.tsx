import React, { useRef } from 'react';
import { X, Printer, GraduationCap, Camera, Trash2, Upload } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Student, SchoolInfo } from '../types';
import { formatNisn } from '../utils/storage';

interface StudentCardPrintModalProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onClose: () => void;
  onUpdateStudent?: (student: Student) => void;
}

export const StudentCardPrintModal: React.FC<StudentCardPrintModalProps> = ({
  students,
  schoolInfo,
  onClose,
  onUpdateStudent,
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = (student: Student, file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto terlalu besar. Maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data && onUpdateStudent) {
        onUpdateStudent({
          ...student,
          fotoUrl: base64Data,
          updatedAt: new Date().toISOString(),
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (student: Student) => {
    if (confirm(`Apakah Anda yakin ingin menghapus foto murid ${student.namaSiswa}?`)) {
      if (onUpdateStudent) {
        onUpdateStudent({
          ...student,
          fotoUrl: '',
          updatedAt: new Date().toISOString(),
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8 shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2.5">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Cetak Kartu Murid Digital ({students.length} Murid)</h2>
              <p className="text-xs text-slate-400">Pratinjau Kartu Murid Resmi CR-80 dengan QR Code NISN & Pas Foto 3x4</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
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

        {/* Instructions / Upload Bar for Screen View */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 print:hidden">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Fitur Pas Foto:</strong> Arahkan kursor ke area foto murid di kartu untuk mengunggah atau mengganti foto pas murid (Format 3x4 latar merah).
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-mono hidden sm:inline">QR Code otomatis terisi NISN Murid</span>
        </div>

        {/* Print Content Area */}
        <div id="printable-cards-area" className="p-8 overflow-y-auto flex-1 bg-slate-100 space-y-10 print:p-0 print:bg-white print:space-y-6">
          {students.map((student, idx) => {
            const nisnFormatted = formatNisn(student.nisn);
            const qrValue = nisnFormatted ? nisnFormatted : (student.nipd || student.namaSiswa || 'NISN-SD');

            return (
              <div key={student.id || idx} className="page-break-inside-avoid flex flex-col xl:flex-row gap-8 justify-center items-center">
                
                {/* ========================================== */}
                {/* FRONT CARD DESIGN (CR-80 Format: 85.6mm x 53.98mm) */}
                {/* ========================================== */}
                <div className="w-[85.6mm] h-[53.98mm] bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 relative overflow-hidden flex flex-col justify-between print:shadow-none print:border-slate-400 select-none shrink-0 font-sans">
                  
                  {/* --- GEOMETRIC BACKGROUND POLYGONS --- */}
                  {/* Top right orange polygon accent */}
                  <div 
                    className="absolute top-0 right-0 w-[42%] h-[40%] bg-[#f58220] z-0 pointer-events-none"
                    style={{ clipPath: 'polygon(100% 0, 32% 0, 100% 100%)' }}
                  />

                  {/* Right side main dark green diagonal polygon */}
                  <div 
                    className="absolute top-0 right-0 w-[52%] h-full bg-[#006837] z-0 pointer-events-none"
                    style={{ clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 0% 100%)' }}
                  />

                  {/* Bottom dark green diagonal accent block */}
                  <div 
                    className="absolute bottom-0 right-[35%] w-[38%] h-[20%] bg-[#004f29] z-0 pointer-events-none"
                    style={{ clipPath: 'polygon(35% 0, 100% 0, 65% 100%, 0% 100%)' }}
                  />

                  {/* Top-left green header badge block */}
                  <div 
                    className="absolute top-0 left-0 w-[72%] h-[27%] bg-[#006837] z-0 pointer-events-none"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' }}
                  />


                  {/* --- CONTENT LAYER (Z-10) --- */}
                  <div className="relative z-10 w-full h-full p-2.5 flex flex-col justify-between">
                    
                    {/* 1. HEADER LOGO & SCHOOL NAME */}
                    <div className="flex items-center justify-between h-[28px] pl-0.5">
                      <div className="flex items-center space-x-2">
                        {/* School Logo */}
                        <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center shrink-0 shadow-xs border border-emerald-800/30 overflow-hidden">
                          {schoolInfo.logoSekolah ? (
                            <img src={schoolInfo.logoSekolah} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-[#006837] text-white font-black text-[7.5px] flex items-center justify-center rounded-xs">
                              SD
                            </div>
                          )}
                        </div>
                        
                        {/* School Name Text */}
                        <div className="text-white leading-tight">
                          <p className="text-[7.5px] font-bold tracking-wider uppercase opacity-95">SEKOLAH DASAR</p>
                          <p className="text-[9.5px] font-black tracking-wide uppercase">
                            {schoolInfo.name ? schoolInfo.name.replace(/^SDN\s+|^SD\s+/i, 'NEGERI ') : 'NEGERI CIBURIAL'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2. CARD TITLE: KARTU PELAJAR */}
                    <div className="mt-1 mb-0.5 pl-1">
                      <h3 className="text-[14.5px] font-black tracking-wider text-[#ffffff] uppercase leading-none">
                        KARTU PELAJAR
                      </h3>
                      <div className="flex h-[2.5px] w-36 mt-1 rounded-full overflow-hidden">
                        <div className="w-[68%] bg-[#006837]" />
                        <div className="w-[32%] bg-[#f58220]" />
                      </div>
                    </div>

                    {/* 3. MIDDLE MAIN BODY: STUDENT DETAILS + PHOTO + QR */}
                    <div className="flex-1 flex items-start justify-between pl-1 pr-0.5 pt-1">
                      
                      {/* Left Side: Student Attributes */}
                      <div className="min-w-0 flex-1 space-y-0.5 text-[8.5px] text-slate-900 pr-1">
                        <div className="grid grid-cols-[40px_6px_1fr] items-baseline">
                          <span className="font-semibold text-slate-800">Nama</span>
                          <span>:</span>
                          <span className="font-black text-slate-950 uppercase truncate tracking-tight text-[8.5px]">
                            {student.namaSiswa}
                          </span>
                        </div>

                        <div className="grid grid-cols-[40px_6px_1fr] items-baseline">
                          <span className="font-semibold text-slate-800">NIPD</span>
                          <span>:</span>
                          <span className="font-bold text-slate-900 font-mono text-[8.5px]">
                            {student.nipd || '-'}
                          </span>
                        </div>

                        <div className="grid grid-cols-[40px_6px_1fr] items-baseline">
                          <span className="font-semibold text-slate-800">NISN</span>
                          <span>:</span>
                          <span className="font-bold text-slate-900 font-mono text-[8.5px]">
                            {nisnFormatted || '-'}
                          </span>
                        </div>

                        <div className="grid grid-cols-[40px_6px_1fr] items-baseline">
                          <span className="font-semibold text-slate-800">TTL</span>
                          <span>:</span>
                          <span className="font-medium text-slate-800 truncate text-[7.5px] uppercase">
                            {student.ttl || '-'}
                          </span>
                        </div>

                        <div className="grid grid-cols-[40px_6px_1fr] items-start">
                          <span className="font-semibold text-slate-800">Alamat</span>
                          <span>:</span>
                          <span className="font-medium text-slate-800 leading-tight text-[7.5px] line-clamp-2">
                            {student.alamat || '-'}
                          </span>
                        </div>
                      </div>

                      {/* Right Side: Pas Foto (3x4 Red Background) & QR Code */}
                      <div className="flex flex-col items-center justify-between h-full space-y-1 pl-1 shrink-0">
                        
                        {/* PAS FOTO (3x4 Ratio with Red Background) */}
                        <div className="relative group">
                          <div className="w-[50px] h-[64px] bg-red-600 rounded-md p-[2px] shadow-md border border-white/80 overflow-hidden flex items-center justify-center shrink-0">
                            {student.fotoUrl ? (
                              <img 
                                src={student.fotoUrl} 
                                alt={student.namaSiswa} 
                                className="w-full h-full object-cover rounded-[3px]" 
                              />
                            ) : (
                              <div className="w-full h-full bg-red-600 flex flex-col items-center justify-center text-white text-center p-0.5">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                  <Camera className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-[5.5px] font-bold mt-0.5 uppercase tracking-tighter opacity-90">Foto 3x4</span>
                              </div>
                            )}
                          </div>

                          {/* Screen Overlay Button for Direct Photo Upload */}
                          <label 
                            htmlFor={`photo-upload-input-${student.id}`} 
                            className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col items-center justify-center text-white text-[6.5px] font-bold cursor-pointer print:hidden text-center p-1"
                            title="Klik untuk Mengunggah / Mengganti Foto Pas Murid"
                          >
                            <Upload className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
                            <span>{student.fotoUrl ? 'Ubah Foto' : 'Upload'}</span>
                          </label>
                          <input 
                            type="file" 
                            id={`photo-upload-input-${student.id}`} 
                            ref={el => { fileInputRefs.current[student.id] = el; }}
                            accept="image/*" 
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(student, file);
                            }} 
                            className="hidden print:hidden" 
                          />
                        </div>

                        {/* QR CODE CONTAINER WITH ORANGE BORDER */}
                        <div className="bg-white rounded-lg p-1 border-[2px] border-amber-400 shadow-md flex items-center justify-center shrink-0">
                          <QRCodeSVG 
                            value={qrValue} 
                            size={48} 
                            level="M" 
                            includeMargin={false}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. BOTTOM DOT MATRIX ACCENT PATTERN */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="grid grid-cols-6 gap-0.5 w-9 text-slate-400 opacity-60">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* ========================================== */}
                {/* BACK CARD DESIGN (CR-80 Format: 85.6mm x 53.98mm) */}
                {/* ========================================== */}
                <div className="w-[85.6mm] h-[53.98mm] bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-300 p-3 relative flex flex-col justify-between overflow-hidden shrink-0 print:border print:border-slate-400 print:shadow-none text-[8px] font-sans">
                  
                  {/* Top Header Bar */}
                  <div className="border-b-2 border-[#006837] pb-1 flex items-center justify-between">
                    <span className="font-extrabold text-[#005028] uppercase text-[8.5px] tracking-wide">TATA TERTIB PEMEGANG KARTU</span>
                    <span className="text-[7px] text-slate-500 font-mono font-bold">KARTU DIGITAL</span>
                  </div>

                  {/* Rules list */}
                  <ol className="list-decimal list-inside space-y-1 text-[7.5px] text-slate-700 leading-tight py-1">
                    <li>Kartu ini merupakan Kartu Tanda Pelajar resmi murid <strong>{schoolInfo.name}</strong>.</li>
                    <li>Wajib dibawa selama mengikuti kegiatan belajar mengajar dan kegiatan sekolah.</li>
                    <li>QR Code berisi verifikasi NISN murid untuk keperluan presensi dan administrasi.</li>
                    <li>Jika menemukan kartu ini, mohon dikembalikan ke alamat sekolah berikut.</li>
                  </ol>

                  {/* Footer Address & Signature */}
                  <div className="flex items-end justify-between border-t border-slate-200 pt-1">
                    <div className="space-y-0.5 text-[6.5px] text-slate-500 max-w-[130px]">
                      <p className="truncate"><strong>Alamat:</strong> {schoolInfo.address}</p>
                      <p><strong>Kecamatan:</strong> {schoolInfo.kecamatan} - {schoolInfo.kabupaten}</p>
                      <p><strong>Telp:</strong> {schoolInfo.phone || '022-2786500'}</p>
                    </div>

                    <div className="text-center font-sans text-[7px] shrink-0">
                      <p className="text-slate-600">{schoolInfo.kabupaten || 'Bandung Barat'}, Juli 2026</p>
                      <p className="font-bold text-slate-900">Kepala Sekolah,</p>
                      <div className="h-3.5 my-0.5 flex items-center justify-center">
                        <span className="font-serif italic text-emerald-800 font-bold opacity-80 text-[7.5px]">[ TTD & Stempel ]</span>
                      </div>
                      <p className="font-bold underline text-slate-950 uppercase">{schoolInfo.kepalaSekolah}</p>
                      <p className="text-[6px] text-slate-500 font-mono">NIP. {schoolInfo.nipKepala}</p>
                    </div>
                  </div>
                </div>

                {/* Side Photo Management Controls Bar for Screen Mode */}
                <div className="flex flex-col gap-2 print:hidden bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-700 w-full sm:w-auto min-w-[180px]">
                  <p className="font-bold text-slate-900 border-b pb-1 text-[11px] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pas Foto {student.namaSiswa.split(' ')[0]}</span>
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[student.id]?.click()}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{student.fotoUrl ? 'Ganti Foto' : 'Upload Foto 3x4'}</span>
                    </button>

                    {student.fotoUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(student)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer border border-rose-200"
                        title="Hapus Foto Murid"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 italic leading-tight">
                    *Foto otomatis ditampilkan di kartu dan disimpan ke database murid.
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

