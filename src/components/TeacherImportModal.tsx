import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Teacher } from '../types';
import { parseTeachersFromExcel, downloadTeacherExcelTemplate, saveTeachers } from '../utils/storage';

interface TeacherImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeachersImported: (imported: Teacher[]) => void;
  existingTeachers: Teacher[];
}

export const TeacherImportModal: React.FC<TeacherImportModalProps> = ({
  isOpen,
  onClose,
  onTeachersImported,
  existingTeachers
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewTeachers, setPreviewTeachers] = useState<Teacher[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const parsed = await parseTeachersFromExcel(selectedFile);
      if (parsed.length === 0) {
        setErrorMsg('Tidak dapat membaca data Guru/PTK dari file tersebut. Pastikan format kolom sesuai dengan template Dapodik.');
        setPreviewTeachers([]);
      } else {
        setPreviewTeachers(parsed);
      }
    } catch (err) {
      console.error('Error parsing teacher excel file:', err);
      setErrorMsg('Gagal membaca file Excel. Harap periksa format file.');
      setPreviewTeachers([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewTeachers.length === 0) return;

    let updatedList: Teacher[] = [];
    if (importMode === 'replace') {
      updatedList = previewTeachers;
    } else {
      // Append mode: merge based on NUPTK or NIP or ID to prevent duplicates
      const existingMap = new Map<string, Teacher>();
      existingTeachers.forEach(t => {
        const key = t.nuptk || t.nip || t.nik || t.id;
        existingMap.set(key, t);
      });

      previewTeachers.forEach(t => {
        const key = t.nuptk || t.nip || t.nik || t.id;
        existingMap.set(key, t);
      });

      updatedList = Array.from(existingMap.values());
    }

    saveTeachers(updatedList);
    onTeachersImported(updatedList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import Data Guru & PTK (Excel / CSV)</h2>
              <p className="text-xs text-emerald-100/80">Unggah file rekapitulasi data PTK Dapodik sekolah Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: DOWNLOAD TEMPLATE & UPLOAD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" /> 1. Download Template Format PTK
                </h3>
                <p className="text-slate-600 text-[11px] mt-1">
                  Gunakan format standar Excel Dapodik agar nama kolom, NUPTK, NIP, dan jabatan terstruktur secara otomatis.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadTeacherExcelTemplate}
                className="mt-3 inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                Download Template Excel
              </button>
            </div>

            <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center flex flex-col items-center justify-center hover:bg-emerald-50 transition">
              <Upload className="w-8 h-8 text-emerald-600 mb-1" />
              <label className="cursor-pointer">
                <span className="font-bold text-emerald-800 text-xs hover:underline">
                  Pilih File Excel (.xlsx / .xls)
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {file ? file.name : 'Mendukung format file Excel dari Dapodik'}
              </p>
            </div>
          </div>

          {/* ERROR MSG */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* PREVIEW IMPORT TABLE */}
          {isProcessing ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <p>Membaca data dari file Excel, mohon tunggu...</p>
            </div>
          ) : previewTeachers.length > 0 ? (
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Terdeteksi {previewTeachers.length} Data Guru / PTK
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-600 font-medium">Opsi Import:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Gabungkan (Append/Update)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-rose-700 font-semibold">Ganti Semua Data</span>
                  </label>
                </div>
              </div>

              {/* PREVIEW TABLE */}
              <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">No</th>
                      <th className="py-2 px-3">Nama Lengkap</th>
                      <th className="py-2 px-3">NUPTK / NIP</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Jenis PTK</th>
                      <th className="py-2 px-3">No. HP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {previewTeachers.slice(0, 15).map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold">{t.nama}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{t.nuptk || t.nip || '-'}</td>
                        <td className="py-2 px-3">{t.statusKepegawaian || '-'}</td>
                        <td className="py-2 px-3">{t.jenisPtk || '-'}</td>
                        <td className="py-2 px-3">{t.hp || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewTeachers.length > 15 && (
                <p className="text-[11px] text-slate-500 text-center italic">
                  Menampilkan 15 dari total {previewTeachers.length} data guru yang akan diimport.
                </p>
              )}
            </div>
          ) : null}

        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-between items-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-xl text-xs transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={previewTeachers.length === 0}
            onClick={handleConfirmImport}
            className={`px-5 py-2 font-bold rounded-xl text-xs shadow-md transition cursor-pointer ${
              previewTeachers.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Proses Import ({previewTeachers.length} Guru)
          </button>
        </div>

      </div>
    </div>
  );
};
