import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { Student, SchoolInfo } from '../types';
import { formatNisn } from '../utils/storage';

interface DapodikFormPrintModalProps {
  student: Student;
  schoolInfo: SchoolInfo;
  onClose: () => void;
}

export const DapodikFormPrintModal: React.FC<DapodikFormPrintModalProps> = ({
  student,
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
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Formulir Murid (F-PD Dapodik)</h2>
              <p className="text-xs text-slate-400">Pratinjau Formulir Resmi Biodata Murid Siap Cetak A4</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Form (A4)
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Form Area */}
        <div id="printable-fpd-area" className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 text-xs font-sans space-y-4 print:p-0 print:text-[10px]">
          {/* Header Kop Formulir */}
          <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
            <h1 className="font-bold text-sm sm:text-base uppercase tracking-wider">
              FORMULIR MURID (F-PD)
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
            </p>
            <p className="text-xs text-slate-600">
              {schoolInfo.name} • NPSN: {schoolInfo.npsn} • TA: {schoolInfo.tahunAjaran} ({schoolInfo.semester})
            </p>
          </div>

          {/* Section 1: Data Sekolah */}
          <div className="border border-slate-400 rounded p-2.5 space-y-1 bg-slate-50/50">
            <h2 className="font-bold text-xs uppercase text-slate-900 border-b border-slate-300 pb-1">
              I. DATA SATUAN PENDIDIKAN
            </h2>
            <div className="grid grid-cols-2 gap-2 text-slate-800">
              <div>Nama Sekolah: <strong>{schoolInfo.name}</strong></div>
              <div>NPSN: <strong>{schoolInfo.npsn}</strong></div>
              <div>Alamat: {schoolInfo.address}</div>
              <div>Kecamatan: {schoolInfo.kecamatan}</div>
            </div>
          </div>

          {/* Section 2: Data Pribadi Siswa */}
          <div className="border border-slate-400 rounded p-2.5 space-y-1">
            <h2 className="font-bold text-xs uppercase text-slate-900 border-b border-slate-300 pb-1">
              II. DATA PRIBADI MURID
            </h2>
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-1 w-1/3 font-semibold text-slate-700">1. Nama Lengkap</td>
                  <td className="py-1 font-bold text-slate-900 uppercase">{student.namaSiswa}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">2. Jenis Kelamin</td>
                  <td className="py-1">{student.jk}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">3. NISN / NIPD</td>
                  <td className="py-1 font-mono font-bold">{formatNisn(student.nisn) || '-'} / {student.nipd || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">4. NIK Murid</td>
                  <td className="py-1 font-mono">{student.nik || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">5. Tempat, Tanggal Lahir</td>
                  <td className="py-1">{student.ttl || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">6. Agama & Kepercayaan</td>
                  <td className="py-1">{student.agama || 'Islam'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">7. No. Registrasi Akta Lahir</td>
                  <td className="py-1 font-mono">{student.aktaLahir || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">8. Alamat Tempat Tinggal</td>
                  <td className="py-1">{student.alamat || '-'} ({student.kecamatan || '-'})</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">9. No. HP WhatsApp Ortu</td>
                  <td className="py-1 font-mono font-bold text-emerald-800">{student.hp || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Data Ayah & Ibu Kandung */}
          <div className="border border-slate-400 rounded p-2.5 space-y-1">
            <h2 className="font-bold text-xs uppercase text-slate-900 border-b border-slate-300 pb-1">
              III. DATA ORANG TUA KANDUNG
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="font-bold border-b text-slate-800 pb-0.5">A. AYAH KANDUNG</p>
                <p>Nama: <strong>{student.namaAyah || '-'}</strong></p>
                <p className="font-mono">NIK: {student.nikAyah || '-'}</p>
                <p>Tahun Lahir: {student.tahunLahirAyah || '-'}</p>
                <p>Pendidikan: {student.pendAyah || '-'}</p>
                <p>Pekerjaan: {student.pekerjaanAyah || '-'}</p>
                <p>Penghasilan: {student.penghasilanAyah || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold border-b text-slate-800 pb-0.5">B. IBU KANDUNG</p>
                <p>Nama: <strong>{student.namaIbu || '-'}</strong></p>
                <p className="font-mono">NIK: {student.nikIbu || '-'}</p>
                <p>Tahun Lahir: {student.tahunLahirIbu || '-'}</p>
                <p>Pendidikan: {student.pendIbu || '-'}</p>
                <p>Pekerjaan: {student.pekerjaanIbu || '-'}</p>
                <p>Penghasilan: {student.penghasilanIbu || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Data Kesejahteraan & PIP */}
          <div className="border border-slate-400 rounded p-2.5 space-y-1">
            <h2 className="font-bold text-xs uppercase text-slate-900 border-b border-slate-300 pb-1">
              IV. BANTUAN KESEJAHTERAAN & PROGRAM INDONESIA PINTAR (PIP)
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div>Penerima KPS/PKH: <strong>{student.penerimaKps || 'Tidak'}</strong> (No: {student.noKps || '-'})</div>
              <div>Penerima KIP: <strong>{student.penerimaKip || 'Tidak'}</strong> (No: {student.nomorKip || '-'})</div>
              <div>Layak PIP (Usulan Sekolah): <strong>{student.layakPip || 'Tidak'}</strong></div>
              <div>Alasan Usulan PIP: {student.alasanLayakPip || '-'}</div>
              <div>Bank & No. Rekening PIP: {student.bank || 'BRI'} - {student.noRekening || '-'}</div>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-6 flex justify-between items-end text-center">
            <div className="w-1/3">
              <p className="mb-12">Orang Tua / Wali Murid,</p>
              <p className="font-bold underline uppercase">( {student.namaAyah || student.namaIbu || '........................'} )</p>
            </div>

            <div className="w-1/3">
              <p>Lembang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="mb-12">Kepala Sekolah,</p>
              <p className="font-bold underline">( {schoolInfo.kepalaSekolah} )</p>
              <p className="text-[10px] text-slate-600 font-mono">NIP. {schoolInfo.nipKepala}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
